import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CompletedSurveysTable from "../../tables/completed-surveys";
import { Card, CardHeader, CardBody } from 'shared/partials';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class CompletedSurveyTab extends Component {
  render() {
    return (
      <Card className="h-full">
        <CardHeader>
          <h3 className="font-bold text-lg">Completed Surveys</h3>
        </CardHeader>
        <CardBody>
          <CompletedSurveysTable />
        </CardBody>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(withRouter(CompletedSurveyTab));
