import React, { Component } from "react";
import { connect } from "react-redux";
import * as Icon from "react-feather";
import {
  setReviewUser,
  showCanvas,
  hideCanvas,
  setAdminUserTableStatus,
  removeActiveModal,
  setAdminPendingActionTableStatus,
} from "redux/actions";
import { activateParticipant, denyParticipant } from "utils/Thunk";
import { Button } from 'shared/partials';

import "./user-review.scss";

// eslint-disable-next-line no-undef
import moment from "moment";

const mapStateToProps = (state) => {
  return {
    reviewUser: state.admin.reviewUser,
  };
};

class UserReview extends Component {
  hideModal = () => {
    this.props.dispatch(removeActiveModal());
    this.props.dispatch(setReviewUser({}));
  };

  activate = (e) => {
    const { reviewUser } = this.props;
    if (!reviewUser || !reviewUser.user_id) return;

    e.preventDefault();
    if (!window.confirm("Are you sure you are going to activate this Associate?"))
      return;

    this.props.dispatch(
      activateParticipant(
        reviewUser.user_id,
        () => {
          this.props.dispatch(showCanvas());
        },
        () => {
          this.props.dispatch(hideCanvas());
          this.hideModal();
          this.props.dispatch(setAdminUserTableStatus(true));
          this.props.dispatch(setAdminPendingActionTableStatus(true));
        }
      )
    );
  };

  deny = (e) => {
    const { reviewUser } = this.props;
    if (!reviewUser || !reviewUser.user_id) return;

    e.preventDefault();
    if (!window.confirm("Are you sure you are going to deny this Associate?")) return;

    this.props.dispatch(
      denyParticipant(
        reviewUser.user_id,
        () => {
          this.props.dispatch(showCanvas());
        },
        () => {
          this.props.dispatch(hideCanvas());
          this.hideModal();
          this.props.dispatch(setAdminUserTableStatus(true));
          this.props.dispatch(setAdminPendingActionTableStatus(true));
        }
      )
    );
  };

  render() {
    const { reviewUser } = this.props;
    if (!reviewUser || !reviewUser.user_id) return;

    return (
      <div id="user-review-modal">
        <div className="custom-modal-close" onClick={this.hideModal}>
          <Icon.X />
          <label>Close Window</label>
        </div>

        <h2>{reviewUser.email}</h2>

        <ul>
          <li>
            <label>Name:</label>
            <span>
              {reviewUser.first_name} {reviewUser.last_name}
            </span>
          </li>
          <li>
            <label>DOB:</label>
            <span>
              {reviewUser.dob ? moment(reviewUser.dob).format("M/D/YYYY") : ""}
            </span>
          </li>
          <li>
            <label>Address:</label>
            <span>
              {reviewUser.address} {reviewUser.city}, {reviewUser.zip}
            </span>
          </li>
          <li>
            <label>Member Type:</label>
            <span>Full Member</span>
          </li>
          <li>
            <label>Country:</label>
            <span>{reviewUser.country_residence}</span>
          </li>
          <li>
            <label>Country of Citizenship:</label>
            <span>{reviewUser.country_citizenship}</span>
          </li>
        </ul>

        <div id="user-review-modal__buttons">
          <Button size="sm" onClick={this.activate}>
            Activate User
          </Button>
          <Button color="danger" size="sm" onClick={this.deny}>
            Deny User
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(UserReview);
