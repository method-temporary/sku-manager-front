import moment from 'moment';
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Icon,
  Pagination,
  Table,
  Select,
  Modal,
  Input,
  Search,
  List,
  Segment,
} from 'semantic-ui-react';
import { NaOffsetElementList } from 'shared/model';
import Capability from 'board/capability/model/Capability';
import { getEmptySearchBox } from 'board/capability/model/SearchBox';
import {
  requestFindAllCapabilityModal,
  requestFindCapability,
  requestFindAllCapability,
  requestFindSkills,
  requestfindCapabilityGroups,
  requestFindCapabilityNames,
} from 'board/capability/service/requestCapability';
import Skill from 'board/capability/model/Skill';
import CapabilityCdo, { getEmptyCapabilityCdo } from 'board/capability/model/CapabilityCdo';
import SearchBoxContainer from '../logic/SearchBoxContainer';
import { useSearchBox, setSearchBox } from 'board/capability/store/SearchBoxStore';
import ModalSearchBoxContainer from '../logic/ModalSearchBoxContainer';
import { useList } from 'board/capability/store/CapabilityListStore';
import { useCapability } from 'board/capability/store/CapabilityStore';
import CapabilityGroup from 'board/capability/model/CapabilityGroup';
import { deepDecorator } from 'mobx/lib/internal';
import ListModalSearchBoxContainer from '../logic/ListModalSearchBoxContainer';
import { useCapabilityGroup } from 'board/capability/store/CapabilityGroupStore';

