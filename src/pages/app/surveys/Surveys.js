import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import { Tab } from '@shared/partials';
import ActiveSurveyTab from "./components/tabs/active-survey-tab";
import CompletedSurveyTab from "./components/tabs/completed-survey-tab";
import WinnersTab from "./components/tabs/winners-tab";
import DownvotedTab from "./components/tabs/downvoted-tab";
import RFPSurveysTab from "./components/tabs/rfp-surveys-tab";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

const tabsData = [
  {
    content: () => <ActiveSurveyTab />,
    id: 'active',
    title: 'Active',
  },
  {
    content: () => <CompletedSurveyTab />,
    id: 'completed',
    title: 'Completed',
  },
  {
    content: () => <WinnersTab />,
    id: 'winners',
    title: 'Winners',
  },
  {
    content: () => <DownvotedTab />,
    id: 'downvoted',
    title: 'Downvoted',
  },
  {
    content: () => <RFPSurveysTab />,
    id: 'rfp-surveys',
    title: 'RFP Surveys',
  },
];

class Surveys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "active",
    };
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    if (!authUser.is_admin) return <Redirect to="/" />;

    return (
      <Tab tabs={tabsData} />
    );
  }
}

export default connect(mapStateToProps)(withRouter(Surveys));
