import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TopicsView from "../shared/topics/Topics";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Topics extends Component {
  componentDidMount() {
    const { authUser } = this.props;

    if (!authUser.is_member && !authUser.is_admin) {
      this.props.history.push("/app");
    }
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <div id="app-topics-page">
        <div data-aos="fade-in" data-aos-duration="500">
          <div className="mb-3">
            <button
              onClick={() => this.props.history.push("/app/topics/create")}
              className="btn btn-primary small"
            >
              New Topic
            </button>
          </div>
        </div>
        <TopicsView />
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Topics));
