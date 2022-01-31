import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ActiveSurveysTable from "../../tables/active-surveys";
import DiscussionProposalsTable from "../../tables/discussion-proposals";
import { getSurveys } from "@utils/Thunk";
import {
  forceReloadGuardStartSurvey,
  showAlert,
} from "@redux/actions";
import { Card, CardHeader, CardBody, Button } from '@shared/partials';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    reloadGuardStartSurvey: state.admin.reloadGuardStartSurvey,
  };
};

class ActiveSurveyTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActiveSurveyExisted: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.reloadGuardStartSurvey &&
      this.props.reloadGuardStartSurvey !== prevProps.reloadGuardStartSurvey
    ) {
      this.props.dispatch(forceReloadGuardStartSurvey(false));
      this.getData();
    }
  }

  getData() {
    const params = {
      limit: 1,
      status: "active",
    };

    this.props.dispatch(
      getSurveys(
        params,
        () => {},
        (res) => {
          const result = res.surveys || [];
          this.setState({
            isActiveSurveyExisted: result.length > 0,
          });
        }
      )
    );
  }

  startNewSurvey = () => {
    const { isActiveSurveyExisted } = this.state;
    if (isActiveSurveyExisted) {
      this.props.dispatch(
        showAlert(
          "You cannot begin a new survey while a survey is active.",
          "warning"
        )
      );
    }
    if (isActiveSurveyExisted === false) {
      const { history } = this.props;
      history.push("/app/surveys/start");
    }
  };

  render() {
    return (
      <div className="survey-page flex flex-col gap-4 h-full">
        <Card>
          <CardHeader>
            <div className="w-full flex justify-between">
              <h3 className="font-bold text-lg">Active Surveys</h3>
              <Button onClick={this.startNewSurvey} size="md">
                Start New Survey
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <ActiveSurveysTable />
          </CardBody>
        </Card>
        <Card className="flex-1 min-h-0">
          <CardBody>
            <DiscussionProposalsTable />
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(ActiveSurveyTab));
