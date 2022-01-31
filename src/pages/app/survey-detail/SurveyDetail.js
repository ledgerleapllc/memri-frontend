import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import { PageHeaderComponent } from "shared/components";
import "./style.scss";
import SurveyVotesTable from "./components/tables/survey-votes";
import SurveyDownVotesTable from "./components/tables/survey-downvotes";
import RankOfBidsTable from "./components/tables/rank-of-bids";
import BidsVotesTable from "./components/tables/bids-votes";
import {
  hideCanvas,
  setActiveModal,
  showAlert,
  showCanvas,
} from "redux/actions";
import {
  getSurveyDetail,
  getSurveyVoters,
  getUserNotVoteSurvey,
  getRFPSurveyVoters,
  sendReminderForRFPSurvey,
  getUserNotVoteRFPSurvey,
  sendReminderForSurvey,
} from "utils/Thunk";
import { TimeClock } from "shared/components/time-clock/TimeClock";
import moment from "moment";
import Helper from "utils/Helper";
import { SURVEY_PREFIX } from "utils/Constant";
import { Card, CardHeader, CardBody, Button } from 'shared/partials';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class SurveyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyId: null,
      surveyData: null,
      voters: [],
      unvotedUsers: [],
      currentVoter: "",
    };
  }

  componentWillUnmount() {
    document.body.classList.remove('scroll-window');
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    const surveyId = params.id;
    this.setState({ surveyId });
    document.body.classList.add('scroll-window');

    this.props.dispatch(
      getSurveyDetail(
        surveyId,
        () => {},
        (res) => {
          if (res.success) {
            this.setState({ surveyData: res.survey });
            if (res.survey.type === "grant") {
              this.props.dispatch(
                getSurveyVoters(
                  surveyId,
                  { limit: 9999 },
                  () => {},
                  (res) => {
                    if (res.success) {
                      this.setState({ voters: res.users });
                    }
                  }
                )
              );
              this.props.dispatch(
                getUserNotVoteSurvey(
                  surveyId,
                  { limit: 9999 },
                  () => {},
                  (res) => {
                    if (res.success) {
                      this.setState({ unvotedUsers: res.users });
                    }
                  }
                )
              );
            }
            if (res.survey.type === "rfp") {
              this.props.dispatch(
                getRFPSurveyVoters(
                  surveyId,
                  { limit: 9999 },
                  () => {},
                  (res) => {
                    if (res.success) {
                      this.setState({ voters: res.users });
                    }
                  }
                )
              );
              this.props.dispatch(
                getUserNotVoteRFPSurvey(
                  surveyId,
                  { limit: 9999 },
                  () => {},
                  (res) => {
                    if (res.success) {
                      this.setState({ unvotedUsers: res.users });
                    }
                  }
                )
              );
            }
          }
        }
      )
    );
  }

  showAnswer = () => {
    const { currentVoter, surveyId, voters, surveyData } = this.state;
    const temp = voters.find((x) => x.email === currentVoter);
    this.props.dispatch(
      setActiveModal("show-survey-voter-answer", {
        surveyId,
        user: temp,
        surveyData: surveyData,
      })
    );
  };

  sendReminder = () => {
    const { surveyData } = this.state;
    if (surveyData?.type === "grant") {
      this.props.dispatch(
        sendReminderForSurvey(
          this.state.surveyId,
          () => {
            this.props.dispatch(showCanvas());
          },
          (res) => {
            this.props.dispatch(hideCanvas());
            if (res.success) {
              this.props.dispatch(
                showAlert("Send reminder successfully!", "success")
              );
            }
          }
        )
      );
    }
    if (surveyData?.type === "rfp") {
      this.props.dispatch(
        sendReminderForRFPSurvey(
          this.state.surveyId,
          () => {
            this.props.dispatch(showCanvas());
          },
          (res) => {
            this.props.dispatch(hideCanvas());
            if (res.success) {
              this.props.dispatch(
                showAlert("Send reminder successfully!", "success")
              );
            }
          }
        )
      );
    }
  };

  render() {
    const { authUser } = this.props;
    const {
      surveyData,
      surveyId,
      voters,
      unvotedUsers,
      currentVoter,
    } = this.state;
    if (!authUser || !authUser.id) return null;
    if (!authUser.is_admin) return <Redirect to="/" />;

    return (
      <div>
        <PageHeaderComponent title="" />
        <Card>
          <CardHeader>
            <h3 className="font-bold">
              Survey {SURVEY_PREFIX[surveyData?.type]}
              {surveyData?.id}
            </h3>
          </CardHeader>
          <CardBody>
            <div className="">
              <div>
                <span>Status: </span>
                <b className="pl-4 capitalize">{surveyData?.status}</b>
              </div>
              {surveyData?.status === "active" && (
                <div className="flex">
                  <span>Time left: </span>
                  <b className="pl-4 d-inline-block">
                    <TimeClock lastTime={moment(surveyData?.end_time)} />
                  </b>
                </div>
              )}
              <div>
                <span>Submissions complete:</span>{" "}
                <b className="pl-4 ">
                  {surveyData?.user_responded} out of {surveyData?.total_member}
                </b>
              </div>
            </div>
          </CardBody>
        </Card>
        <section className="app-infinite-box mb-4">
          {surveyData?.status === "completed" && (
            <>
              {surveyData?.type === "grant" && (
                <Card className="mt-4">
                  <CardBody>
                    <>
                      <div className="app-infinite-search-wrap">
                        <h4>Winners</h4>
                      </div>
                      <div className="pb-3 pl-5 pr-3">
                        <ul>
                          {surveyData?.survey_ranks
                            .filter((x) => x.is_winner)
                            .map((item) => (
                              <li className="py-2" key={item.id}>
                                {Helper.ordinalSuffixOf(item.rank)} Place -{" "}
                                <Link to={`/app/proposal/${item.proposal?.id}`}>
                                  <b>
                                    #{item.proposal?.id} - {item.proposal?.title}
                                  </b>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                      {+surveyData?.downvote === 1 && (
                        <>
                          <div className="app-infinite-search-wrap">
                            <h4>Downvotes</h4>
                          </div>
                          <div className="pb-3 pl-5 pr-3">
                            <ul>
                              {surveyData?.survey_downvote_ranks
                                .filter((x) => x.is_winner)
                                .map((item) => (
                                  <li className="py-2" key={item.id}>
                                    {Helper.ordinalSuffixOf(item.rank)} Place -{" "}
                                    <Link
                                      to={`/app/proposal/${item.proposal?.id}`}
                                    >
                                      <b>
                                        #{item.proposal?.id} -{" "}
                                        {item.proposal?.title}
                                      </b>
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </>
                  </CardBody>
                </Card>
              )}
              {surveyData?.type === "rfp" && (
                <Card className="mt-4">
                  <CardHeader>
                    <h3>Rank of bids</h3>
                  </CardHeader>
                  <CardBody>
                    <RankOfBidsTable surveyId={surveyId} />
                  </CardBody>
                </Card>
              )}
            </>
          )}
          {surveyId && (
            <>
              {surveyData?.type === "grant" && (
                <>
                  <Card className="mt-4">
                    <CardBody>
                      <SurveyVotesTable
                        id={surveyId}
                        cols={surveyData?.number_response}
                      />
                    </CardBody>
                  </Card>
                  {+surveyData?.downvote === 1 && (
                    <Card className="mt-4">
                      <CardBody>
                        <SurveyDownVotesTable
                          id={surveyId}
                          cols={surveyData?.number_response}
                        />
                      </CardBody>
                    </Card>
                  )}
                </>
              )}
              {surveyData?.type === "rfp" && (
                <Card className="mt-4">
                  <CardBody>
                    <BidsVotesTable
                      id={surveyId}
                      cols={surveyData?.survey_rfp_bids?.length}
                    />
                  </CardBody>
                </Card>
              )}
            </>
          )}
          <Card className="mt-4">
            <CardHeader>
              <h3>View survey responses by user</h3>
            </CardHeader>
            <CardBody>
              <div className="c-form-row pb-3 pl-5 pr-3">
                <label>Select number of responses needed</label>
                <div className="d-flex">
                  <select
                    className="px-4 py-2 border border-white1"
                    value={currentVoter}
                    onChange={(e) =>
                      this.setState({ currentVoter: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select voter
                    </option>
                    {voters.map((x, i) => (
                      <option key={`option1_${i}`} value={x.user_id}>
                        {x.email}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    className="ml-2 py-2"
                    disabled={!currentVoter}
                    onClick={this.showAnswer}
                  >
                    Go
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
          
          {surveyData?.status === "active" && (
            <Card className="mt-4">
              <CardHeader>
                <h3>Users who have not yet submitted survey</h3>
              </CardHeader>
              <CardBody>
                <div className="pb-2">
                  <ul className="pb-4">
                    {unvotedUsers.map((user) => (
                      <li className="pb-1" key={user.id}>
                        {user.email}
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="md"
                    onClick={this.sendReminder}
                    disabled={unvotedUsers.length === 0}
                  >
                    Send reminder
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </section>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(SurveyDetail));
