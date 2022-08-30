import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Form, RadioProps, Input } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { EXTENSION, fileUtil } from '@nara.drama/depot';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import {
  GroupBasedAccessRuleModel,
  SelectType,
  GroupAccessRule,
  UserGroupRuleModel,
  PolyglotModel,
  FileUploadType,
} from 'shared/model';
import { SharedService, AccessRuleService } from 'shared/present';
import { SubActions, AccessRuleSettings, alert, AlertModel, PageTitle, Polyglot } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';
import { Language, isDefaultPolyglotBlank } from 'shared/components/Polyglot';

import { CardBundleType } from '_data/arrange/cardBundles/model/vo';

import { displayManagementUrl } from '../../../Routes';
import { UserGroupService } from 'usergroup';
import { CollegeService } from 'college';
import { CardService, CardWithContents } from 'card';
import CardSelectInfoListContainer from 'card/card/ui/shared/logic/CardSelectInfoListContainer';

import { CardBundleService } from '../../index';
import { getCardBundleNameValueList, getCardBundleCdo } from '../../shared/util';
import CardBundleBasicInfoView from '../view/CardBundleBasicInfoView';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cardBundleId: string;
  cineroomId: string;
}

interface States {
  isUpdatable: boolean;
}

interface Injected {
  cardBundleService: CardBundleService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
  cardService: CardService;
  collegeService: CollegeService;
  sharedService: SharedService;
  loaderService: LoaderService;
}

