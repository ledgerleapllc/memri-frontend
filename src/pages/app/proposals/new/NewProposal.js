/* eslint-disable no-undef */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import { ReactComponent as IconArrowLeft } from 'assets/icons/ic-arrow-left.svg';

import { Link } from "react-router-dom";
import "./new-proposal.scss";
import ProposalFinalForm from "../../shared/proposal-final-form/ProposalFinalForm";
import { hideCanvas, showAlert, showCanvas } from "redux/actions";
import {
  getProposalDraftDetail,
  submitProposal,
  uploadFile,
} from "utils/Thunk";
import { Button } from 'shared/partials';
import qs from "qs";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class NewProposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposal: null,
      checkedDraft: false,
      isSaved: false,
      draftId: null,
    };
    this.proposalForm = React.createRef();
  }

  componentDidMount() {
    const {
      location: { search },
    } = this.props;
    const query = qs.parse(search, { ignoreQueryPrefix: true });
    if (query.draft) {
      this.getDraft(query.draft);
      this.setState({ draftId: query.draft });
    } else {
      this.setState({ checkedDraft: true });
    }
  }

  create = (proposalValue, files) => {
    this.props.dispatch(
      submitProposal(
        {
          ...proposalValue,
          proposal_draft_id: this.state.draftId,
        },
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          const { history } = this.props;
          if (res.success && res.proposal && res.proposal.id) {
            if (files && files.length) {
              const formData = new FormData();
              files.forEach((file) => {
                formData.append("files[]", file);
                formData.append("names[]", file.name);
              });
              formData.append("proposal", res.proposal.id);

              this.props.dispatch(
                uploadFile(
                  formData,
                  () => {
                    this.props.dispatch(showCanvas());
                  },
                  (res) => {
                    if (res.success) {
                      history.push("/app/proposals");
                      this.props.dispatch(
                        showAlert(
                          `You have successfully submitted your proposal. We will review it and keep you posted.`,
                          "success"
                        )
                      );
                      this.props.dispatch(hideCanvas());
                    }
                  }
                )
              );
            } else {
              history.push("/app/proposals");
              this.props.dispatch(
                showAlert(
                  `You have successfully submitted your proposal. We will review it and keep you posted.`,
                  "success"
                )
              );
              this.props.dispatch(hideCanvas());
            }
          } else this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  saveDraft = () => {
    this.proposalForm.current.saveDraft(false);
  };

  getDraft = (id) => {
    this.props.dispatch(
      getProposalDraftDetail(
        id,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res.success) {
            const proposal = res.proposal;
            proposal.milestones = JSON.parse(proposal.milestones);
            proposal.members = JSON.parse(proposal.members);
            proposal.grants = JSON.parse(proposal.grants);
            proposal.member_required = proposal.members?.length > 0;
            proposal.tags = JSON.parse(proposal.tags)?.join(",");
            proposal.citations = JSON.parse(proposal.citations);
            proposal.include_membership = +proposal.include_membership;
            this.setState({ proposal, checkedDraft: true });
          }
        }
      )
    );
  };

  saveDone = () => {
    this.setState({ isSaved: true });
    setTimeout(() => {
      this.setState({ isSaved: false });
    }, 3000);
  };

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    if (authUser.is_admin) return <Redirect to="/" />;
    // if (!authUser.shuftipro) return <Redirect to="/" />;

    return (
      <div className="h-full flex-col flex">
        <div className="flex mb-4">
          <div className="flex-center gap-2">
            <Link onClick={() => this.props.history.goBack()}>
              <IconArrowLeft />
            </Link>
            <h3 className="font-bold text-lg">
              New Proposal
            </h3>
          </div>
          <div
            className="ml-3 d-flex align-items-center"
          >
            <Button
              size="md"
              className="mr-2"
              onClick={this.saveDraft}
            >
              Save and finish later
            </Button>
            {this.state.isSaved && <span>save successful!</span>}
          </div>
        </div>
        <p className="pb-4">
          Please read{" "}
          <a
            href={process.env.REACT_APP_FRONTEND_URL + "guide.pdf"}
            target="_blank"
            rel="noreferrer"
            className="dynamic-color"
          >
            <u>the guide</u>
          </a>{" "}
            first to understand this form.
        </p>
        {this.state.checkedDraft && (
          <div className="flex-1 min-h-0">
            <ProposalFinalForm
              allowAutoSave
              ref={this.proposalForm}
              proposal={this.state.proposal}
              onChange={this.create}
              onSaved={this.saveDone}
            />
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(NewProposal));
