import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as Icon from "react-feather";
import { showAlert, showCanvas, hideCanvas } from "@redux/actions";
import { submitVote } from "@utils/Thunk";
import { DECIMALS } from "@utils/Constant";
import {
  Checkbox,
  CheckboxX,
  Card as OldCard,
  CardPreview,
  CardHeader as OldCardHeader,
  CardBody as OldCardBody,
} from "@shared/components";
import { BALLOT_TYPES } from "@utils/enum";
import { Card, Button, CardBody } from '@shared/partials';

// eslint-disable-next-line no-undef
const moment = require("moment");

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    settings: state.global.settings,
  };
};

class Informal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stakeAmount: "",
      day: "00",
      hours: "00",
      min: "00",
      secs: "00",
    };

    this.diff = 0;
    this.timer = null;
  }

  componentDidMount() {
    const { vote, mins } = this.props;
    this.diff = moment(vote.created_at)
      .add(mins, "minutes")
      .diff(moment(), "seconds");
    if (this.diff) {
      let secs = this.diff % 60;
      let min = parseInt(this.diff / 60);
      let hours = parseInt(min / 60);
      min = min % 60;
      let day = parseInt(hours / 24);
      hours = hours % 24;

      secs = secs.toString().padStart(2, "0");
      min = min.toString().padStart(2, "0");
      hours = hours.toString().padStart(2, "0");
      day = day.toString().padStart(2, "0");

      this.setState({ day, hours, min, secs }, () => {
        this.timer = setTimeout(() => {
          this.runTimer();
        }, 1000);
      });
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  runTimer() {
    let { day, hours, min, secs } = this.state;
    secs = parseInt(secs);
    day = parseInt(day);
    hours = parseInt(hours);
    min = parseInt(min);

    if (day || hours || min || secs) {
      if (secs) secs--;
      else {
        if (min) {
          min--;
          secs = 59;
        } else {
          if (hours) {
            hours--;
            min = 59;
            secs = 59;
          } else {
            day--;
            hours = 23;
            min = 59;
            secs = 59;
          }
        }
      }

      secs = secs.toString().padStart(2, "0");
      min = min.toString().padStart(2, "0");
      hours = hours.toString().padStart(2, "0");
      day = day.toString().padStart(2, "0");

      this.setState({ day, hours, min, secs }, () => {
        this.timer = setTimeout(() => {
          this.runTimer();
        }, 1000);
      });
    }
  }

  submitVote(type) {
    let { stakeAmount, day, hours, min, secs } = this.state;
    const { proposal, vote, onRefresh, authUser } = this.props;

    let rep = 0;
    let max = 0;
    if (authUser.profile.rep) rep = parseFloat(authUser.profile.rep);

    max = parseFloat(rep / 2);

    day = parseInt(day);
    hours = parseInt(hours);
    min = parseInt(min);
    secs = parseInt(secs);

    if (!day && !hours && !min && !secs) {
      this.props.dispatch(showAlert("You can't submit your vote"));
      return;
    }

    if (!stakeAmount.trim()) {
      this.props.dispatch(showAlert("Please input stake amount"));
      return;
    }

    const value = +stakeAmount;

    if (value <= 0 || value > max) {
      this.props.dispatch(
        showAlert(
          `Please input value greater than 0 to ${max?.toFixed?.(DECIMALS)}`
        )
      );
      return;
    }

    const params = {
      proposalId: proposal.id,
      voteId: vote.id,
      type,
      value,
    };

    this.props.dispatch(
      submitVote(
        params,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res.success) {
            this.props.dispatch(
              showAlert("You've successfully submitted your vote", "success")
            );
            if (onRefresh) onRefresh();
          }
        }
      )
    );
  }

  inputStakeAmount = (e) => {
    let value = e.target.value;
    // if (value && isNaN(value)) value = "";
    // if (value) value = parseInt(value).toString();
    // if (value && parseInt(value) < 0) value = "";
    if (value && +value < 0) value = "";

    this.setState({ stakeAmount: value });
  };

  renderTitle() {
    const { proposal } = this.props;
    return (
      <label className="text-base font-bold my-3 block">
        {proposal.title}
      </label>
    );
  }

  renderInfo() {
    const { authUser } = this.props;
    let rep = 0;
    let max = 0;
    if (authUser.profile.rep) rep = parseFloat(authUser.profile.rep);

    max = parseFloat(rep / 2);

    return (
      <div className="flex flex-col my-4">
        <label className="d-block font-size-14">
          Available Reputation: <b>{rep?.toFixed?.(DECIMALS)}</b>
        </label>
        <label className="d-block font-size-14 mt-1">
          Max Reputation for Voting (50%): <b>{max?.toFixed?.(DECIMALS)}</b>
        </label>
      </div>
    );
  }

  renderMilestoneInfo() {
    const { proposal, vote } = this.props;
    if (vote.content_type != "milestone") return null;

    const milestones = proposal.milestones || [];
    const milestoneId = vote.milestone_id;

    let milestone = {};
    for (let i in milestones) {
      if (milestones[i].id == milestoneId) {
        milestone = milestones[i];
        break;
      }
    }

    const index = milestones.findIndex((x) => x.id === milestoneId);

    if (!milestone || !milestone.id) return null;
    return (
      <>
        <p className="font-size-14 mt-4">
          Milestone Information:{" "}
          <b>
            Milestone {index + 1} of {milestones?.length} - resubmission{" "}
            {milestone.time_submit}
          </b>
        </p>
        <p className="font-size-14 mt-4">
          Milestone Title: <b>{milestone.title}</b>
        </p>
        <p className="font-size-14 mt-2">
          Acceptance criteria: <b>{milestone.details}</b>
        </p>
        <p className="font-size-14 mt-2">
          Grant Portion: <b>{milestone.grant}</b>
        </p>
        <p className="font-size-14 mt-2">
          OP milestone submission url: <b>{milestone.url}</b>
        </p>
        <div className="font-size-14 mt-2">
          <span className="align-top text-nowrap">
            OP milestone submission notes:
          </span>
          <span className="pl-1 text-pre-wrap">
            <b>{milestone.comment}</b>
          </span>
        </div>
        <p className="font-size-14 mt-2">
          Code reviewer: <b>{milestone.milestone_review?.user?.email}</b>
        </p>
        <p className="font-size-14 mt-2">
          Review date:
          <b className="pl-1">
            {moment(milestone.reviewed_at).format("M/D/YYYY")}
          </b>
        </p>
        <div className="font-size-14 mt-2">
          <span className="align-top text-nowrap">Reviewer notes:</span>
          <span className="pl-1 text-pre-wrap">
            <b>{milestone.notes}</b>
          </span>
        </div>
        <p className="font-size-14 mt-2">
          Reviewer attachments:
          <b>
            <a
              className="pl-1 text-underline"
              target="_blank"
              href={milestone?.support_file_url}
              rel="noreferrer"
            >
              {milestone?.support_file?.split("/").pop()}
            </a>
          </b>
        </p>
      </>
    );
  }

  renderVoteInfo() {
    const { proposal, settings, vote } = this.props;

    const informalVote = vote;

    let totalMembers = proposal.totalMembers || 0;
    totalMembers = parseInt(totalMembers);

    let quorum_rate = 0;
    if (informalVote.content_type == "grant")
      quorum_rate = settings.quorum_rate || 0;
    else if (
      ["simple", "admin-grant", "advance-payment"].includes(
        informalVote.content_type
      )
    )
      quorum_rate = settings.quorum_rate_simple || 0;
    else quorum_rate = settings.quorum_rate_milestone || 0;

    quorum_rate = parseFloat(quorum_rate);

    let minMembers = parseFloat((totalMembers * quorum_rate) / 100);
    minMembers = Math.ceil(minMembers);

    return (
      <Card>
        <CardBody>
          <div
            className="app-simple-section mt-3"
            style={{ flexDirection: "column" }}
          >
            <p className="font-size-14 text-capitalize">
              Informal Vote Type: <b className="capitalize">{BALLOT_TYPES[informalVote.content_type]}</b>
            </p>
            <p className="font-size-14 mt-2">
              This ballot requires <b>{quorum_rate}%</b> of Voting Associates to
              vote. <b>{minMembers}</b> Voting Associates must vote of the total{" "}
              <b>{totalMembers}</b> Voting Associates.{" "}
              <b>{informalVote.totalVotes}</b> have voted.
            </p>
            {this.renderMilestoneInfo()}
          </div>
        </CardBody>
      </Card>
    );
  }

  redirectActiveVote() {
    const { proposal, vote } = this.props;
    if (
      ["admin-grant", "grant", "simple", "advance-payment"].includes(
        vote.content_type
      )
    ) {
      this.props.history.push(`${proposal.id}/informal-vote`);
    } else if (vote.content_type === "milestone") {
      this.props.history.push(`${proposal.id}/milestone-vote/${vote.id}`);
    }
  }

  render() {
    const { stakeAmount, day, hours, min, secs } = this.state;
    const { proposal, authUser, vote } = this.props;

    const currentMilestone = proposal?.milestones.find(
      (x) => x.id === vote.milestone_id
    );
    let data;
    if (currentMilestone?.milestone_review.length > 0) {
      data =
        currentMilestone?.milestone_review[
          currentMilestone?.milestone_review?.length - 1
        ];
    }

    let voted = false;
    if (proposal.voteResults && proposal.voteResults.length) {
      for (let i in proposal.voteResults) {
        if (proposal.voteResults[i].vote_id == vote.id) {
          voted = true;
          break;
        }
      }
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Card className="!w-fit">
            <CardBody>
              <div>
                <label>Time Remaining:</label>
                <div className="text-primary">
                  <span className="text-3xl px-1">{day}</span>
                  <label>day</label>
                  <span className="text-3xl px-1">{hours}</span>
                  <label>hours</label>
                  <span className="text-3xl px-1">{min}</span>
                  <label>min</label>
                  <span className="text-3xl px-1">{secs}</span>
                  <label>sec</label>
                </div>
              </div>
            </CardBody>
          </Card>
          {!!authUser.is_admin && (
            <Button
              type="button"
              onClick={() => this.redirectActiveVote()}
            >
              Admin Active Vote Viewer
            </Button>
          )}
        </div>
        {this.renderVoteInfo()}
        {!voted && authUser.id != proposal.user_id && authUser.is_member ? (
          <Card className="border border-primary !bg-primary !bg-opacity-60 text-white">
            <CardBody>
              <form action="" method="POST" onSubmit={(e) => e.preventDefault()}>
                <div className="flex gap-2">
                  <label>Active Loosely Coupled Vote</label>
                  <Icon.Info size={16} />
                </div>
                <div>
                  {this.renderTitle()}
                  <span className="spacer"></span>
                  <label className="font-bold mt-3">
                    This proposal is now in the loosely coupled voting stage
                  </label>
                  <p className="font-size-12 mt-1">
                    {`Loosely coupled votes are used in determining the overall feelings on the group. You are encouraged to vote your conscience.`}
                  </p>
                  {this.renderInfo()}
                  <input
                    className="bg-white w-72 px-4 py-2 text-black rounded-md"
                    type="number"
                    min="0"
                    placeholder="Stake Amount"
                    value={stakeAmount}
                    onChange={this.inputStakeAmount}
                  />
                  <p className="text-xs mt-3">
                    Please enter the amount of reputation you would like to stake.
                    This will affect the weight of your vote and indicates how
                    strongly you feel. Remember, you can vote with up to 50% of your{" "}
                    available reputation. Keep in mind, the losing side of the vote{" "}
                    loses any staked reputation to the winning side and reputation
                    is valuable.
                  </p>
                  <div className="flex gap-2 justify-end mt-4">
                    <Button
                      type="button"
                      color="success"
                      onClick={() => this.submitVote("for")}
                    >
                      Vote For
                    </Button>
                    <Button
                      color="danger"
                      type="button"
                      onClick={() => this.submitVote("against")}
                    >
                      Vote Against
                    </Button>
                  </div>
                </div>
              </form>
            </CardBody>
          </Card>
        ) : null}
        {+authUser.id === +proposal.user_id && (
          <Card className="border border-primary !bg-primary !bg-opacity-60 text-white">
            <CardBody>
              <form>
                <div>
                  <label className="mb-2">Active tightly coupled vote</label>
                  <br />
                  <b>{`You are not able to vote in this ballot vote because this is your own proposal. You cannot vote for your own proposal.`}</b>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
        {vote.content_type === "milestone" && data?.milestone_check_list && (
          <OldCard className="mt-3 mw-100" isAutoExpand>
            <OldCardHeader>
              <div
                className="app-simple-section__titleInner w-100"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>
                  <label className="pr-2">Applicant checklist</label>
                  <Icon.Info size={16} />
                </div>
              </div>
            </OldCardHeader>
            <CardPreview>
              <div className="py-2">
                <CheckboxX
                  value={
                    +data?.milestone_check_list?.appl_accepted_corprus &&
                    +data?.milestone_check_list?.appl_accepted_definition &&
                    +data?.milestone_check_list?.appl_accepted_pm &&
                    +data?.milestone_check_list?.appl_attests_accounting &&
                    +data?.milestone_check_list?.appl_attests_criteria &&
                    +data?.milestone_check_list?.appl_submitted_corprus
                      ? 1
                      : 0
                  }
                  text={`Application Checklist`}
                  readOnly
                />
              </div>
              <div className="py-2">
                <CheckboxX
                  value={
                    +data?.milestone_check_list?.pm_submitted_evidence &&
                    +data?.milestone_check_list?.pm_submitted_admin &&
                    +data?.milestone_check_list?.pm_verified_crdao &&
                    +data?.milestone_check_list?.pm_verified_corprus &&
                    +data?.milestone_check_list?.pm_verified_subs
                      ? 1
                      : 0
                  }
                  text={`Program Management Checklist`}
                  readOnly
                />
              </div>
              <div className="py-2">
                <CheckboxX
                  value={
                    +data?.milestone_check_list?.crdao_acknowledged_project &&
                    +data?.milestone_check_list?.crdao_accepted_pm &&
                    +data?.milestone_check_list?.crdao_acknowledged_receipt &&
                    +data?.milestone_check_list?.crdao_submitted_review &&
                    +data?.milestone_check_list?.crdao_submitted_subs
                      ? 1
                      : 0
                  }
                  text={`Expert Dao (CR Dao) checklist`}
                  readOnly
                />
              </div>
            </CardPreview>
            <OldCardBody>
              <div className="pt-4">
                <div>
                  <Checkbox
                    value={true}
                    text={`All attestations accepted on ${moment(
                      data?.milestone_check_list?.created_at
                    ).format("M/D/YYYY")}`}
                    readOnly
                  />
                  <h6 className="mt-5">Expert Dao (CR Dao) checklist:</h6>
                  <div className="my-3">
                    <CheckboxX
                      value={
                        +data?.milestone_check_list?.crdao_acknowledged_project
                      }
                      text={`Expert Dao (CR Dao) has acknowledged the project Definition of Done? ${moment(
                        data?.milestone_check_list?.created_at
                      ).format("M/D/YYYY")}`}
                      readOnly
                    />
                    <p className="padding-notes">
                      Notes:{" "}
                      {
                        data?.milestone_check_list
                          ?.crdao_acknowledged_project_notes
                      }
                    </p>
                  </div>
                  <div className="my-3">
                    <CheckboxX
                      value={+data?.milestone_check_list?.crdao_accepted_pm}
                      text={`Expert Dao (CR Dao) has accepted the Program Management T&C? ${moment(
                        data?.milestone_check_list?.created_at
                      ).format("M/D/YYYY")}`}
                      readOnly
                    />
                    <p className="padding-notes">
                      Notes:{" "}
                      {data?.milestone_check_list?.crdao_accepted_pm_notes}
                    </p>
                  </div>
                  <div className="my-3">
                    <CheckboxX
                      value={
                        +data?.milestone_check_list?.crdao_acknowledged_receipt
                      }
                      text={`Expert Dao (CR Dao) has acknowledged receipt of the corpus of work? ${moment(
                        data?.milestone_check_list?.created_at
                      ).format("M/D/YYYY")}`}
                      readOnly
                    />
                    <p className="padding-notes">
                      Notes:{" "}
                      {
                        data?.milestone_check_list
                          ?.crdao_acknowledged_receipt_notes
                      }
                    </p>
                  </div>
                  <div className="my-3">
                    <label className="padding-notes">
                      Program management has valid response from Expert Dao?
                      <b className="pr-2">
                        {data?.milestone_check_list?.crdao_valid_respone}
                      </b>
                      {moment(data?.milestone_check_list?.created_at).format(
                        "M/D/YYYY"
                      )}
                    </label>
                    <p className="padding-notes">
                      Notes:{" "}
                      {data?.milestone_check_list?.crdao_valid_respone_note}
                    </p>
                  </div>
                  <div className="my-3">
                    <CheckboxX
                      value={
                        +data?.milestone_check_list?.crdao_submitted_review
                      }
                      text={`Expert Dao (CR Dao) has submitted a review of the corpus of work? ${moment(
                        data?.milestone_check_list?.created_at
                      ).format("M/D/YYYY")}`}
                      readOnly
                    />
                    <p className="padding-notes">
                      Notes:{" "}
                      {data?.milestone_check_list?.crdao_submitted_review_notes}
                    </p>
                  </div>
                  <div className="my-3">
                    <CheckboxX
                      value={+data?.milestone_check_list?.crdao_submitted_subs}
                      text={`Expert Dao (CR Dao) has acknowledged the project Definition of Done? ${moment(
                        data?.milestone_check_list?.created_at
                      ).format("M/D/YYYY")}`}
                      readOnly
                    />
                    <p className="padding-notes">
                      Notes:{" "}
                      {data?.milestone_check_list?.crdao_submitted_subs_notes}
                    </p>
                  </div>
                  <h6 className="mt-5">Program Management checklist:</h6>
                  <div className="my-3">
                    <CheckboxX
                      value={+data?.milestone_check_list?.pm_submitted_evidence}
                      text={`Expert Dao (CR Dao) Program Management has submitted the Evidence of Work location? ${moment(
                        data?.milestone_check_list?.created_at
                      ).format("M/D/YYYY")}`}
                      readOnly
                    />
                    <p className="padding-notes">
                      Notes:{" "}
                      {data?.milestone_check_list?.pm_submitted_evidence_notes}
                    </p>
                  </div>
                  <div className="my-3">
                    <CheckboxX
                      value={+data?.milestone_check_list?.pm_submitted_admin}
                      text={`Expert Dao (CR Dao) Program Management has submitted Administrator notes? ${moment(
                        data?.milestone_check_list?.created_at
                      ).format("M/D/YYYY")}`}
                      readOnly
                    />
                    <p className="padding-notes">
                      Notes:{" "}
                      {data?.milestone_check_list?.pm_submitted_admin_notes}
                    </p>
                  </div>
                  <div className="my-3">
                    <CheckboxX
                      value={+data?.milestone_check_list?.pm_verified_corprus}
                      text={`Program Management has verified corpus existence? ${moment(
                        data?.milestone_check_list?.created_at
                      ).format("M/D/YYYY")}`}
                      readOnly
                    />
                    <p className="padding-notes">
                      Notes:{" "}
                      {data?.milestone_check_list?.pm_verified_corprus_notes}
                    </p>
                  </div>
                  <div className="my-3">
                    <CheckboxX
                      value={+data?.milestone_check_list?.pm_verified_crdao}
                      text={`Program Management has verified Expert Dao (CR Dao)'s review exists? ${moment(
                        data?.milestone_check_list?.created_at
                      ).format("M/D/YYYY")}`}
                      readOnly
                    />
                    <p className="padding-notes">
                      Notes:{" "}
                      {data?.milestone_check_list?.pm_verified_crdao_notes}
                    </p>
                  </div>
                  <div className="my-3">
                    <CheckboxX
                      value={+data?.milestone_check_list?.pm_verified_subs}
                      text={`Program Management has verified Expert Dao (CR Dao) substantiation (voting record) existence? ${moment(
                        data?.milestone_check_list?.created_at
                      ).format("M/D/YYYY")}`}
                      readOnly
                    />
                    <p className="padding-notes">
                      Notes:{" "}
                      {data?.milestone_check_list?.pm_verified_subs_notes}
                    </p>
                  </div>
                  <div className="my-3">
                    <p className="padding-notes">
                      Other general reviewer notes:
                      <span className="pl-2">
                        {data?.milestone_check_list?.addition_note}
                      </span>
                    </p>
                  </div>
                  <div className="my-3">
                    <p className="padding-notes">
                      Program manager review submission timestamp:
                      <span className="pl-2">
                        {moment(data?.reviewed_at).format("M/D/YYYY")}
                      </span>
                    </p>
                  </div>
                  <div className="my-3">
                    <p className="padding-notes">
                      Program manager reviewer email:
                      <span className="pl-2">{data?.user?.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            </OldCardBody>
          </OldCard>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Informal));
