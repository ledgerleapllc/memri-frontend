import React, { Component } from "react";
import { connect } from "react-redux";
import {
  hideCanvas,
  removeActiveModal,
  setActiveModal,
  showCanvas,
} from "redux/actions";
import { getMe, sendKycKangaroo } from "utils/Thunk";
import { Button } from 'shared/partials';
import "./style.scss";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class KycGrant extends Component {
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
            this.props.dispatch(
              getMe(
                () => {},
                () => {}
              )
            );
          }
        }
      )
    );
  };

  // Render Content
  render() {
    return (
      <div id="start-kyc-modal">
        <h2 className="pb-2">
          {this.props.authUser.first_name} {this.props.authUser.last_name}
        </h2>
        <p className="mt-2 mb-3">
          {`You need to submit your KYC information before you can submit a grant application. Please click the link below to start the process. Return here 15 minutes after you complete the KYC process and you should be able to start the grant process`}
        </p>
        <div id="start-kyc-modal__buttons" className="pt-2">
          <Button size="sm" onClick={this.sendLink}>
            Send me a link to start the KYC/AML process
          </Button>
          <Button
            variant="text" size="sm"
            className="text-primary underline"
            onClick={() => this.hideModal()}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(KycGrant);
