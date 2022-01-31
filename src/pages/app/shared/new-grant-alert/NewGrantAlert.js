import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Helper from "@utils/Helper";
import { hideCanvas, saveUser, showCanvas } from "@redux/actions";
import { Link } from "react-router-dom";
import Banner from '@shared/components/banner';
import { ReactComponent as SettingIcon } from "@assets/icons/ic-settings.svg";

import { Button } from '@shared/partials';
import "./new-grant-alert.scss";
import { dismissNewMemberAlert } from "@utils/Thunk";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class NewGrantAlert extends Component {
  clickRegister = async (e) => {
    e.preventDefault();
    const { history } = this.props;
    Helper.storeUser({});
    await this.props.dispatch(saveUser({}));
    history.push("/register/form");
  };

  dismiss = (e) => {
    e.preventDefault();
    this.props.dispatch(
      dismissNewMemberAlert(
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          if (res.success) {
            const temp = this.props.authUser;
            temp.press_dismiss = 1;
            this.props.dispatch(saveUser({ ...temp }));
          }
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    if (!authUser.is_admin && !authUser.press_dismiss) {
      return (
        <Banner>
          <div className="flex gap-6">
            <SettingIcon />
            <div>
              <label className="font-weight-700">
                Welcome to the portal! Are you here to submit a grant request?
              </label>
              <p className="font-size-12">{`Click the "My Proposals" tab to the left, then the button for "New Grant Proposal" to start the process. Please be aware that grants require a 100 Euro DOS Fee for all applications.`}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              color="secondary2"
              size="sm"
              as={Link}
              to="/app/proposals"
            >
              Request grant
            </Button>
            <Button
              color="secondary2"
              size="sm"
              onClick={this.dismiss}
            >
              Dismiss alert
            </Button>
          </div>
        </Banner>
      );
    }

    return null;
  }
}

export default connect(mapStateToProps)(withRouter(NewGrantAlert));
