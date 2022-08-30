import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { FieldErrors, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { PaidCourseQueryModel } from '_data/lecture/students/model/PaidCourseQueryModel';
import { CompanyCodeSelectBox } from './components/CompanyCodeSelectBox';
import { LearningStateSelectBox } from './components/LearningStateSelectBox';
import { PaidCourseDateSelectBox } from './components/PaidCourseDateSelectBox';
import { PaidCourseSearchInput } from './components/PaidCourseSearchInput';
import { ProposalStateSelectBox } from './components/ProposalStateSelectBox';
import PaidCourseStore from '../paidCourse.store';
import { EmployedSelectBox } from './components/EmployedSelectBox';

type PickedPaidCourseQueryModel = Pick<
  PaidCourseQueryModel,
  'startDate' | 'endDate' | 'proposalState' | 'paidCourseLearningState' | 'companyCode' | 'employed'
>;

type PaidCourseSearchType = '' | 'studentName' | 'departmentName' | 'cardName' | 'email';

export interface PaidCourseSearchBoxForm extends PickedPaidCourseQueryModel {
  searchType: PaidCourseSearchType;
  searchWord: string;
}

export const PaidCourseSearchBox = observer(() => {
  const { paidCourseQuery, setOffset, setPaidCourseState, setInitPaidCourseState } = PaidCourseStore.instance;

  const methods = useForm<PaidCourseSearchBoxForm>();
  const { handleSubmit } = methods;

  useEffect(() => {
    return () => {
      setInitPaidCourseState();
    };
  }, []);

  const onSubmit: SubmitHandler<PaidCourseSearchBoxForm> = (data) => {
    setOffset(0);

    const params: PaidCourseQueryModel = {
      ...paidCourseQuery,
      ...data,
      offset: 0,
      cardName: data.searchType === 'cardName' ? data.searchWord.replaceAll('"', '\\"') : undefined,
      studentName: data.searchType === 'studentName' ? data.searchWord : undefined,
      departmentName: data.searchType === 'departmentName' ? data.searchWord : undefined,
      email: data.searchType === 'email' ? data.searchWord : undefined,
      employed: data.employed,
    };

    setPaidCourseState(params);
  };

  const onError = (errors: FieldErrors<PaidCourseSearchBoxForm>) => {
    console.log(errors);
  };

  return (
    <Segment>
      <FormProvider {...methods}>
        <Form className="search-box" onSubmit={handleSubmit(onSubmit, onError)}>
          <Grid>
            <Grid.Row>
              <PaidCourseDateSelectBox />
              <ProposalStateSelectBox />
              <CompanyCodeSelectBox />
              <LearningStateSelectBox />
              <EmployedSelectBox />
              <PaidCourseSearchInput />
              <Grid.Column width={16}>
                <div className="center">
                  <Button primary type="submit">
                    검색
                  </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </FormProvider>
    </Segment>
  );
});
