import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./grants.scss";
import MemberGrant from "./MemberGrant";
import AdminGrant from "./AdminGrant";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Grants extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <div className="h-full" data-aos="fade-up" data-aos-duration="800">
        {!authUser.is_admin && <MemberGrant />}
        {!!authUser.is_admin && <AdminGrant />}
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Grants));
