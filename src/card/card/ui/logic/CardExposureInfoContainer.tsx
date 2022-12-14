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
      alert('300KB ????????? ????????? ???????????????.');
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
          // console.warn('validations??? type??? validValue?????? ?????????????????? validator??? ??????????????????.');
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

    // ??????
    if (checked) {
      if (required) {
        // ?????? ??????????????? ???????????? ??????????????? mySUNI ??? ???????????? ?????????????????? ?????????,
        // mySUNI Requried??? true??? Cineroom??? ??????
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
        //     // require ??? ???????????? ?????? require ??????
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
      // ?????? ??????
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
    // ?????? ??????
    if (checked) {
      // -2??? ??? ????????? mySUNI??? ?????? ?????????, ????????? ?????? ???????????? ???????????? ????????? ??????( mySUNI??? ????????? ?????? ???????????? ?????? ?????? ??????) ??? ???????????? ?????? ?????????
      const permittedAll =
        (cardQuery &&
          cardQuery.permittedCinerooms &&
          cardQuery.permittedCinerooms.length &&
          userWorkspaces &&
          userWorkspaces.length > 0 &&
          userWorkspaces.length - 2 === cardQuery.permittedCinerooms.length) ||
        false;

      // -2??? ??? ????????? mySUNI??? ?????? ?????????, ????????? ?????? ???????????? ???????????? ????????? ??????( mySUNI??? ????????? ?????? ???????????? ?????? ?????? ??????) ??? ???????????? ?????? ?????????
      const requiredAll =
        (cardQuery &&
          cardQuery.permittedCinerooms &&
          cardQuery.permittedCinerooms.length &&
          userWorkspaces &&
          userWorkspaces.length > 0 &&
          userWorkspaces.length - 2 ===
            cardQuery.permittedCinerooms.filter((permitted) => permitted.required).length) ||
        false;

      // ?????? ?????? ?????? ???, mySUNI??? ????????? ?????? ????????? ????????? ????????? ??????,
      // nySUNI ??? ?????? ?????? ?????? ????????? ?????? ?????? if ???
      if (permittedAll || requiredAll) {
        this.onClickCheckAll(checked, required);
      }

      // ?????????
      if (required) {
        // ?????? ????????? ????????? ?????? ?????????
        if (isAll) {
          tempIds.push(valueCineroomId);
          tempModels.push(
            new PermittedCineroom({
              cineroomId: valueCineroomId,
              required,
            } as PermittedCineroom)
          );
        } else {
          // ?????? ????????? ????????? ?????? ?????????
          // ?????? ???????????? ????????? cardQuery.permittedCinerooms??? push??? ?????? ?????? ?????????
          // ?????? Model??? ????????? Required??? ???????????? ???.
          const index = tempIds.indexOf(valueCineroomId);
          tempModels = this.changeRequireInList(index, tempModels, checked);
        }
      } else {
        // ?????????
        tempIds.push(valueCineroomId);
        tempModels.push(
          new PermittedCineroom({
            cineroomId: valueCineroomId,
            required,
          } as PermittedCineroom)
        );
      }
      // ?????? ?????? ??????
    } else {
      // ?????????
      if (required) {
        // ????????? mySUNI??? ?????? ?????? ????????? Disabled ?????? ????????? ?????? ?????? ??????.
        if (isAll) {
          // ?????? ???????????? ???, ???????????? ?????? ?????? ?????? ?????? ???????????? ?????? ????????? ????????????
          // ???????????? ?????? ???????????? ??? ??? ??????.
          // ????????? ????????? ??????
          tempIds = this.removeSomethingInList(index, tempIds);
          tempModels = this.removeSomethingInList(index, tempModels);
        } else {
          // ?????? ???????????? ???, ???????????? ?????? ?????? ?????? ?????? ?????? ???????????? ???????????? ?????? ?????? ?????????,
          // ?????? ???????????? Required??? ??????
          tempModels = this.changeRequireInList(index, tempModels, checked);
        }
      } else {
        // ?????????
        // ????????? mySUNI??? ?????? ?????? ????????? Disabled ?????? ????????? ?????? ?????? ??????.
        // ?????? ????????? ???????????? ?????? ?????? ???????????? cardQuery.permittedCineroom ???????????? ?????? ?????? ???.
        tempIds = this.removeSomethingInList(index, tempIds);
        tempModels = this.removeSomethingInList(index, tempModels);
      }
    }

    changeCardQueryProps('permittedRequireCineroomsIds', tempIds);
    changeCardQueryProps('permittedCinerooms', tempModels);

    // // MySuni ???????????? ?????? ??????
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

    // // 2021. 05. 04 ????????? Required??? ????????? ????????? ?????? ??????
    // // MySuni ????????? Required ????????? ?????? ????????? ?????? ??????
    // // if (required && cardQuery.permittedCinerooms.filter((model) => model.required).length === 0) {
    // //   tempIds = [];
    // //   tempModels = [];
    // // } else {
    // // required??? 1????????? ????????? ??? ????????? ???????????? ????????? ????????? Required ?????? ????????? ????????? ??? ?????????
    // tempIds = [...cardQuery.permittedRequireCineroomsIds];
    // tempModels = [...cardQuery.permittedCinerooms];
    // // }
    //
    // const index = tempIds.indexOf(valueCineroomId);
    //
    // if (index > -1) {
    //   const cineroomModel: PermittedCineroom = tempModels[index];
    //   // require ?????? ?????? ??????
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
            <Button onClick={this.onClickThumbImageChange}>????????? ??????</Button>
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
                labels={['mySUNI Icon Set', '?????? ??????']}
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
                  content={cardQuery.fileName || '?????? ??????'}
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

                <p className="info-text-gray">- JPG, PNG ????????? ???????????? ??? ????????????.</p>
                <p className="info-text-gray">- ?????? 300KB ????????? ????????? ???????????? ??? ????????????.</p>
                <p className="info-text-gray">- Icon??? ?????? 100x100??? ???????????? ???????????????.</p>
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

    // ????????? Text
    if (required) {
      // ?????? ?????????
      if (mySUNI) {
        // ?????? ???????????? ?????????
        if (mySUNI.required) {
          return userWorkspaces.map((cineroom) => getPolyglotToAnyString(cineroom.name)).join(', ');
        } else {
          // ?????? ????????? ?????????
          return cardQuery.permittedCinerooms
            .filter((cineroom) => cineroom.required)
            .map((cineroom, index) => userWorkspaceMap.get(cineroom.cineroomId))
            .join(', ');
        }
      } else {
        // ?????? ?????????
        return cardQuery.permittedCinerooms
          .map((cineroom, index) => userWorkspaceMap.get(cineroom.cineroomId))
          .join(', ');
      }
    } else {
      // ????????? Text
      // ?????? ?????????
      if (mySUNI) {
        return userWorkspaces.map((cineroom) => getPolyglotToAnyString(cineroom.name)).join(', ');
      } else {
        // ?????? ?????????
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