interface CapabilityListModalProps {
  capabilityModalOpen: boolean;
  setCapabilityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // CapabilityList: NaOffsetElementList<CapabilityViewModel>;
  // searchBox: SearchBox;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

const CapabilityListModal: React.FC<CapabilityListModalProps> = function CapabilityListModal({
  capabilityModalOpen,
  setCapabilityModalOpen,
  // CapabilityList,
  // searchBox,
}) {
  // const [filterLimit] = useCapabilityRdoLimit();
  const location = useLocation();
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState<boolean>(capabilityModalOpen);

  const [capabilityList, setCapabilityList] = useState<Capability[] | undefined>([]);
  const [capabilitySkillList, setCapabilitySkillList] = useState<Skill[] | undefined>();

  const [selectedSkill, setSelectedSkill] = useState<Skill[]>([]);

  const [selectedCapabilityGroup, setSelectedCapabilityGroup] = useState<CapabilityGroup[]>([]);

  const [CapabilityGroup, setCapabilityGroup] = useState<string | undefined>();

  const [selectedCapabilityName, setSelectedCapabilityName] = useState<string>();

  const [selectedCapabilityGroupId, setSelectedCapabilityGroupId] = useState<string>();

  const [selectedCapabilitySkillList, setSelectedCapabilitySkillList] = useState<(string | undefined)[]>([]);

  const searchBox = useSearchBox();
  const capability = useCapability();
  const capabilityGroup = useCapabilityGroup();
  // const capabilityGroup = useCapabilityGroup();
  // searchCapabilityGroup

  useEffect(() => {
    capability && setCapabilityList(capability);
  }, [capability]);

  useEffect(() => {
    setSearchBox({
      ...getEmptySearchBox(),
      limit: 1000,
      startDate: moment().startOf('day').subtract(5, 'y').toDate().getTime(),
      endDate: moment().endOf('day').toDate().getTime(),
    });
    searchCapabilityGroup();
  }, []);

  // useEffect(() => {
  //   searchBox &&
  //     requestFindAllCapabilityModal(searchBox).then((CapabilityList) => {
  //       setCapabilityNameList(CapabilityList);
  //     });
  // }, [CapabilityGroup]);

  useEffect(() => {
    setSearchBox({
      ...getEmptySearchBox(),
      limit: 1000,
      startDate: moment().startOf('day').subtract(5, 'y').toDate().getTime(),
      endDate: moment().endOf('day').toDate().getTime(),
      capabilityName: selectedCapabilityName,
    });
  }, [selectedCapabilityName]);

  const searchCapabilityGroup = useCallback(() => {
    // setSelectedCapabilityGroupId(searchBox?.capabilityGroupId);
    // searchBox &&
    //   requestfindCapabilityGroups(searchBox?.capabilityGroupId).then(
    //     (CapabilityList) => {
    //       setSelectedCapabilityGroup(CapabilityList);
    //     }
    //   );
  }, [searchBox]);

  const searchCapability = useCallback(
    (capabilityGroupId) => {
      setSelectedCapabilityGroupId(capabilityGroupId);

      setSearchBox({
        ...searchBox,
        capabilityGroupId,
      });
      // searchBox &&
      // requestFindCapabilityNames().then((CapabilityList) => {
      //   setCapabilitySkillList(CapabilityList);
      // });
      requestFindAllCapabilityModal();
    },
    [searchBox]
  );

  const searchCapabilitySkill = useCallback(
    (capabilityName) => {
      // console.log('capabilityName', capabilityName);
      setSelectedCapabilityName(capabilityName);
      setSearchBox({
        ...searchBox,
        capabilityName,
      });
      searchBox &&
        requestFindSkills().then((CapabilityList) => {
          setCapabilitySkillList(CapabilityList);
        });
    },
    [searchBox]
  );

  return (
    <>
      <Modal size="large" open={capabilityModalOpen}>
        <Modal.Header className="res">
          전체 역량 보기
          {/* <span className="sub f12">역량을 선택해주세요.</span> */}
        </Modal.Header>

        <Modal.Content className="fit-layout">
          {searchBox && <ListModalSearchBoxContainer searchBox={searchBox} searchCapability={searchCapability} />}
          <div className="channel-change">
            <div className="table-css">
              <div className="row head">
                <div className="cell v-middle">
                  <span className="text01">역량군</span>
                </div>
                <div className="cell v-middle">
                  <span className="text01">역량</span>
                </div>
              </div>
              <div className="row">
                <div className="cell vtop">
                  <div className="select-area">
                    <div className="scrolling-60vh">
                      <List className="toggle-check">
                        {(capabilityGroup &&
                          capabilityGroup.map((capabilityGroup, index) => (
                            <List.Item
                              key={index}
                              className={capabilityGroup.id === selectedCapabilityGroupId ? 'active' : ''}
                            >
                              <Segment onClick={() => searchCapability(capabilityGroup.id)}>
                                {capabilityGroup.name}
                                <div className="fl-right">
                                  <Icon name="check" />
                                </div>
                              </Segment>
                            </List.Item>
                          ))) ||
                          ''}
                        {/* {(capability &&
                          capability.map((capability, index) => (
                            <List.Item
                              key={index}
                              className={
                                capability.name === selectedCapabilityName
                                  ? 'active'
                                  : ''
                              }
                            >
                              <Segment
                                onClick={() =>
                                  searchCapabilitySkill(capability.name)
                                }
                              >
                                {capability.name}
                                <div className="fl-right">
                                  <Icon name="check" />
                                </div>
                              </Segment>
                            </List.Item>
                          ))) ||
                          ''} */}
                      </List>
                    </div>
                  </div>
                </div>
                <div className="cell vtop">
                  <div className="select-area">
                    <div className="scrolling-60vh">
                      <span className="select-item">
                        {(capability &&
                          capability.length &&
                          capability.map((capability, index) => (
                            <Button key={index}>
                              {capability.capabilityGroup.name} &gt; {capability.name}
                            </Button>
                          ))) ||
                          '역량군을 선택해주세요.'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* <div className="cell vtop">
                  <div className="select-area">
                    <div className="scrolling-60vh">
                      <span className="select-item">
                        {selectedSkill.map((skill, index) => (
                          <Button className="del" key={index}>
                            {skill.capability.name} &gt; {skill.name}
                            <div className="fl-right">
                              <Icon name="times" />
                            </div>
                          </Button>
                        )) || ''}
                      </span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button className="w190 d" onClick={() => setCapabilityModalOpen(false)} type="button">
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default CapabilityListModal;
