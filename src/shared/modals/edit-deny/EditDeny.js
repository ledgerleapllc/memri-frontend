import React, { Component } from "react";
import { connect } from "react-redux";
import * as Icon from "react-feather";
import { setEditProposalData, removeActiveModal } from "@redux/actions";
import { withRouter } from "react-router-dom";
import { Button } from '@shared/partials';

import "./edit-deny.scss";

const mapStateToProps = (state) => {
  return {
    editProposalData: state.user.editProposalData,
  };
};

class EditDeny extends Component {
  hideModal() {
    this.props.dispatch(removeActiveModal());
    this.props.dispatch(setEditProposalData({}));
  }

  clickEdit = (e) => {
    e.preventDefault();
    const { editProposalData, history } = this.props;
    if (!editProposalData || !editProposalData.id) return null;
    history.push(`/app/proposal/${editProposalData.id}/edit`);
    this.hideModal();
  };

  render() {
    const { editProposalData } = this.props;
    if (!editProposalData || !editProposalData.id) return null;

    return (
      <div id="edit-deny-modal">
        <div className="custom-modal-close" onClick={() => this.hideModal()}>
          <Icon.X />
          <label>Close Window</label>
        </div>

        <h2>Grant Application Denied</h2>

        <label className="mt-3 d-block font-size-14 font-weight-700">
          The admin has denied your proposal.
        </label>
        <label className="d-block font-size-14">
          <b>Reason:</b> {editProposalData.deny_reason}
        </label>

        <p className="mt-5 mb-5 font-size-14 font-weight-700">
          Would you like to edit your application and reapply?
        </p>

        <div id="edit-deny-modal__buttons">
          <Button size="sm" color="success" onClick={this.clickEdit}>
            Edit
          </Button>
          <Button size="sm" color="primary" onClick={() => this.hideModal()}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(EditDeny));
