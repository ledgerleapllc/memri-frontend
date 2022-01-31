import React, { Component } from "react";
import { connect } from "react-redux";
import {
  removeActiveModal,
  showCanvas,
  hideCanvas,
  setActiveModal,
} from "redux/actions";
import { sendKycKangaroo } from "utils/Thunk";
import { Button } from 'shared/partials';
import "./style.scss";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class ResendKyc extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Hide Modal
  hideModal = (e) => {
    if (e) e.preventDefault();
    this.props.dispatch(removeActiveModal());
  };

  // Click Start
  sendLink = (e) => {
    e.preventDefault();
    this.props.dispatch(
      sendKycKangaroo(
        {},
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res.success) {
            this.props.dispatch(setActiveModal("confirm-kyc-link"));
          }
        }
      )
    );
  };

  // Render Content
  render() {
    return (
      <div id="start-kyc-modal">
        <p className="mt-2 mb-3">
          {`Your link will be resent to your email ${this.props.authUser.email}. Please check your spam folder. You can only resend your link once every hour.`}
        </p>
        <div id="start-kyc-modal__buttons" className="pt-2">
          <Button size="sm" onClick={this.sendLink}>
            Resend Link
          </Button>
          <Button
            variant="text"
            size="sm"
            className="underline"
            onClick={() => this.hideModal()}
            style={{ cursor: "pointer" }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ResendKyc);
