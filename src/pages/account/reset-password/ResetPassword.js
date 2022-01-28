import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { hideCanvas, showAlert, showCanvas } from "@redux/actions";
import Helper from "@utils/Helper";
import { resetPassword } from "@utils/Thunk";
import { Button } from '@shared/partials';

const mapStateToProps = () => {
  return {};
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      password_confirmation: "",
    };

    this.token = null;
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    const urlParams = new URLSearchParams(window.location.search);

    this.token = params.token || null;
    const email = urlParams.get("email");

    if (email) {
      this.setState({
        email,
      });
    }
  }

  inputField = (e, key) => {
    this.setState({ [key]: e.target.value });
  };

  submit = (e) => {
    e.preventDefault();
    const { email, password, password_confirmation } = this.state;

    if (!email || !Helper.validateEmail(email)) {
      this.props.dispatch(showAlert("Input valid email address"));
      return;
    }

    if (!password || !password_confirmation) {
      this.props.dispatch(showAlert("Input password"));
      return;
    }

    if (password != password_confirmation) {
      this.props.dispatch(showAlert("Password doesn't match"));
      return;
    }

    if (!Helper.checkPassword(password)) {
      this.props.dispatch(
        showAlert(
          `Please use a password with at least 8 characters including at least one number, one letter and one symbol`
        )
      );
      return;
    }

    this.props.dispatch(
      resetPassword(
        {
          email,
          password,
          password_confirmation,
          token: this.token,
        },
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res.success) {
            const { history } = this.props;
            history.push("/login");
          }
        }
      )
    );
  };

  render() {
    const { email, password, password_confirmation } = this.state;
    return (
      <div data-aos="fade-up" data-aos-duration="800" className="w-500px">
        <form className="w-full items-center flex flex-col" action="" method="POST" onSubmit={this.submit}>
          <h2 className="text-center capitalize font-normal text-primary mb-4">Reset Password</h2>
          <div className="flex flex-col mt-12 gap-4 w-full items-center">
            <div className="form-control w-full">
              <input
                placeholder="Email"
                required={true}
                type="email"
                onChange={(e) => this.inputField(e, "email")}
                value={email}
              />
            </div>
            <div className="form-control w-full">
              <input
                placeholder="Password"
                required={true}
                type="password"
                onChange={(e) => this.inputField(e, "password")}
                value={password}
              />
            </div>
            <div className="form-control w-full">
              <input
                placeholder="Confirm Password"
                required={true}
                type="password"
                onChange={(e) => this.inputField(e, "password_confirmation")}
                value={password_confirmation}
              />
            </div>
            <Button color="primary" type="submit">Submit</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(ResetPassword));
