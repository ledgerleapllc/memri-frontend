import React, { Component } from "react";
import { connect } from "react-redux";
import { hideCanvas, showAlert, showCanvas } from "redux/actions";
import Helper from "utils/Helper";
import { sendResetEmail } from "utils/Thunk";
import { Button } from 'shared/partials';
import { Link } from "react-router-dom";

const mapStateToProps = () => {
  return {};
};

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      success: false,
    };
  }

  inputEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  submit = (e) => {
    e.preventDefault();
    const { email } = this.state;

    if (!Helper.validateEmail(email)) {
      this.props.dispatch(showAlert("Please input valid email"));
      return;
    }

    this.props.dispatch(
      sendResetEmail(
        email,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            this.setState({ email: "", success: true });
          }
        }
      )
    );
  };

  render() {
    const { email, success } = this.state;
    return (
      <div data-aos="fade-up" data-aos-duration="800" className="w-500px">
        {!success && <form className="w-full items-center flex flex-col" action="" method="POST" onSubmit={this.submit}>
          <h2 className="text-center capitalize font-normal text-primary mb-4">Forgot Password</h2>
          <span className="text-gray2 text-base font-light">
            Enter the email address associated with your account.
          </span>
          <div className="flex flex-col mt-12 gap-4 w-full items-center">
            <div className="form-control w-full">
              <input placeholder="Email Address"
                required={true}
                type="email"
                onChange={this.inputEmail}
                name="email"
                value={email}
              />
            </div>
            <Button className="" color="primary" type="submit">Send Reset Link</Button>
            <Link to="/" className="text-primary">Cancel & Go Back</Link>
          </div>
        </form>}
        {success && (
          <div className="w-full items-center flex flex-col">
            <h2 className="text-center capitalize font-normal text-primary mb-4">Success!</h2>
            <span className="text-gray2 text-base font-light">
              A link has been sent to your email to help you reset your password.
            </span>
            <Button as={Link} to="/login" className="mt-12" color="primary">Sign In</Button>
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(ForgotPassword);
