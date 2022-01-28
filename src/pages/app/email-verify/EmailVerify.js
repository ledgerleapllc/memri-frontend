/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unescaped-entities */
import React, { Component } from "react";
import { Button } from '@shared/partials';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { showAlert, showCanvas, hideCanvas } from "@redux/actions";
import { getMe, resendCode, verifyCode } from "@utils/Thunk";
import { ReactComponent as IconArrowLeft } from '@assets/icons/ic-arrow-left.svg';

import "./email-verify.scss";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class EmailVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
    };
  }

  inputCode = (e) => {
    this.setState({ code: e.target.value });
  };

  clickResend = (e) => {
    e.preventDefault();

    this.props.dispatch(
      resendCode(
        () => {
          this.props.dispatch(showCanvas());
        },
        () => {
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  submit = (e) => {
    e.preventDefault();

    const { code } = this.state;

    if (!code) {
      this.props.dispatch(showAlert("Input verification code"));
      return;
    }

    this.props.dispatch(
      verifyCode(
        code,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          if (res.success) {
            this.props.dispatch(
              getMe(
                () => {},
                () => {
                  this.props.dispatch(hideCanvas());
                }
              )
            );
          } else this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  render() {
    const { authUser } = this.props;
    const { code } = this.state;

    if (!authUser || !authUser.id) return null;

    return (
      <div data-aos="fade-up" data-aos-duration="800" className="auth-container h-4/5">
        <h2 className="flex items-center capitalize font-normal text-primary mb-4 relative">
          <IconArrowLeft className="absolute -left-16 text-2xl" onClick={this.props.history.goBack} />
          Email Verification
        </h2>
        <span className="text-gray2 text-base font-light">
          Please enter the code sent to {authUser.email}.
          <a className="pl-4 text-primary" onClick={this.clickResend}>Resend the code</a>
        </span>
        <form className="mt-24" action="" method="POST" onSubmit={this.submit}>
          <input
            placeholder="Enter Code"
            type="text"
            value={code}
            onChange={this.inputCode}
          />
          <div className="mt-10">
            <Button className="mt-6 2xl:mt-12" color="primary" type="submit">Register</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(EmailVerify));
