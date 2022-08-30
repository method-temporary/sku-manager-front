import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { fileUtil } from '@nara.drama/depot';
import { Button, Form, Image, Radio, Segment, Select } from 'semantic-ui-react';

import { PermittedCineroom, SelectTypeModel, IconType } from 'shared/model';
import { IconBox, RadioGroup } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { getImagePath } from 'shared/helper';
import { SharedService } from 'shared/present';

import { CardService } from '../../index';
import CardExposureInfoView from '../view/CardExposureInfoView';
import UserWorkspaceModel from '../../../../userworkspace/model/UserWorkspaceModel';

interface Props {
  cardId?: string;
  isUpdatable: boolean;
  cineroomId: string;
  cardService: CardService;
  sharedService: SharedService;
  userWorkspaces: UserWorkspaceModel[];
  iconGroups?: SelectTypeModel[];
  userWorkspaceMap: Map<string, string>;
  setFile?: (file: File) => void;
}

const ICON_EXTENSION = {
  IMAGE: 'jpg|png|jpeg|svg|JPG|PNG|JPEG|SVG',
};

@observer
@reactAutobind
class CardExposureInfoContainer extends React.Component<Props> {
  //
  private fileInputRef = React.createRef<HTMLInputElement>();
  imagePath = getImagePath();

  componentDidMount() {
    //
    const { cardService, userWorkspaces, cineroomId } = this.props;
    const { changeCardQueryProps, cardQuery } = cardService;

    if (cardQuery.permittedCinerooms) {
      const isAll = cardQuery.permittedCinerooms.find((cineroom) => cineroom.cineroomId === cineroomId);

      if (isAll) {
        changeCardQueryProps('isAll', true);
        if (isAll.required) {
          changeCardQueryProps('isRequiredAll', true);
        }
      }
    }

    if (userWorkspaces.length === 1) {
      const cineroom = userWorkspaces[0];
      const cineroomId = cineroom.id;
      const permittedRequireCineroomsIds = [cineroomId];
      const permittedCinerooms = [
        new PermittedCineroom({
          cineroomId,
          required: false,
        } as PermittedCineroom),
      ];

      changeCardQueryProps('isAll', true);
      changeCardQueryProps('permittedRequireCineroomsIds', permittedRequireCineroomsIds);
      changeCardQueryProps('permittedCinerooms', permittedCinerooms);
    }
  }

