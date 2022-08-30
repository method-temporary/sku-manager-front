import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HistoryContainer } from 'shared/ui';
import NoAuthPage from 'pages/NoAuthPage';
import RedirectPage from 'pages/RedirectPage';
import { ValidateRoutes } from 'ValidateRoutes';
import { Suspense } from 'react';
import CourseraRedirectPage from './pages/CourseraRedirectPage';

const CardResultReportPDF = React.lazy(() => import('./card/student/ui/logic/CardResultReportPDF'));
const CardResultReportPDFIE = React.lazy(() => import('./card/student/ui/logic/CardResultReportPDFIE'));

export const baseUrl = `${process.env.NODE_ENV}` === 'development' ? '/' : '/manager/';
export const userManagementUrl = 'user-management';
export const learningManagementUrl = 'learning-management';
export const contentsManagementUrl = 'contents-management';
export const serviceManagementUrl = 'service-management';
export const systemManagementUrl = 'system-management';
export const displayManagementUrl = 'arrange-management';
export const certificationManagementUrl = 'certification-management';
export const communityManagementUrl = 'community-management';
export const translationManagementUrl = 'translation-management';
export const exampleUrl = 'example';

export default function Routes() {
  const isIE = true;
  const pdfRender = isIE ? CardResultReportPDF : CardResultReportPDFIE;

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={RedirectPage} />
          <Route exact path="/error" component={NoAuthPage} />
          <Route exact path="/coursera-redirect" component={RedirectPage} />
          <Route path="/coursera-redirect/:success" component={CourseraRedirectPage} />
          <Route path="/pdf/:cardId" component={pdfRender} />
          {/*<Route path="/coursera-cpcontents/redirect" component={CourseraCpContentsPage} />*/}
          {/*<Route path="/coursera-cpstudents/redirect" component={CourseraCpStudentsPage} />*/}
          <Route path="/" component={ValidateRoutes} />
          <Route component={NoAuthPage} />;
        </Switch>
      </Suspense>
      <HistoryContainer />
    </BrowserRouter>
  );
}
