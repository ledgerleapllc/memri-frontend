/* eslint-disable react/no-unescaped-entities */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Fade } from "react-reveal";
import { hideCanvas, showAlert, showCanvas } from "@redux/actions";
import { checkLogin2FA } from "@utils/Thunk";
import { Button } from '@shared/partials';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Login2FA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
    };
  }

  inputCode = (e) => {
    this.setState({ code: e.target.value });
  };

  submit = (e) => {
    e.preventDefault();

    const { code } = this.state;

    if (!code) {
      this.props.dispatch(showAlert("Input two-factor authentication code"));
      return;
    }

    this.props.dispatch(
      checkLogin2FA(
        code,
        () => {
          this.props.dispatch(showCanvas());
        },
        () => {
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  render() {
    const { authUser } = this.props;
    const { code } = this.state;

    if (!authUser || !authUser.id) return null;

    return (
      <div>
        <div className="custom-container w-500px">
          <Fade distance={"20px"} bottom duration={500} delay={400}>
            <form className="items-center flex flex-col gap-4" action="" method="POST" onSubmit={this.submit}>
              <h2 className="text-center capitalize font-normal text-primary mb-4">Two-Factor Authentication</h2>
              <div>
                <p className="font-size-18 text-center">
                  Please enter the code sent to the email: {authUser.email}
                </p>
                <p className="font-size-14 text-center mt-4">
                  {`Make sure to check your spam folder if you do not see the code in your box after 1 minute.`}
                </p>
              </div>
              <input
                placeholder="Enter Code"
                type="text"
                value={code}
                onChange={this.inputCode}
                className="w-full"
              />
              <Button className="w-3/5 mt-4" type="submit">
                Submit
              </Button>
            </form>
          </Fade>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Login2FA);
