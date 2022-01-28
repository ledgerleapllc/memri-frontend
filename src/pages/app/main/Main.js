import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// import MembershipAlertView from "../shared/membership-alert/MembershipAlert";
import NewGrantAlertView from "../shared/new-grant-alert/NewGrantAlert";
import FirstGrantAlert from "../shared/first-grant-alert/FirstGrantAlert";
import FormalBallotsView from "../shared/formal-ballots/FormalBallots";
import InformalBallotsView from "../shared/informal-ballots/InformalBallots";
import ProposalsView from "../shared/proposals/Proposals";
import PendingUsersView from "../shared/pending-users/PendingUsers";
import UsersView from "../shared/users";
import "./main.scss";
import NewSurveyAlert from "../shared/new-survey-alert/NewSurveyAlert";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Main extends Component {
  renderContent() {
    const { authUser } = this.props;
    if (authUser && authUser.is_admin) {
      return (
        <Fragment>
          <PendingUsersView />
          <UsersView />
        </Fragment>
      );
    }

    return (
      <>
        <NewSurveyAlert />
        <NewGrantAlertView />
        <FirstGrantAlert />
        {/* <MembershipAlertView /> */}

        {/* <div id="app-ballots-wrap" className="row">
          <div className="col col-12 col-md-6 mb-2">
            <InformalBallotsView />
          </div>
          <div className="col col-12 col-md-6 mb-2">
            <FormalBallotsView />
          </div>
        </div> */}
        <div className="flex flex-col gap-5 h-full">
          <div  className="flex h-2/5 gap-5">
            <div className="h-full w-full lg:flex-1">
              <InformalBallotsView />
            </div>
            <div className="h-full w-full lg:flex-1">
              <FormalBallotsView />
            </div>
          </div>
          <div className="flex-1 min-h-0 w-full">
            <ProposalsView />
          </div>
        </div>
      </>
    );
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return <div id="app-main-page">{this.renderContent()}</div>;
  }
}

export default connect(mapStateToProps)(Main);
