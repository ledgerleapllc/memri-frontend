import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Banner from 'shared/components/banner';
import "./style.scss";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class NewSurveyAlert extends Component {
  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    if (authUser.is_member && authUser.has_survey) {
      return (
        <Banner>
          <div>
            <label className="font-weight-700">
              A survey is active! Please respond to your survey in the survey{" "}
              tab in the left menu.
            </label>
          </div>
        </Banner>
      );
    }

    return null;
  }
}

export default connect(mapStateToProps)(withRouter(NewSurveyAlert));
