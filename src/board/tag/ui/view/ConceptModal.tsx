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
import Concept from 'board/tag/model/Concept';
import ConceptView from 'board/tag/model/view/ConceptView';
import TermView from 'board/tag/model/view/TermView';
import { getEmptySearchBox } from 'board/tag/model/SearchBox';
import { requestFindTerms } from 'board/tag/service/requestTag';
import Term, { convertToTerm } from 'board/tag/model/Term';
import { useSearchBox, setSearchBox } from 'board/tag/store/SearchBoxStore';
import ModalSearchBoxContainer from '../logic/ModalSearchBoxContainer';
import { useConcept } from 'board/tag/store/ConceptStore';
import { useList } from 'board/tag/store/ConceptListStore';

interface ConceptModalProps {
  onHandleTermModalOk?: (selectedConceptView: ConceptView[]) => void;
  concepts: ConceptView[];
  button?: boolean;
}

const ConceptModal: React.FC<ConceptModalProps> = function ConceptModal({ onHandleTermModalOk, concepts, button }) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [conceptList, setConceptList] = useState<Concept[] | undefined>([]);
  const [conceptTermList, setConceptTermList] = useState<Term[] | undefined>();

  const [selectedTerm, setSelectedTerm] = useState<Term[]>([]);

  const [selectedConceptView, setSelectedConceptView] = useState<ConceptView[]>([]);

  const [oldSelectedConceptView, setOldSelectedConceptView] = useState<ConceptView[]>([]);

  const [Concept, setConcept] = useState<string | undefined>();

  const [selectedConceptViewName, setSelectedConceptViewName] = useState<string>();
  const [selectedTermId, setSelectedTermId] = useState<string>();

  const searchBox = useSearchBox();
  const concept = useConcept();
  const terms = useList();

  //TODO : 객체 기준 render 개선 필요
  useEffect(() => {
    concept && setConceptList(concept);
  }, [concept]);

  useEffect(() => {
    // console.log('terms', terms);
  }, [terms]);

  useEffect(() => {
    concepts && setSelectedConceptView(concepts);
    concepts && setOldSelectedConceptView(concepts);
  }, [concepts]);

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
      conceptName: selectedConceptViewName,
    });
  }, [selectedConceptViewName]);

  const searchConceptTerm = useCallback(
    (conceptName) => {
      setSelectedConceptViewName(conceptName);
      setSearchBox({
        ...searchBox,
        conceptName,
      });
      searchBox &&
        requestFindTerms().then((ConceptList) => {
          setConceptTermList(ConceptList);
        });
    },
    [searchBox]
  );

  const deleteTerm = useCallback(
    async (concept: ConceptView, term: TermView) => {
      checkTerm(convertToTerm(concept, term));
    },
    [selectedConceptView]
  );

  const checkTerm = useCallback(
    async (term: Term) => {
      const termInMap = selectedConceptView?.findIndex(
        (f) => term.concept.id === f.id && f.terms.findIndex((f) => f.name === term.name) > -1
      );

      if (termInMap > -1) {
        setSelectedTerm(
          selectedTerm?.filter(
            (f) =>
              !(term.name === f.name && term.concept.name === f.concept.name && term.concept.name === f.concept.name)
          )
        );

        //TODO : 코드 개선 필요함
        selectedConceptView?.map(
          (concept, index) =>
            concept.id === term.concept.id &&
            concept.terms.splice(
              concept.terms.findIndex((f) => term.name === f.name && term.concept.name === concept.name),
              1
            )
        );

        setSelectedConceptView(selectedConceptView?.filter((concept, index) => concept.terms.length !== 0));

        // setSelectedConceptView(selectedConceptView);
      } else {
        setSelectedTerm([...selectedTerm, term]);
        /*eslint-disable */
        const concepts = selectedConceptView?.filter((f) => {
          if (term.concept.id === f.id) {
            return true;
          }
        });
        if (concepts !== undefined && concepts.length > 0) {
          const concept = selectedConceptView?.filter((f) => {
            if (term.concept.id === f.id) {
              const terms = f.terms.find((c) => c.name === term.name);
              if (terms !== undefined) {
                return true;
              }
              return false;
            }
          });
          if (concept.length === 0) {
            selectedConceptView.map((g) => {
              g.id === term.concept.id &&
                g.terms.push({
                  id: term.id,
                  name: term.name,
                  synonymTag: term.synonymTag,
                });
            });
          }
        } else {
          //기존에 없다면 신규 등록
          setSelectedConceptView([
            ...selectedConceptView,
            {
              id: term.concept.id,
              name: term.concept.name,
              terms: [
                {
                  id: term.id,
                  name: term.name,
                  synonymTag: term.synonymTag,
                },
              ],
            },
          ]);
        }
        /*eslint-enable */
      }
    },
    [selectedTerm, selectedConceptView]
  );

  return (
    <>
      {button && (
        <Button
          onClick={() => {
            setModalOpen(true);
            setConceptTermList([]);
          }}
          type="button"
        >
          Term 선택
        </Button>
      )}
      <React.Fragment>
        {selectedConceptView &&
          selectedConceptView.length > 0 &&
          selectedConceptView[0].terms &&
          selectedConceptView[0].terms.length > 0 && (
            <>
              <Table celled structured>
                <colgroup>
                  <col width="20%" />
                  <col width="80%" />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">Concept</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">Term(Synonyms)</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedConceptView &&
                    selectedConceptView.map((concept, conceptIndex) => {
                      const conceptRownum = concept.terms.length;
                      return concept.terms.map((term, index) => {
                        return (
                          <Table.Row key={index}>
                            {index === 0 && (
                              <Table.Cell rowSpan={conceptRownum}>{(concept && concept.name) || '-'}</Table.Cell>
                            )}
                            <Table.Cell>
                              {(term.synonymTag &&
                                term.synonymTag !== null &&
                                (term && term.name).concat('(' + term.synonymTag + ')')) ||
                                ''}
                              {((!term.synonymTag || term.synonymTag === null || term.synonymTag === '') &&
                                term &&
                                term.name) ||
                                ''}
                            </Table.Cell>
                          </Table.Row>
                        );
                      });
                    })}
                </Table.Body>
              </Table>
            </>
          )}
        <Modal size="large" open={modalOpen}>
          <Modal.Header className="res">
            Term 선택
            <span className="sub f12">Term를 선택해주세요.</span>
          </Modal.Header>

          <Modal.Content className="fit-layout">
            {searchBox && <ModalSearchBoxContainer searchBox={searchBox} setConceptTermList={setConceptTermList} />}

            <div className="channel-change">
              <div className="table-css">
                <div className="row head">
                  {!terms && (
                    <div className="cell v-middle">
                      <span className="text01">Concept</span>
                    </div>
                  )}
                  <div className="cell v-middle">
                    <span className="text01">Term</span>
                  </div>
                  <div className="cell v-middle">
                    <span className="text01">
                      Selected
                      {(selectedConceptView && selectedConceptView.length > 0 && (
                        <span className="count">
                          <span className="text01 add">
                            {selectedConceptView.map((fi) => fi.terms.length).reduce((a, v) => a + v)}
                          </span>
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
                          {(terms &&
                            terms.results.map((term, index) => (
                              <List.Item
                                key={index}
                                className={
                                  // term.id === selectedTermId
                                  selectedConceptView.find((f) => f.terms.find((tf) => tf.id === term.id))
                                    ? 'active'
                                    : ''
                                }
                              >
                                <Segment
                                  onClick={() => {
                                    // searchConceptTerm(term.concept.name);
                                    checkTerm(term);
                                    setSelectedTermId(term.id);
                                  }}
                                >
                                  {term.concept.name} &gt; {term.name}
                                  <div className="fl-right">
                                    <Icon name="check" />
                                  </div>
                                </Segment>
                              </List.Item>
                            ))) ||
                            ''}
                          {(concept &&
                            concept.map((concept, index) => (
                              <List.Item
                                key={index}
                                className={concept.name === selectedConceptViewName ? 'active' : ''}
                              >
                                <Segment onClick={() => searchConceptTerm(concept.name)}>
                                  {concept.name}
                                  <div className="fl-right">
                                    <Icon name="check" />
                                  </div>
                                </Segment>
                              </List.Item>
                            ))) ||
                            ''}
                          {(terms === undefined || terms.results.length === 0) &&
                            (concept === undefined || concept.length === 0) &&
                            '검색 결과를 찾을 수 없습니다.'}
                        </List>
                      </div>
                    </div>
                  </div>
                  {!terms && (
                    <div className="cell vtop">
                      <div className="select-area">
                        <div className="scrolling-60vh">
                          {(conceptTermList &&
                            conceptTermList.length &&
                            conceptTermList.map((conceptTerm, index) => (
                              <Form.Field
                                key={index}
                                control={Checkbox}
                                checked={
                                  selectedConceptView?.findIndex(
                                    (f) =>
                                      conceptTerm.concept.id === f.id &&
                                      f.terms.findIndex((fi) => fi.name === conceptTerm.name) > -1
                                  ) > -1
                                }
                                // disabled={
                                //   personalCube && personalCube.category && personalCube.category.channel
                                //   && personalCube.category.channel.id === channel.id
                                // }
                                label={conceptTerm.name}
                                onChange={() => checkTerm(conceptTerm)}
                              />
                            ))) ||
                            '선택된 항목이 없습니다.'}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="cell vtop">
                    <div className="select-area">
                      <div className="scrolling-60vh">
                        <span className="select-item">
                          {(selectedConceptView &&
                            selectedConceptView.length > 0 &&
                            selectedConceptView.map(
                              (concept, index) =>
                                concept.terms &&
                                concept.terms.map((term, index) => (
                                  <Button className="del" key={index} onClick={() => deleteTerm(concept, term)}>
                                    {concept.name} &gt; {term.name}
                                    <div className="fl-right">
                                      <Icon name="times" />
                                    </div>
                                  </Button>
                                ))
                            )) ||
                            '선택된 항목이 없습니다.'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              className="w190 d"
              onClick={() => {
                setModalOpen(false);
                setSelectedConceptView(oldSelectedConceptView);
              }}
              type="button"
            >
              Cancel
            </Button>
            {/* eslint-disable */}
            <Button
              className="w190 p"
              onClick={() => {
                onHandleTermModalOk && onHandleTermModalOk(selectedConceptView);
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

export default ConceptModal;
