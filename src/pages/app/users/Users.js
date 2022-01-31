import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PendingUsersView from "../shared/pending-users";
import UsersView from "../shared/users";

import "./users.scss";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Users extends Component {
  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    if (!authUser.is_admin) return <Redirect to="/" />;

    return (
      <div id="app-users-page" className="flex flex-col gap-4">
        <PendingUsersView />
        <div className="flex-1 min-h-0">
          <UsersView />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Users);
