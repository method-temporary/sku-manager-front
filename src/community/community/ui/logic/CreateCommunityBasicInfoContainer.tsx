import * as React from 'react';
import { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useCreateCommunityBasicInfo } from '../../service/useCreateCommunityBasicInfo';
import CreateCommunityBasicInfoView from '../view/CreateCommunityBasicInfoView';
import { useFieldList } from '../../../field/service/useFieldList';
import { useCommunityList } from '../../service/useCommunityList';
import { useMemberList } from 'community/member/service/useMemberList';
import { alert, AlertModel } from 'shared/components';

interface CreateCommunityBasicInfoContainerProps
  extends RouteComponentProps<{ cineroomId: string; communityId: string }> {}
const CreateCommunityBasicInfoContainer: React.FC<CreateCommunityBasicInfoContainerProps> =
  function CreateCommunityBasicInfoContainer(props) {
    useEffect(() => {
      changeMemberQueryProps('communityId', props.match.params.communityId);
      changeMemberQueryProps('approved', 'APPROVED');
      changeMemberQueryProps('limit', 10000);
    }, []);

    const history = useHistory();
    function routeToCommunityList() {
      history.push(`/cineroom/${props.match.params.cineroomId}/community-management/community/community-list`);
    }
    const [fieldList] = useFieldList();
    const [communityList, changeCommunityQueryProps, , communityQuery, clearCommunityQuery, selectField] =
      useCommunityList();
    const [
      community,
      uploadFile,
      saveCommunity,
      deleteCommunity,
      changeCommunityCdoProps,
      communityCdo,
      findCommunityById,
      checkName,
      checkGroupBasedAccessRules,
    ] = useCreateCommunityBasicInfo();

    const [memberList, changeMemberQueryProps, searchQuery, memberQuery, sharedService] = useMemberList();

    if (community === undefined || communityCdo === undefined) {
      return null;
    } else if (props.match.params.communityId && communityCdo.communityId === '') {
      findCommunityById(props.match.params.communityId);
      changeCommunityCdoProps('communityId', props.match.params.communityId);
    }

    return (
      <CreateCommunityBasicInfoView
        communityName={community.name || ''}
        communityDescription={community.description || ''}
        communityIsOpend={community.visible || ''}
        uploadFile={uploadFile}
        selectField={selectField(fieldList)}
        routeToCommunityList={routeToCommunityList}
        saveCommunity={saveCommunity}
        deleteCommunity={deleteCommunity}
        changeCommunityCdoProps={changeCommunityCdoProps}
        communityCdo={communityCdo}
        checkName={checkName}
        memberList={memberList}
        changeMemberQueryProps={changeMemberQueryProps}
        checkGroupBasedAccessRules={checkGroupBasedAccessRules}
      />
    );
  };

export default withRouter(CreateCommunityBasicInfoContainer);
