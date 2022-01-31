import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  hideCanvas,
  removeActiveModal,
  showAlert,
  showCanvas,
  startInformalAdminTools,
  toggleEditMode,
} from "redux/actions";
import {
  forceWithdrawProposal,
  startInformalVotingShared,
} from "utils/Thunk";
import {
  Button
} from 'shared/partials';
import "./admin-tools.scss";

const mapStateToProps = () => {
  return {};
};

const ACTIONS = {
  edit: "Edit Proposal",
  withdraw: "Force Withdraw",
  startInformal: "Begin Informal Voting",
};

class AdminTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAction: null,
    };
  }

  hideModal = () => {
    this.props.dispatch(removeActiveModal());
  };

  confirmAction = (action) => {
    this.setState({
      currentAction: action,
    });
  };

  performAction = () => {
    const { proposalId } = this.props.data;
    const { history } = this.props;
    if (this.state.currentAction === "edit") {
      this.props.dispatch(toggleEditMode(true));
      this.hideModal();
    } else if (this.state.currentAction === "withdraw") {
      this.props.dispatch(
        forceWithdrawProposal(
          proposalId,
          () => {
            this.props.dispatch(showCanvas());
          },
          () => {
            this.props.dispatch(hideCanvas());
            this.hideModal();
            history.push("/app/discussions");
          }
        )
      );
    } else if (this.state.currentAction === "startInformal") {
      this.props.dispatch(
        startInformalVotingShared(
          proposalId,
          () => {
            this.props.dispatch(showCanvas());
          },
          (res) => {
            this.props.dispatch(hideCanvas());
            this.hideModal();
            this.props.dispatch(startInformalAdminTools(true));
            if (res.success) {
              this.props.dispatch(
                showAlert(
                  "Informal voting process has been started successfully",
                  "success"
                )
              );
            }
          }
        )
      );
    }
  };

  // Render Content
  render() {
    return (
      <div id="admin-tools-modal">
        {!this.state.currentAction ? (
          <ul>
            {Object.keys(ACTIONS).map((x, index) => (
              <li key={index}>
                <Button
                  className="w-4/5"
                  onClick={() => this.confirmAction(x)}
                >
                  {ACTIONS[x]}
                </Button>
              </li>
            ))}
            <li>
              <Button
                className="w-4/5"
                variant="outline"
                onClick={this.hideModal}
              >
                Cancel Admin Action
              </Button>
            </li>
          </ul>
        ) : (
          <>
            <h4 className="pb-1">
              Are you sure you want to {ACTIONS[this.state.currentAction]}?
            </h4>
            <div className="mt-4 flex justify-center gap-4 items-center">
              <Button onClick={this.performAction}>
                Yes
              </Button>
              <Button 
                variant="outline"
                onClick={this.hideModal}
              >
                No
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(AdminTools));