@inject(
  'cardBundleService',
  'accessRuleService',
  'userGroupService',
  'cardService',
  'collegeService',
  'sharedService',
  'loaderService'
)
@observer
@reactAutobind
class CreateCardBundleContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      isUpdatable: false,
    };

    this.injected.cardService.clearModalCardQuery();
    this.injected.cardService.clearCards();
  }

  componentDidMount(): void {
    //
    const { cardService, cardBundleService } = this.injected;
    const { cardBundleId } = this.props.match.params;
    if (cardBundleId) {
      this.initialize(cardBundleId);
    } else {
      cardBundleService.clearCardBundle();
      cardBundleService.clearFileName();
      cardService.clearCards();
      this.setState({ isUpdatable: true });
    }
  }

  async initialize(cardBundleId: string) {
    //
    this.injected.loaderService.openLoader(true);
    await this.findCardBundleById(cardBundleId);
    await this.findGroupBasedAccessRules();
    await this.findCardByIds();
    this.injected.loaderService.closeLoader(true);
  }

  async findCardBundleById(cardBundleId: string) {
    //
    const { cardBundleService } = this.injected;
    await cardBundleService.findCardBundle(cardBundleId);
  }

  async findGroupBasedAccessRules(): Promise<void> {
    //
    const { cardBundleService, accessRuleService, userGroupService } = this.injected;
    await userGroupService.findUserGroupMap();

    const accessRules: GroupAccessRule[] = cardBundleService.cardBundleForm.groupBasedAccessRule.accessRules.map(
      (accessRule): GroupAccessRule =>
        new GroupAccessRule(
          accessRule.groupSequences
            .map((groupSequence): UserGroupRuleModel => {
              const userGroup = userGroupService.userGroupMap.get(groupSequence);
              return new UserGroupRuleModel(
                userGroup?.categoryId,
                userGroup?.categoryName,
                userGroup?.userGroupId,
                userGroup?.userGroupName,
                userGroup?.seq
              );
            })
            .filter((userGroupRuleModel) => userGroupRuleModel.categoryId !== null)
        )
    );
    const groupBasedAccessRuleModel = new GroupBasedAccessRuleModel();

    groupBasedAccessRuleModel.useWhitelistPolicy =
      cardBundleService.cardBundleForm.groupBasedAccessRule.useWhitelistPolicy;
    groupBasedAccessRuleModel.accessRules = accessRules;

    accessRuleService.setGroupBasedAccessRule(groupBasedAccessRuleModel);
  }

  async findCardByIds(): Promise<void> {
    //
    const { cardService, cardBundleService } = this.injected;
    const cards = await cardService.findCardsForAdminByIds(cardBundleService.cardBundleForm.cardIds);
    await cardService.setCards(cards.map((card) => new CardWithContents(card)));
  }

  async findLastNApproved(): Promise<void> {
    //
    const { cardService } = this.injected;
    const { cardQuery } = cardService;
    await cardService.findLastNApproved(cardQuery.count);
  }

  async findTopNStudentPassedCardsByLastDay(): Promise<void> {
    //
    const { cardService } = this.injected;
    const { cardQuery } = cardService;
    await cardService.findTopNStudentPassedCardsByLastDay(cardQuery.count, cardQuery.lastN);
  }

  changeCardBundleFormProps(name: string, value: any) {
    //
    const { cardBundleService } = this.injected;
    cardBundleService.changeCardBundleFormProps(name, value);
  }

  changeCardBundleRadioProps(e: React.SyntheticEvent, { value }: RadioProps) {
    //
    const valueAsBoolean = typeof value === 'string' ? value === 'true' : undefined;
    this.changeCardBundleFormProps('enabled', valueAsBoolean);
  }

  changeCardQueryProps(name: string, value: number): void {
    //
    const { cardService } = this.injected;
    if ((name === 'count' || name === 'lastN') && isNaN(value)) {
      return;
    }

    cardService.changeCardQueryProps(name, value);
  }

  changeTargetCardProp(index: number, name: string, value: any): void {
    //
    const { cardService } = this.injected;
    cardService.changeTargetCardProp(index, name, value);
  }

  removeCardInCardBundle(): void {
    //
    const { cardService } = this.injected;
    cardService.removeTargetCard();
  }

  async saveCardBundle() {
    //
    const { cardBundleId } = this.props.match.params;
    const { cardBundleService, accessRuleService, cardService } = this.injected;
    const { cardBundleForm } = cardBundleService;

    cardBundleService.changeCardBundleFormProps(
      'groupBasedAccessRule',
      GroupBasedAccessRuleModel.asGroupBasedAccessRule(accessRuleService.groupBasedAccessRule)
    );

    cardBundleService.changeCardBundleFormProps(
      'cardIds',
      cardService.cards.map((cardWithContents) => cardWithContents.card.id)
    );

    cardBundleService.changeCardBundleFormProps(
      'learningTime',
      cardService.cards.reduce((acc, cur) => acc + cur.card.learningTime, 0)
    );

    if (this.cardBundleValidationCheck()) {
      if (cardBundleId) {
        await cardBundleService.modifyCardBundle(cardBundleForm.id, getCardBundleNameValueList(cardBundleForm));
      } else {
        await cardBundleService.registerCardBundle(getCardBundleCdo(cardBundleForm));
      }
      alert(AlertModel.getSaveSuccessAlert());
      this.routeToCardBundleList();
    }
  }

  cardBundleValidationCheck(): boolean {
    //
    const { cardBundleForm } = this.injected.cardBundleService;
    const { groupBasedAccessRule } = this.injected.accessRuleService;
    const { cards } = this.injected.cardService;

    let validation: boolean;

    if (cardBundleForm.name != null && !isDefaultPolyglotBlank(cardBundleForm.langSupports, cardBundleForm.name)) {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredInputAlert('카드 묶음 명'));
      return validation;
    }

    if (cardBundleForm.type === CardBundleType.HotTopic) {
      if (!isDefaultPolyglotBlank(cardBundleForm.langSupports, cardBundleForm.description)) {
        validation = true;
      } else {
        validation = false;
        alert(AlertModel.getRequiredInputAlert('Hot Topic 카드 묶음 설명'));
        return validation;
      }

      if (!isDefaultPolyglotBlank(cardBundleForm.langSupports, cardBundleForm.imageUrl)) {
        validation = true;
      } else {
        validation = false;
        alert(AlertModel.getRequiredInputAlert('썸네일'));
        return validation;
      }
    }

    if (
      cardBundleForm.description.ko?.split('\n')?.length > 5 ||
      cardBundleForm.description.en?.split('\n')?.length > 5 ||
      cardBundleForm.description.zh?.split('\n')?.length > 5
    ) {
      alert(
        AlertModel.getCustomAlert(true, '카드 묶음 설명', 'Hot Topic 카드 묶음 설명은 5줄까지만 입력해주세요', '확인')
      );
      return false;
    }

    if (cardBundleForm.groupBasedAccessRule.accessRules.length > 0) {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredChoiceAlert('접근제어 정보 규칙'));
      return validation;
    }

    if (cardBundleForm.cardIds.length > 0) {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredChoiceAlert('card'));
      return validation;
    }

    cards.forEach((cardWithContents) => {
      if (!groupBasedAccessRule.isAccessible(cardWithContents.card.groupBasedAccessRule)) {
        alert(AlertModel.getCustomAlert(true, '접근권한', '접근권한이 없는 카드가 존재합니다', '확인'));
        validation = false;
      }
    });

    return validation;
  }

  routeToCardBundleList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/cardBundle/cardBundle-list`
    );
  }

  async isUpdatableCheck(val: boolean): Promise<void> {
    //
    this.setState({ isUpdatable: val });
    if (!val) {
      await this.findCardBundleById(this.props.match.params.cardBundleId);
      await this.findGroupBasedAccessRules();
      await this.findCardByIds();
      this.injected.cardService.clearCardQuery();
    }
  }

  onChangeNumber(name: string, value: string) {
    //
    const { changeCardQueryProps } = this.injected.cardService;

    let val = value;
    if (val === '') {
      val = '0';
    } else if (value.startsWith('0') && value !== '0') {
      val = value.substr(1);
    }

    changeCardQueryProps(name, val);
  }

  optionsButtonRenderer(): React.ReactNode {
    //
    const { cardBundleService, cardService } = this.injected;

    const { type } = cardBundleService.cardBundleForm;
    const { cardQuery } = cardService;
    const isUpdatable = this.state.isUpdatable;

    if (type === CardBundleType.New) {
      return (
        <>
          <Form.Field
            // onChange={(e: any) => changeCardQueryProps('count', e.target.value)}
            onChange={(e: any) => this.onChangeNumber('count', e.target.value)}
            control={Input}
            value={(cardQuery && cardQuery.count) || 0}
            disabled={!isUpdatable}
          />
          <Form.Field> 개 </Form.Field>
          <Button primary disabled={!isUpdatable} onClick={this.findLastNApproved}>
            최근 승인 카드 불러오기
          </Button>
        </>
      );
    } else if (type === CardBundleType.Popular) {
      return (
        <>
          <Form.Field
            // onChange={(e: any) => changeCardQueryProps('lastN', e.target.value)}
            onChange={(e: any) => this.onChangeNumber('lastN', e.target.value)}
            control={Input}
            value={(cardQuery && cardQuery.lastN) || 0}
            disabled={!isUpdatable}
          />
          <Form.Field> 일 기준 최다이수자 </Form.Field>
          <Form.Button primary disabled={!isUpdatable} onClick={this.findTopNStudentPassedCardsByLastDay}>
            카드 불러오기
          </Form.Button>
        </>
      );
    } else {
      return null;
    }
  }

  async uploadFile(file: File, lang: Language) {
    if (!file || (file instanceof File && !this.validatedAll(file))) {
      return;
    }

    const { cardBundleService, sharedService } = this.injected;
    const { cardBundleForm } = cardBundleService;
    const fileName = new PolyglotModel(cardBundleService.fileName);
    const imageUrl = new PolyglotModel(cardBundleForm.imageUrl);

    if (cardBundleService) {
      fileName.setValue(lang, file.name);
      cardBundleService.changeFileName(fileName);
      const filePath = sharedService.uploadFile(file, FileUploadType.Banner);

      filePath.then((value) => {
        imageUrl.setValue(lang, value);
        cardBundleService.changeCardBundleFormProps('imageUrl', imageUrl);
      });
    }
  }

  validatedAll(file: File) {
    const validations = [{ type: 'Extension', validValue: EXTENSION.IMAGE }] as any[];

    const hasNonPass = validations.some((validation) => {
      if (validation.validator && typeof validation.validator === 'function') {
        return !validation.validator(file);
      } else {
        if (!validation.type || !validation.validValue) {
          return false;
        }
        return !fileUtil.validate(file, [], validation.type, validation.validValue);
      }
    });

    return !hasNonPass;
  }

  readFile(file: File): Promise<string> {
    //
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        resolve(e.target.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsDataURL(file);
    });
  }

  readImage(filePath: string, fitWidth: number): Promise<boolean> {
    //
    return new Promise((resolve) => {
      const image = new Image();
      image.src = filePath;

      image.onload = () => {
        resolve(image.naturalWidth === fitWidth);
      };
    });
  }

  render() {
    //
    const { cardBundleService } = this.injected;
    const { cardBundleForm } = cardBundleService;
    const { cardBundleId } = this.props.match.params;
    const { isUpdatable } = this.state;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.cardBundleSections}>CardBundle Management</PageTitle>
        <Polyglot languages={cardBundleForm.langSupports}>
          <div className="content">
            <SubActions form>
              <Form>
                <CardBundleBasicInfoView
                  onChangeCardBundleFormProps={this.changeCardBundleFormProps}
                  onChangeCardBundleFormRadio={this.changeCardBundleRadioProps}
                  cardBundleForm={cardBundleForm}
                  isUpdatable={isUpdatable}
                  uploadFile={this.uploadFile}
                  fileName={cardBundleService.fileName}
                />
              </Form>
              <AccessRuleSettings readOnly={!isUpdatable} multiple={false} />
              <Form>
                <CardSelectInfoListContainer
                  isUpdatable={isUpdatable}
                  callType="CardBundle"
                  optionsButtons={this.optionsButtonRenderer}
                  onClickResetCardSelected={this.findCardByIds}
                />
              </Form>
              <SubActions.Left>
                {(cardBundleId &&
                  ((!isUpdatable && <Button onClick={() => this.isUpdatableCheck(true)}>수정</Button>) || (
                    <Button onClick={() => this.isUpdatableCheck(false)}>취소</Button>
                  ))) ||
                  null}
              </SubActions.Left>

              <SubActions.Right>
                <Button basic onClick={this.routeToCardBundleList}>
                  목록
                </Button>
                <Button disabled={!isUpdatable} primary onClick={this.saveCardBundle}>
                  저장
                </Button>
              </SubActions.Right>
            </SubActions>
          </div>
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(CreateCardBundleContainer);
