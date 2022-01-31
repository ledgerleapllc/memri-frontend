import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ActiveRFPSurveysTable from "../../tables/active-rfp-surveys";
import CompletedRFPSurveysTable from "../../tables/completed-rfp-surveys";
import { Card, CardHeader, CardBody } from '@shared/partials';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class RFPSurveysTab extends Component {
  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="h-1/2 pb-4">
          <Card className="h-full">
            <CardHeader>
              <h3>Active Surveys</h3>
            </CardHeader>
            <CardBody>
              <ActiveRFPSurveysTable />
            </CardBody>
          </Card>
        </div>
        <div className="h-1/2">
          <Card className="h-full">
            <CardHeader>
              <h3>Completed Surveys</h3>
            </CardHeader>
            <CardBody>
              <CompletedRFPSurveysTable />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(RFPSurveysTab));
