import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Grid, Segment, Select, Icon, Input } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { useSearchBox, setSearchBox } from 'board/tag/store/SearchBoxStore';
import {
  requestFindAllConcept,
  requestfindConcepts,
  selectField,
  requestFindAllConceptModal,
} from 'board/tag/service/requestTag';
import { SearchBox } from 'board/tag/model/SearchBox';
import Concept from 'board/tag/model/Concept';
import Term from 'board/tag/model/Term';
import { setList } from 'board/tag/store/ConceptListStore';
import { setConcept } from 'board/tag/store/ConceptStore';

const SEARCH_TYPE_OPTIONS = [
  { key: 'ALL', text: '전체', value: 'ALL' },
  { key: 'CONCEPT', text: 'Concept', value: 'CONCEPT' },
  { key: 'TERM', text: 'Term', value: 'TERM' },
];

interface ModalSearchBoxContainerProps {
  searchBox: SearchBox;
  setConceptTermList: React.Dispatch<React.SetStateAction<Term[] | undefined>>;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

const ModalSearchBoxContainer: React.FC<ModalSearchBoxContainerProps> = function ModalSearchBoxContainer({
  searchBox,
  setConceptTermList,
}) {
  const [startDate, setStartDate] = useState<moment.Moment>();
  const [endDate, setEndDate] = useState<moment.Moment>();
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('');
  const [conceptId, setConceptId] = useState<string>('');
  const [concepts, setConcepts] = useState<any[]>();

  useEffect(() => {
    // setConcepts(selectField());

    setSearchBox({
      ...searchBox,
      termName: '',
      conceptName: '',
      registrantName: '',
      modifierName: '',
    });

    search();
  }, []);

  useEffect(() => {
    //TODO : 차후 로직 개선 고민
    if (searchType === 'CONCEPT') {
      setSearchBox({
        ...searchBox,
        conceptName: searchText || '',
        termName: '',
      });
    } else if (searchType === 'TERM') {
      setSearchBox({
        ...searchBox,
        conceptName: '',
        termName: searchText || '',
      });
    } else {
      setSearchBox({
        ...searchBox,
        termName: '',
        conceptName: '',
        registrantName: '',
        modifierName: '',
      });
      setSearchText('');
    }
    return () => {
      setSearchBox({
        ...searchBox,
        termName: '',
        conceptName: '',
        registrantName: '',
        modifierName: '',
      });
    };
  }, [searchType, searchText]);

  useEffect(() => {
    setSearchBox({
      ...searchBox,
      limit: 1000,
      startDate: moment().startOf('day').subtract(5, 'y').toDate().getTime(),
      endDate: moment().endOf('day').toDate().getTime(),
      conceptId,
    });
  }, [conceptId]);

  const search = useCallback(() => {
    setSearchBox({
      ...searchBox,
      limit: 1000,
      startDate: moment().startOf('day').subtract(5, 'y').toDate().getTime(),
      endDate: moment().endOf('day').toDate().getTime(),
    });

    if (searchType == 'TERM' && searchBox.termName !== '') {
      requestFindAllConcept();
      setConcept();
    } else {
      requestFindAllConceptModal();
      setConceptTermList([]);
      setList();
    }
  }, [searchBox, searchType]);

  return (
    <Segment>
      <Form className="search-box">
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Group inline>
                <label>검색어</label>
                <Form.Field
                  control={Select}
                  placeholder="Select"
                  options={SEARCH_TYPE_OPTIONS}
                  defaultValue={SEARCH_TYPE_OPTIONS[0].value}
                  onChange={(e: any, data: any) => setSearchType(data.value)}
                  // value={searchBox?.searchType || SEARCH_TYPE_OPTIONS[0].value}
                  // onChange={(e: any, data: any) => setSearchType(data.value)}
                />
                <Form.Field
                  control={Input}
                  width={10}
                  placeholder="검색어를 입력해주세요."
                  disabled={searchType === '' || searchType === 'ALL'}
                  value={searchText}
                  onChange={(e: any, data: any) => setSearchText(data.value)}
                />
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={16}>
              <div className="center">
                <Button primary onClick={() => search()}>
                  검색
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Segment>
  );
};

export default ModalSearchBoxContainer;
