import moment from 'moment';
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Checkbox, Form, Icon, Table, Modal, List, Segment } from 'semantic-ui-react';
import Capability from 'board/capability/model/Capability';
import CapabilityJson from 'board/capability/model/json/Capabilities';
import SkillJson from 'board/capability/model/json/Skills';
import { getEmptySearchBox } from 'board/capability/model/SearchBox';
import { requestFindSkills } from 'board/capability/service/requestCapability';
import Skill, { convertToSkill } from 'board/capability/model/Skill';
import { useSearchBox, setSearchBox } from 'board/capability/store/SearchBoxStore';
import ModalSearchBoxContainer from '../logic/ModalSearchBoxContainer';
import { useCapability } from 'board/capability/store/CapabilityStore';
import CapabilityGroup from 'board/capability/model/json/CapabilityGroups';

interface CapabilityModalProps {
  onHandleSkillModalOk?: (selectedCapabilityGroup: CapabilityGroup[]) => void;
  capabilityGroups: CapabilityGroup[];
  button?: boolean;
}

const CapabilityModal: React.FC<CapabilityModalProps> = function CapabilityModal({
  onHandleSkillModalOk,
  capabilityGroups,
  button,
}) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [capabilitySkillList, setCapabilitySkillList] = useState<Skill[] | undefined>();

  const [selectedSkill, setSelectedSkill] = useState<Skill[]>([]);

  const [selectedCapabilityGroup, setSelectedCapabilityGroup] = useState<CapabilityGroup[]>([]);

  const [selectedCapabilityName, setSelectedCapabilityName] = useState<string>();
  const [selectedSkillCount, setSelectedSkillCount] = useState<number>(0);

  const searchBox = useSearchBox();
  const capability = useCapability();

  useEffect(() => {
    capabilityGroups && setSelectedCapabilityGroup(capabilityGroups);
  }, [capabilityGroups]);

  const selectedSkillCountUpdate = useCallback(() => {
    let count = 0;
    selectedCapabilityGroup.map((s) =>
      s.capabilities.map((c) => {
        count += c.skills.length;
      })
    );

    setSelectedSkillCount(count);
  }, [selectedCapabilityGroup]);

  useEffect(() => {
    setSearchBox({
      ...getEmptySearchBox(),
      limit: 1000,
      startDate: moment().startOf('day').subtract(5, 'y').toDate().getTime(),
      endDate: moment().endOf('day').toDate().getTime(),
    });
  }, []);

  useEffect(() => {
    setSearchBox({
      ...getEmptySearchBox(),
      limit: 1000,
      startDate: moment().startOf('day').subtract(5, 'y').toDate().getTime(),
      endDate: moment().endOf('day').toDate().getTime(),
      capabilityName: selectedCapabilityName,
    });
  }, [selectedCapabilityName]);

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

  const deleteSkill = useCallback(
    async (capabilityGroup: CapabilityGroup, capability: CapabilityJson, skill: SkillJson) => {
      // console.log('deleteSkill : ', capabilityGroup);
      // console.log('convertToSkill : ', convertToSkill(capabilityGroup, capability, skill));
      checkSkill(convertToSkill(capabilityGroup, capability, skill));

      //TODO : 코드 수정 필요함
      // selectedCapabilityGroup?.map(
      //   (group, index) =>
      //     group.id === capabilityGroup.id &&
      //     group.capabilities.map(
      //       (cap, index) =>
      //         capabilityGroup.capabilities.findIndex((fi) => fi.id === cap.id) > -1 &&
      //         capabilityGroup.capabilities.findIndex((fi) => cap.skills.splice(
      //           cap.skills.findIndex(
      //             (f) =>
      //               fi.name === f.id
      //           ),
      //           1
      //         )) > -1

      //     )
      // );
      // setSelectedCapabilityGroup(selectedCapabilityGroup);
    },
    [selectedCapabilityGroup]
  );

  const checkSkill = useCallback(
    async (skill: Skill) => {
      const skillInMap = selectedCapabilityGroup?.findIndex(
        (f) =>
          skill.capability.capabilityGroup.id === f.id &&
          f.capabilities.findIndex((f) => f.name === skill.capability.name) > -1 &&
          f.capabilities.findIndex((f) => f.skills.findIndex((fi) => fi.name === skill.name) > -1) > -1
      );

      if (skillInMap > -1) {
        setSelectedSkill(
          selectedSkill?.filter(
            (f) =>
              !(
                skill.name === f.name &&
                skill.capability.name === f.capability.name &&
                skill.capability.capabilityGroup.name === f.capability.capabilityGroup.name
              )
          )
        );

        //TODO : 코드 수정 필요함
        selectedCapabilityGroup?.map(
          (group, index) =>
            group.id === skill.capability.capabilityGroup.id &&
            group.capabilities.map(
              (cap, index) =>
                cap.id === skill.capability.id &&
                cap.skills.splice(
                  cap.skills.findIndex(
                    (f) =>
                      skill.name === f.name &&
                      skill.capability.name === cap.name &&
                      skill.capability.capabilityGroup.name === group.name
                  ),
                  1
                )
            )
        );
        setSelectedCapabilityGroup(selectedCapabilityGroup);
      } else {
        setSelectedSkill([...selectedSkill, skill]);
        /*eslint-disable */
        const capabilityGroups = selectedCapabilityGroup?.filter((f) => {
          if (skill.capability.capabilityGroup.id === f.id) {
            return true;
          }
        });
        // console.log('capabilityGroups : ', capabilityGroups);
        if (capabilityGroups !== undefined && capabilityGroups.length > 0) {
          const capability = selectedCapabilityGroup?.filter((f) => {
            if (skill.capability.capabilityGroup.id === f.id) {
              const capability = f.capabilities.find((c) => c.name === skill.capability.name);
              // console.log('selectedCapabilityGroup : ', f.name);
              // console.log('capability : ', capability);
              if (capability !== undefined) {
                return true;
              }
              return false;
            }
          });
          // console.log('capability : ', capability);
          if (capability.length > 0) {
            // console.log('capability check');
            selectedCapabilityGroup.map((g) => {
              g.id === skill.capability.capabilityGroup.id &&
                g.capabilities.map((c) => {
                  c.id === skill.capability.id &&
                    c.skills.push({
                      id: skill.id,
                      name: skill.name,
                      synonymTag: skill.synonymTag,
                    });
                });
            });
          } else {
            // console.log('group check');
            selectedCapabilityGroup.map((g) => {
              g.id === skill.capability.capabilityGroup.id &&
                g.capabilities.push({
                  id: skill.capability.id,
                  name: skill.capability.name,
                  skills: [
                    {
                      id: skill.id,
                      name: skill.name,
                      synonymTag: skill.synonymTag,
                    },
                  ],
                });
            });
          }
        } else {
          //기존에 없다면 신규 등록
          // console.log('add');
          setSelectedCapabilityGroup([
            ...selectedCapabilityGroup,
            {
              id: skill.capability.capabilityGroup.id,
              name: skill.capability.capabilityGroup.name,
              capabilities: [
                {
                  id: skill.capability.id,
                  name: skill.capability.name,
                  skills: [
                    {
                      id: skill.id,
                      name: skill.name,
                      synonymTag: skill.synonymTag,
                    },
                  ],
                },
              ],
            },
          ]);
        }
        /*eslint-enable */
      }

      selectedSkillCountUpdate();
    },
    [selectedSkill, selectedCapabilityGroup]
  );

  return (
    <>
      {button && (
        <Button onClick={() => setModalOpen(true)} type="button">
          역량 선택
        </Button>
      )}
      <React.Fragment>
        {selectedCapabilityGroup &&
          selectedCapabilityGroup.length > 0 &&
          selectedCapabilityGroup[0].capabilities &&
          selectedCapabilityGroup[0].capabilities.length > 0 && (
            <>
              <Table celled structured>
                <colgroup>
                  <col width="15%" />
                  <col width="20%" />
                  <col width="65%" />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">역량군</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">역량</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">Skill(Synonyms)</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedCapabilityGroup &&
                    selectedCapabilityGroup.map((capabilityGroup, capabilityGroupIndex) => {
                      const capabilityGroupRowNum =
                        selectedCapabilityGroup[capabilityGroupIndex].capabilities &&
                        selectedCapabilityGroup[capabilityGroupIndex].capabilities
                          .map((cap, index) => cap.skills.length)
                          .reduce((cap, val) => cap + val);

                      return (
                        capabilityGroup.capabilities &&
                        capabilityGroup.capabilities.map((capability, capabilityIndex) => {
                          const capabilityRownum = capability.skills.length;
                          return capability.skills.map((skill, index) => {
                            return (
                              <Table.Row key={index}>
                                {capabilityIndex === 0 && index === 0 && (
                                  <Table.Cell rowSpan={capabilityGroupRowNum}>
                                    {(capabilityGroup && capabilityGroup.name) || '-'}
                                  </Table.Cell>
                                )}
                                {index === 0 && (
                                  <Table.Cell rowSpan={capabilityRownum}>
                                    {(capability && capability.name) || '-'}
                                  </Table.Cell>
                                )}
                                <Table.Cell>
                                  {(skill && skill.name).concat('(' + skill.synonymTag + ')') || '-'}
                                </Table.Cell>
                              </Table.Row>
                            );
                          });
                        })
                      );
                    })}
                </Table.Body>
              </Table>
            </>
          )}
        <Modal size="large" open={modalOpen}>
          <Modal.Header className="res">
            역량 선택
            <span className="sub f12">역량을 선택해주세요.</span>
          </Modal.Header>

          <Modal.Content className="fit-layout">
            {searchBox && (
              <ModalSearchBoxContainer searchBox={searchBox} setCapabilitySkillList={setCapabilitySkillList} />
            )}
            <div className="channel-change">
              <div className="table-css">
                <div className="row head">
                  <div className="cell v-middle">
                    <span className="text01">역량</span>
                  </div>
                  <div className="cell v-middle">
                    <span className="text01">Skill</span>
                  </div>
                  <div className="cell v-middle">
                    <span className="text01">
                      Selected
                      {(selectedSkillCount && (
                        <span className="count">
                          <span className="text01 add">{selectedSkillCount}</span>
                          <span className="text02">개</span>
                        </span>
                      )) ||
                        ''}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="cell vtop">
                    <div className="select-area">
                      <div className="scrolling-60vh">
                        <List className="toggle-check">
                          {(capability &&
                            capability.map((capability, index) => (
                              <List.Item
                                key={index}
                                className={capability.name === selectedCapabilityName ? 'active' : ''}
                              >
                                <Segment onClick={() => searchCapabilitySkill(capability.name)}>
                                  {capability.name}
                                  <div className="fl-right">
                                    <Icon name="check" />
                                  </div>
                                </Segment>
                              </List.Item>
                            ))) ||
                            ''}
                        </List>
                      </div>
                    </div>
                  </div>
                  <div className="cell vtop">
                    <div className="select-area">
                      <div className="scrolling-60vh">
                        {(capabilitySkillList &&
                          capabilitySkillList.length &&
                          capabilitySkillList.map((capabilitySkill, index) => (
                            <Form.Field
                              key={index}
                              control={Checkbox}
                              checked={
                                selectedCapabilityGroup?.findIndex(
                                  (f) =>
                                    capabilitySkill.capability.capabilityGroup.id === f.id &&
                                    f.capabilities.findIndex((f) => f.name === capabilitySkill.capability.name) > -1 &&
                                    f.capabilities.findIndex(
                                      (f) => f.skills.findIndex((fi) => fi.name === capabilitySkill.name) > -1
                                    ) > -1
                                ) > -1
                              }
                              // disabled={
                              //   personalCube && personalCube.category && personalCube.category.channel
                              //   && personalCube.category.channel.id === channel.id
                              // }
                              label={capabilitySkill.name}
                              onChange={() => checkSkill(capabilitySkill)}
                            />
                          ))) ||
                          null}
                      </div>
                    </div>
                  </div>
                  <div className="cell vtop">
                    <div className="select-area">
                      <div className="scrolling-60vh">
                        <span className="select-item">
                          {selectedCapabilityGroup.map(
                            (capabilityGroup, index) =>
                              capabilityGroup.capabilities &&
                              capabilityGroup.capabilities.map((capability, index) =>
                                capability.skills.map((skill, index) => (
                                  <Button
                                    className="del"
                                    key={index}
                                    onClick={() => deleteSkill(capabilityGroup, capability, skill)}
                                  >
                                    {capability.name} &gt; {skill.name}
                                    <div className="fl-right">
                                      <Icon name="times" />
                                    </div>
                                  </Button>
                                ))
                              )
                          ) || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button className="w190 d" onClick={() => setModalOpen(false)} type="button">
              Cancel
            </Button>
            {/* eslint-disable */}
            <Button
              className="w190 p"
              onClick={() => {
                onHandleSkillModalOk && onHandleSkillModalOk(selectedCapabilityGroup);
                setModalOpen(false);
              }}
              type="button"
            >
              OK
            </Button>
            {/* eslint-enable */}
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    </>
  );
};

export default CapabilityModal;
