import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import SidebarLayout from "shared/layouts/sidebar/Sidebar";
import { showSidebar, hideSidebar, setActiveModal } from "redux/actions";
import { AuthAppRoutes } from "routes";

import "./authapp.scss";

const mapStateToProps = (state) => {
  return {
    sidebarShown: state.global.sidebarShown,
  };
};

class AuthApp extends Component {
  componentDidMount() {
    document.body.onclick = (e) => {
      const { sidebarShown } = this.props;

      const target = e.target || null;

      if (target && target.id == "app-canvas" && sidebarShown)
        this.props.dispatch(hideSidebar());
    };
  }

  showSidebar = (e) => {
    e.preventDefault();
    this.props.dispatch(showSidebar());
  };

  startKYC = () => {
    this.props.dispatch(setActiveModal("start-kyc"));
  };

  kycError = () => {
    this.props.dispatch(setActiveModal("kyc-error"));
  };

  render() {
    const { auth: authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    if (
      !authUser.is_admin &&
      !authUser.is_participant &&
      !authUser.is_member &&
      !authUser.is_proposer &&
      !authUser.is_guest
    )
      return <Redirect to="/" />;

    if (!authUser.is_admin) {
      if (!authUser.email_verified || !authUser.can_access)
        return <Redirect to="/" />;
    }

    if (
      authUser.profile &&
      authUser.profile.twoFA_login &&
      authUser.profile.twoFA_login_active
    )
      return <Redirect to="/" />;

    return (
      <div className="app-page-wrap">
        <SidebarLayout authUser={authUser} />

        <div className="app-content-wrap">
          <div id="app-canvas"></div>

          <div className="app-content-body" id="app-content-body">
            <div id="app-content__header" className="flex justify-end mb-4 2xl:mb-8">
              <div className="flex gap-2 items-center">
                <div className="w-5 h-5 bg-primary rounded-full font-bold text-white text-xs flex-center">{authUser.last_name?.[0]}</div>
                <span className="font-bold">{authUser.first_name} {authUser.last_name}</span>
              </div>
            </div>
            <div className="min-h-0 flex-1 flex-col flex">
              <AuthAppRoutes />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(AuthApp));