  public uploadFile(file: File) {
    //
    if (!file || (file instanceof File && !this.validatedAll(file))) {
      return;
    }
    const { changeCardQueryProps } = this.props.cardService;

    if (file.size >= 1024 * 1024 * 0.3) {
      alert('300KB 이하만 업로드 가능합니다.');
      return;
    }

    this.props.setFile && this.props.setFile(file);

    changeCardQueryProps('fileName', file.name);
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      //event = on_file_select
      const data = e.target.result;
      changeCardQueryProps('fileIconPath', data);
    };
    fileReader.readAsDataURL(file);
  }

  validatedAll(file: File) {
    const validations = [
      { type: 'Extension', validValue: ICON_EXTENSION.IMAGE },
      //{ type: ValidationType.MaxSize, validValue: 30 * 1024 }, // 30k
    ] as any[];
    const hasNonPass = validations.some((validation) => {
      if (validation.validator && typeof validation.validator === 'function') {
        return !validation.validator(file);
      } else {
        if (!validation.type || !validation.validValue) {
          // console.warn('validations의 type과 validValue값을 넣어주시거나 validator를 사용해주세요.');
          return false;
        }

        return !fileUtil.validate(file, [], validation.type, validation.validValue);
      }
    });

    return !hasNonPass;
  }

  onClickCheckAll(checked: boolean, required: boolean = false) {
    //
    const { cardService, cineroomId } = this.props;
    const { cardQuery, changeCardQueryProps } = cardService;
    const { isAll } = cardQuery;

    const tempModels = [...cardQuery.permittedCinerooms];

    const allList: PermittedCineroom[] = [];
    const allIdList: string[] = [];

    // 체크
    if (checked) {
      if (required) {
        // 모든 관계사에서 핵인싸를 적용하려면 mySUNI 의 핵인싸만 적용시켜주면 됨으로,
        // mySUNI Requried를 true한 Cineroom만 보냄
        allList.push(
          new PermittedCineroom({
            cineroomId,
            required: true,
          } as PermittedCineroom)
        );

        allIdList.push(cineroomId);
        changeCardQueryProps('isRequiredAll', true);
      } else {
        // userWorkspaces &&
        //   userWorkspaces.forEach((userWorkspace) => {
        //     const userWorkspaceId = userWorkspace.id;
        //
        //     const index = tempIds.indexOf(userWorkspaceId);
        //
        //     // require 가 있었으면 해당 require 유지
        //     if (index > -1) {
        //       const permittedModel = tempModels[index];
        //       allList.push(
        //         new PermittedCineroom({
        //           cineroomId: userWorkspaceId,
        //           required: permittedModel.required,
        //         } as PermittedCineroom)
        //       );
        //     } else {
        //       allList.push(
        //         new PermittedCineroom({
        //           cineroomId: userWorkspaceId,
        //           required: false,
        //         } as PermittedCineroom)
        //       );
        //     }
        //     allIdList.push(userWorkspaceId);
        //   });
        changeCardQueryProps('isAll', true);

        allList.push(
          new PermittedCineroom({
            cineroomId,
            required,
          } as PermittedCineroom)
        );
        allIdList.push(cineroomId);

        if (tempModels.length > 1) {
          tempModels.forEach((permittedCineroom) => {
            if (permittedCineroom.required) {
              allList.push(
                new PermittedCineroom({
                  cineroomId: permittedCineroom.cineroomId,
                  required: permittedCineroom.required,
                } as PermittedCineroom)
              );
              allIdList.push(permittedCineroom.cineroomId);
            }
          });
        }
      }
      // 체크 해제
    } else {
      if (required) {
        if (isAll) {
          allList.push(
            new PermittedCineroom({
              cineroomId,
              required: false,
            } as PermittedCineroom)
          );
          allIdList.push(cineroomId);
        }
      } else {
        changeCardQueryProps('isAll', false);
      }
      changeCardQueryProps('isRequiredAll', false);
    }
    changeCardQueryProps('permittedRequireCineroomsIds', allIdList);
    changeCardQueryProps('permittedCinerooms', allList);
  }

  onClickCheckOne(value: UserWorkspaceModel, checked: boolean, required: boolean = false) {
    //
    const { cardService, userWorkspaces } = this.props;
    const { cardQuery, changeCardQueryProps } = cardService;
    const valueCineroomId = value.id;
    const { isAll } = cardQuery;

    let tempIds: string[] = [...cardQuery.permittedRequireCineroomsIds];
    let tempModels: PermittedCineroom[] = [...cardQuery.permittedCinerooms];

    const index = tempIds.indexOf(valueCineroomId);
    // 단일 체크
    if (checked) {
      // -2를 한 이유는 mySUNI의 갯수 제외와, 이번에 찍은 핵인싸가 마지막인 핵인싸 경우( mySUNI를 제외한 모든 핵인싸를 체크 했을 경우) 의 조건으로 넣기 위해서
      const permittedAll =
        (cardQuery &&
          cardQuery.permittedCinerooms &&
          cardQuery.permittedCinerooms.length &&
          userWorkspaces &&
          userWorkspaces.length > 0 &&
          userWorkspaces.length - 2 === cardQuery.permittedCinerooms.length) ||
        false;

      // -2를 한 이유는 mySUNI의 갯수 제외와, 이번에 찍은 관계사가 마지막인 관계사 경우( mySUNI를 제외한 모든 핵인싸를 체크 했을 경우) 의 조건으로 넣기 위해서
      const requiredAll =
        (cardQuery &&
          cardQuery.permittedCinerooms &&
          cardQuery.permittedCinerooms.length &&
          userWorkspaces &&
          userWorkspaces.length > 0 &&
          userWorkspaces.length - 2 ===
            cardQuery.permittedCinerooms.filter((permitted) => permitted.required).length) ||
        false;

      // 단일 체크 했을 때, mySUNI를 제외한 모든 핵인싸 체크가 되엇을 경우,
      // nySUNI 를 누른 것과 같은 로직을 타기 위한 if 문
      if (permittedAll || requiredAll) {
        this.onClickCheckAll(checked, required);
      }

      // 핵인싸
      if (required) {
        // 전체 관계사 중에서 일부 핵인싸
        if (isAll) {
          tempIds.push(valueCineroomId);
          tempModels.push(
            new PermittedCineroom({
              cineroomId: valueCineroomId,
              required,
            } as PermittedCineroom)
          );
        } else {
          // 일부 관계사 중에서 일부 핵인싸
          // 일부 관계사인 경우는 cardQuery.permittedCinerooms에 push가 되어 있기 때문에
          // 해당 Model을 찾아서 Required만 바꿔주면 됨.
          const index = tempIds.indexOf(valueCineroomId);
          tempModels = this.changeRequireInList(index, tempModels, checked);
        }
      } else {
        // 관계사
        tempIds.push(valueCineroomId);
        tempModels.push(
          new PermittedCineroom({
            cineroomId: valueCineroomId,
            required,
          } as PermittedCineroom)
        );
      }
      // 단일 체크 해제
    } else {
      // 핵인싸
      if (required) {
        // 핵인싸 mySUNI를 체크 했을 경우는 Disabled 이기 때문에 체크 해제 불가.
        if (isAll) {
          // 모든 관계사일 때, 핵인싸를 단일 체크 해제 하면 목록에서 제외 시켜도 관계사는
          // 핵인싸가 아닌 목록으로 볼 수 있음.
          // 따라서 목록을 제거
          tempIds = this.removeSomethingInList(index, tempIds);
          tempModels = this.removeSomethingInList(index, tempModels);
        } else {
          // 일부 관계사일 때, 핵인싸를 단일 체그 해제 하면 해당 관계사의 핵인싸만 취소 해야 하므로,
          // 해당 관계사의 Required만 수정
          tempModels = this.changeRequireInList(index, tempModels, checked);
        }
      } else {
        // 관계사
        // 관계사 mySUNI를 체크 했을 경우는 Disabled 이기 때문에 체크 해제 불가.
        // 일부 관계사 선택에서 해제 했을 경우에는 cardQuery.permittedCineroom 목록에서 제거 하면 됨.
        tempIds = this.removeSomethingInList(index, tempIds);
        tempModels = this.removeSomethingInList(index, tempModels);
      }
    }

    changeCardQueryProps('permittedRequireCineroomsIds', tempIds);
    changeCardQueryProps('permittedCinerooms', tempModels);

    // // MySuni 관리자가 아닌 경우
    // if (cineroomId !== 'ne1-m2-c2') {
    //   tempIds = [...cardQuery.permittedRequireCineroomsIds];
    //   tempModels = [...cardQuery.permittedCinerooms];
    //
    //   if (tempIds.length === 0 && tempModels.length > 0) {
    //     tempIds.push(valueCineroomId);
    //     newTempModels = this.changeRequireInList(1, tempModels, checked);
    //   } else {
    //     const index = tempIds.indexOf(valueCineroomId);
    //
    //     if (index === -1) {
    //       tempIds.push(valueCineroomId);
    //       tempModels.push(
    //         new PermittedCineroom({
    //           cineroomId: valueCineroomId,
    //           required: required || false,
    //         } as PermittedCineroom)
    //       );
    //
    //       newTempModels = tempModels;
    //     } else {
    //       newTempModels = this.changeRequireInList(index, tempModels, checked);
    //     }
    //   }
    //
    //   changeCardQueryProps('permittedCinerooms', newTempModels);
    //
    //   return;
    // }

    // // 2021. 05. 04 박종유 Required와 관계사 분리로 인한 주석
    // // MySuni 관리자 Required 선택시 기존 관계사 적용 삭제
    // // if (required && cardQuery.permittedCinerooms.filter((model) => model.required).length === 0) {
    // //   tempIds = [];
    // //   tempModels = [];
    // // } else {
    // // required가 1개라도 있으면 그 다음에 선택하는 것들은 무조건 Required 이기 때문에 목록을 다 넣어줌
    // tempIds = [...cardQuery.permittedRequireCineroomsIds];
    // tempModels = [...cardQuery.permittedCinerooms];
    // // }
    //
    // const index = tempIds.indexOf(valueCineroomId);
    //
    // if (index > -1) {
    //   const cineroomModel: PermittedCineroom = tempModels[index];
    //   // require 선택 헀을 시에
    //   if (required && !cineroomModel.required) {
    //     const newPermittedCineroom = new PermittedCineroom({ ...cineroomModel, required: true });
    //
    //     tempModels.splice(index, 1, newPermittedCineroom);
    //
    //     changeCardQueryProps('permittedCinerooms', tempModels);
    //   } else {
    //     const newTempIds: string[] = this.removeSomethingInList(index, tempIds);
    //     const newTempModels: PermittedCineroom[] = this.removeSomethingInList(index, tempModels);
    //
    //     changeCardQueryProps('permittedRequireCineroomsIds', newTempIds);
    //     changeCardQueryProps('permittedCinerooms', newTempModels);
    //   }
    // } else {
    //   tempIds.push(valueCineroomId);
    //   tempModels.push(
    //     new PermittedCineroom({
    //       cineroomId: valueCineroomId,
    //       required: required || false,
    //     } as PermittedCineroom)
    //   );
    //
    // changeCardQueryProps('permittedRequireCineroomsIds', tempIds);
    // changeCardQueryProps('permittedCinerooms', tempModels);
    // }
  }

  removeSomethingInList(index: number, oldList: any[]) {
    //
    if (oldList.length === 1) {
      return [];
    }

    return oldList.slice(0, index).concat(oldList.slice(index + 1));
  }

  changeRequireInList(index: number, oldList: any[], required: boolean) {
    //
    if (index > oldList.length) {
      return oldList;
    }

    const model = oldList[index];
    oldList[index] = { ...model, required };

    return oldList;
  }

  isRequiredCheck(id: string) {
    //
    const { permittedCinerooms, permittedRequireCineroomsIds } = this.props.cardService.cardQuery;

    const index = permittedRequireCineroomsIds.indexOf(id);

    if (index === -1) {
      return false;
    }

    const permittedCineroom: PermittedCineroom = permittedCinerooms[index];

    return permittedCineroom.required;
  }

  onClickThumbImageChange() {
    //
    const { changeCardQueryProps } = this.props.cardService;
    changeCardQueryProps('thumbImagePath', '');
  }

  async onChangeIconGroup(value: string) {
    //
    const { sharedService, cardService } = this.props;

    cardService.changeCardQueryProps('iconGroupId', value);

    // await sharedService.findIcons(value);
  }

  renderCardIcon() {
    //
    const { cardId, isUpdatable, cardService, iconGroups, sharedService } = this.props;
    const { cardQuery, changeCardQueryProps } = cardService;
    // const icons = sharedService ? sharedService.icons : [];

    if (isUpdatable) {
      if (cardId && cardQuery.thumbImagePath) {
        return (
          <>
            <Button onClick={this.onClickThumbImageChange}>아이콘 수정</Button>
            <p />
            <Segment.Inline>
              <Image src={this.imagePath + cardQuery.thumbImagePath} size="small" verticalAlign="bottom" />
            </Segment.Inline>
          </>
        );
      } else {
        return (
          <>
            <Form.Group>
              <RadioGroup
                value={cardQuery.iconType}
                values={[IconType.SKUniversity, IconType.Personal]}
                labels={['mySUNI Icon Set', '직접 등록']}
                onChange={(e: any, data: any) => changeCardQueryProps('iconType', data.value)}
              />
            </Form.Group>
            {cardQuery && cardQuery.iconType === IconType.SKUniversity ? (
              <>
                <Form.Field
                  width={4}
                  control={Select}
                  placeholder="Select"
                  options={iconGroups || []}
                  value={cardQuery.iconGroupId || ''}
                  onChange={(e: any, data: any) => {
                    this.onChangeIconGroup(data.value);
                  }}
                />
                {/*<div className="filebox-icon">*/}
                {/*  {cardQuery.iconGroupId ? (*/}
                {/*    <IconBox*/}
                {/*      value={cardQuery.thumbImagePath || cardQuery.iconPath}*/}
                {/*      icons={icons}*/}
                {/*      onSelectIcon={(icon) => changeCardQueryProps('iconPath', icon.fileUri)}*/}
                {/*      options={{*/}
                {/*        title: 'sk Icon',*/}
                {/*        needTinyImage: true,*/}
                {/*        width: '60px',*/}
                {/*        height: '60px',*/}
                {/*        selectable: true,*/}
                {/*        baseUrl: this.imagePath,*/}
                {/*      }}*/}
                {/*      customSelector={(selectedId: string, imageId: string) => (*/}
                {/*        <Radio checked={selectedId === imageId} />*/}
                {/*      )}*/}
                {/*    />*/}
                {/*  ) : null}*/}
                {/*</div>*/}
              </>
            ) : (
              <>
                <Button
                  className="file-select-btn"
                  content={cardQuery.fileName || '파일 선택'}
                  labelPosition="left"
                  icon="file"
                  onClick={() => {
                    if (this.fileInputRef && this.fileInputRef.current) {
                      this.fileInputRef.current.click();
                    }
                  }}
                />
                <input
                  id="file"
                  type="file"
                  ref={this.fileInputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    e.target.files && this.uploadFile(e.target.files[0])
                  }
                  hidden
                />

                {cardQuery && cardQuery.iconType === IconType.Personal && (
                  <Segment.Inline>
                    <Image src={`${cardQuery.fileIconPath}`} size="small" verticalAlign="bottom" />
                  </Segment.Inline>
                )}

                <p className="info-text-gray">- JPG, PNG 파일을 등록하실 수 있습니다.</p>
                <p className="info-text-gray">- 최대 300KB 용량의 파일을 등록하실 수 있습니다.</p>
                <p className="info-text-gray">- Icon의 경우 100x100의 사이즈를 추천합니다.</p>
              </>
            )}
          </>
        );
      }
    } else {
      return (
        <Segment.Inline>
          <Image src={this.imagePath + cardQuery.thumbImagePath} size="small" verticalAlign="bottom" />
        </Segment.Inline>
      );
    }
  }

  setCommunity(id: string, name: string) {
    //
    const { changeCardContentsQueryProps } = this.props.cardService;

    changeCardContentsQueryProps('communityId', id);
    changeCardContentsQueryProps('communityName', name);
  }

  clearCommunity() {
    //
    const { changeCardContentsQueryProps } = this.props.cardService;

    changeCardContentsQueryProps('communityId', '');
    changeCardContentsQueryProps('communityName', '');
  }

  getCineroomsText(required: boolean): string {
    //
    const { userWorkspaces, userWorkspaceMap, cardService, cineroomId } = this.props;
    const { cardQuery } = cardService;

    const cinerooms = cardQuery.permittedCinerooms;
    const mySUNI = cinerooms.find((cineroom) => cineroom.cineroomId === cineroomId);

    // 핵인싸 Text
    if (required) {
      // 모든 관계사
      if (mySUNI) {
        // 모든 관계사가 핵인싸
        if (mySUNI.required) {
          return userWorkspaces.map((cineroom) => getPolyglotToAnyString(cineroom.name)).join(', ');
        } else {
          // 일부 관계사 핵인싸
          return cardQuery.permittedCinerooms
            .filter((cineroom) => cineroom.required)
            .map((cineroom, index) => userWorkspaceMap.get(cineroom.cineroomId))
            .join(', ');
        }
      } else {
        // 일부 관계사
        return cardQuery.permittedCinerooms
          .map((cineroom, index) => userWorkspaceMap.get(cineroom.cineroomId))
          .join(', ');
      }
    } else {
      // 관계사 Text
      // 모든 관계사
      if (mySUNI) {
        return userWorkspaces.map((cineroom) => getPolyglotToAnyString(cineroom.name)).join(', ');
      } else {
        // 일부 관계사
        return cardQuery.permittedCinerooms
          .map((cineroom, index) => userWorkspaceMap.get(cineroom.cineroomId))
          .join(', ');
      }
    }
  }

  render() {
    //
    const { isUpdatable, cardService, userWorkspaces, userWorkspaceMap, cineroomId } = this.props;
    const { cardQuery, cardContentsQuery, changeCardQueryProps } = cardService;
    const { isAll, isRequiredAll } = cardQuery;

    return (
      <CardExposureInfoView
        cineroomId={cineroomId}
        isUpdatable={isUpdatable}
        cardQuery={cardQuery}
        cardContentsQuery={cardContentsQuery}
        changeCardQueryProps={changeCardQueryProps}
        userWorkspaces={userWorkspaces}
        userWorkspaceMap={userWorkspaceMap}
        onClickCheckAll={this.onClickCheckAll}
        onClickCheckOne={this.onClickCheckOne}
        isRequiredCheck={this.isRequiredCheck}
        renderCardIcon={this.renderCardIcon}
        communityName={cardContentsQuery.communityName}
        setCommunity={this.setCommunity}
        clearCommunity={this.clearCommunity}
        isAll={isAll}
        isRequiredAll={isRequiredAll}
        getCineroomsText={this.getCineroomsText}
      />
    );
  }
}

export default CardExposureInfoContainer;
