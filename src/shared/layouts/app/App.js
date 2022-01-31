import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AppRoutes } from "routes";
import { ReactComponent as Logo } from 'assets/icons/logo.svg';

import "./app.scss";

const mapStateToProps = () => {
  return {};
};

class App extends Component {
  render() {
    const { auth } = this.props;

    // const className = "outer-page-wrap bg-1";
    // const headerType = "default";

    // className = "outer-page-wrap white-scheme bg-2";
    // headerType = "blue";

    // Render View
    return (
      <div className="relative h-screen overflow-hidden">
        <div className="relative z-40 flex flex-col container mx-auto pt-8 pb-16 h-full">
          <header data-aos="fade-up" data-aos-duration="800">
            <Logo className="main-logo text-primary w-28" />
          </header>
          <div className="flex-1 min-h-0 flex-center">
            <AppRoutes auth={auth} />
          </div>
        </div>
        <img className="z-30 absolute -bottom-12" src="/images/bg-login.svg" alt="" />
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(App));
