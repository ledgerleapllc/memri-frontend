import React from "react";
import { useSelector } from "react-redux";
import { Tab, Card, CardHeader, CardBody } from '@shared/partials';
import ActiveSurveysTable from "./components/tables/active-surveys";
import ActiveRFPSurveysTable from "./components/tables/active-rfp-surveys";
import CompletedSurveysTable from "./components/tables/completed-surveys";
import CompletedRFPSurveysTable from "./components/tables/completed-rfp-surveys";

const ActiveGrantSurveys = () => {
  const authUser = useSelector(state => state.global.authUser);

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            Grants
          </h3>
        </div>
      </CardHeader>
      <CardBody>
        {authUser && <ActiveSurveysTable authUser={authUser} />}
      </CardBody>
    </Card>
  )
}

const ActiveRfpSurveys = () => {
  const authUser = useSelector(state => state.global.authUser);
  
  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            RFP Surveys
          </h3>
        </div>
      </CardHeader>
      <CardBody>
        {authUser && <ActiveRFPSurveysTable authUser={authUser} />}
      </CardBody>
    </Card>
  )
}

const CompletedGrantSurveys = () => {
  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            Grants
          </h3>
        </div>
      </CardHeader>
      <CardBody>
        <CompletedSurveysTable />
      </CardBody>
    </Card>
  )
}

// eslint-disable-next-line no-unused-vars
const CompletedRfpSurveys = () => {
  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            RFP Surveys
          </h3>
        </div>
      </CardHeader>
      <CardBody>
        <CompletedRFPSurveysTable />
      </CardBody>
    </Card>
  )
}

const Tab1 = () => {
  return (
    <div className="flex flex-col h-full gap-4">
      <ActiveGrantSurveys />
      <ActiveRfpSurveys />
    </div>
  )
}

const Tab2 = () => {
  return (
    <div className="flex flex-col h-full gap-4">
      <CompletedGrantSurveys />
      {/* <CompletedRfpSurveys /> */}
    </div>
  )
}

const tabsData = [
  {
    content: Tab1,
    id: 'active',
    title: 'Active',
  },
  {
    content: Tab2,
    id: 'completed',
    title: 'Completed',
  },
];
const UserSurveys = () => {
  const authUser = useSelector(state => state.global.authUser);

  if (!authUser || !authUser.id || !authUser.is_member) return null;

  return (
    <Tab tabs={tabsData} />
  );
}

export default UserSurveys;
