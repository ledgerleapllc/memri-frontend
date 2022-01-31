import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CompletedSurveysTable from "../../tables/completed-surveys";
import CompletedRFPSurveysTable from "../../tables/completed-rfp-surveys";
import "./style.scss";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class CompletedUserSurveyTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="survey-page">
        <div data-aos="fade-in" data-aos-duration="500">
          <section className="h-50 active-section app-infinite-box mb-4">
            <div className="app-infinite-search-wrap">
              <label>Grant</label>
            </div>
            <CompletedSurveysTable />
          </section>
        </div>
        <div data-aos="fade-in" data-aos-duration="500">
          <section className="h-50 app-infinite-box mb-4">
            <div className="app-infinite-search-wrap">
              <label>RFP Surveys</label>
            </div>
            <CompletedRFPSurveysTable />
          </section>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(CompletedUserSurveyTab));
