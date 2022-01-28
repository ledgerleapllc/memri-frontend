import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { setActiveModal } from "@redux/actions";
import IdleTimer from "react-idle-timer";
import { useDispatch } from "react-redux";
// Global
const MainView = lazy(() => import("@pages/app/main/Main"));
const DiscussionsView = lazy(() =>
  import("@pages/app/discussions/Discussions")
);
const TopicsView = lazy(() => import("@pages/app/topics/Topics"));
const TopicDetailView = lazy(() => import("@pages/app/topics/TopicDetail"));
const CreateTopicView = lazy(() => import("@pages/app/topics/CreateTopic"));
const EditTopicView = lazy(() => import("@pages/app/topics/EditTopic"));
const SurveysView = lazy(() => import("@pages/app/surveys/Surveys"));
const UserSurveysView = lazy(() => import("@pages/app/user-surveys/Surveys"));

const StartSurveyView = lazy(() =>
  import("@pages/app/start-survey/StartSurvey")
);
const SubmitSurveyView = lazy(() =>
  import("@pages/app/submit-survey/SubmitSurvey")
);

const SurveyDetailView = lazy(() =>
  import("@pages/app/survey-detail/SurveyDetail")
);
const SurveyDetailFullPageView = lazy(() =>
  import("@pages/app/survey-detail-full-page/SurveyDetailFullPage")
);
const VotesView = lazy(() => import("@pages/app/votes/Votes"));
const ProposalsView = lazy(() =>
  import("@pages/app/proposals/list/Proposals")
);
const AllProposalsView = lazy(() =>
  import("@pages/app/proposals/all-list/Proposals")
);
const GrantsView = lazy(() => import("@pages/app/grants/Grants"));
const MilestonesView = lazy(() => import("@pages/app/milestones/Milestones"));
const MilestoneLogView = lazy(() =>
  import("@pages/app/milestone-log/MilestoneLog")
);
const MilestoneReviewView = lazy(() =>
  import("@pages/app/milestone-review/MilestoneReview")
);
const EditProposalView = lazy(() =>
  import("@pages/app/proposals/edit/EditProposal")
);
const EditSimpleProposalView = lazy(() =>
  import("@pages/app/proposals/edit-simple/EditSimpleProposal")
);
const SingleProposalView = lazy(() =>
  import("@pages/app/proposals/single/SingleProposal")
);
const SingleChangeView = lazy(() =>
  import("@pages/app/changes/single/SingleChange")
);
const SettingsView = lazy(() => import("@pages/app/settings/Settings"));
const SchemeView = lazy(() => import("@pages/app/scheme/Scheme"));
const AuthAppErrorView = lazy(() => import("@pages/app/Error"));

// Admin Only
const GlobalSettingsView = lazy(() =>
  import("@pages/app/global-settings/GlobalSettings")
);
const AccountingView = lazy(() => import("@pages/app/accounting/Accounting"));
const AdminTeamView = lazy(() => import("@pages/app/admin-team/AdminTeam"));
const EmailerView = lazy(() => import("@pages/app/emailer/Emailer"));
const ReportView = lazy(() => import("@pages/app/report/Report"));
const UsersView = lazy(() => import("@pages/app/users/Users"));
const PreRegisterUsersView = lazy(() =>
  import("@pages/app/pre-register-users/PreRegisterUsers")
);
const SingleUserView = lazy(() =>
  import("@pages/app/users/single/SingleUser")
);
const OnboardingsView = lazy(() =>
  import("@pages/app/onboardings/Onboardings")
);
const NewProposalsView = lazy(() =>
  import("@pages/app/proposals/new-list/NewProposals")
);
const VADirectoryView = lazy(() => import("@pages/app/va-directory"));

// Admin, Voting Associate Only
const SingleVoteView = lazy(() =>
  import("@pages/app/votes/single/SingleVote")
);
const SingleInformalVoteView = lazy(() =>
  import("@pages/app/votes/single/SingleInformalVote")
);
const SingleMiletoneVoteView = lazy(() =>
  import("@pages/app/votes/single/SingleMilestoneVote")
);

// Voting Associate, Associate Only
const NewProposalView = lazy(() =>
  import("@pages/app/proposals/new/NewProposal")
);
const ReputationView = lazy(() => import("@pages/app/reputation/Reputation"));

// Voting Associate Only
const NewSimpleProposalView = lazy(() =>
  import("@pages/app/proposals/new-simple/NewSimpleProposal")
);

// Voting Associate Only
const NewAdminGrantProposalView = lazy(() =>
  import("@pages/app/proposals/new-admin-grant/NewAdminGrantProposal")
);

// Voting Associate Only
// const NewAdvancePaymentRequestView = lazy(() =>
//   import(
//     "@pages/app/proposals/new-advance-payment-request/NewAdvancePaymentRequest"
//   )
// );

export default function AuthAppRoutes() {
  const dispatch = useDispatch();
  const handleOnAction = () => {};

  const handleOnActive = () => {};

  const handleOnIdle = (event) => {
    console.log("user is idle", event);
    dispatch(setActiveModal("session-timeout"));
  };

  return (
    <IdleTimer
      timeout={1000 * 60 * 119}
      onActive={handleOnActive}
      onIdle={handleOnIdle}
      onAction={handleOnAction}
      debounce={250}
    >
      <Suspense fallback={null}>
        <Switch>
          <Route path="/app" component={MainView} exact />
          <Route path="/app/votes" component={VotesView} exact />
          <Route
            path="/app/pre-register"
            component={PreRegisterUsersView}
            exact
          />
          <Route path="/app/users" component={UsersView} exact />
          <Route path="/app/user/:userId" component={SingleUserView} exact />
          <Route path="/app/proposals" component={ProposalsView} exact />
          <Route path="/app/new-proposals" component={NewProposalsView} exact />
          <Route path="/app/all-proposals" component={AllProposalsView} exact />
          <Route path="/app/grants" component={GrantsView} exact />
          <Route path="/app/milestones" component={MilestonesView} exact />
          <Route
            path="/app/milestones/:id/logs"
            component={MilestoneLogView}
            exact
          />
          <Route
            path="/app/milestones/:id/review"
            component={MilestoneReviewView}
            exact
          />
          <Route path="/app/proposal/new" component={NewProposalView} exact />
          <Route
            path="/app/simple-proposal/new"
            component={NewSimpleProposalView}
            exact
          />
          <Route
            path="/app/admin-grant-proposal/new"
            component={NewAdminGrantProposalView}
            exact
          />
          {/* <Route
            path="/app/advance-payment-request/new"
            component={NewAdvancePaymentRequestView}
            exact
          /> */}
          <Route
            path="/app/proposal/:proposalId/formal-vote"
            component={SingleVoteView}
            exact
          />
          <Route
            path="/app/proposal/:proposalId/informal-vote"
            component={SingleInformalVoteView}
            exact
          />
          <Route
            path="/app/proposal/:proposalId/milestone-vote/:voteId"
            component={SingleMiletoneVoteView}
            exact
          />
          <Route
            path="/app/proposal/:proposalId"
            component={SingleProposalView}
            exact
          />
          <Route
            path="/app/proposal/:proposalId/change/:proposalChangeId"
            component={SingleChangeView}
            exact
          />
          <Route
            path="/app/proposal/:proposalId/edit"
            component={EditProposalView}
            exact
          />
          <Route
            path="/app/simple-proposal/:proposalId/edit"
            component={EditSimpleProposalView}
            exact
          />
          <Route path="/app/discussions" component={DiscussionsView} exact />
          <Route path="/app/topics" component={TopicsView} exact />
          <Route path="/app/topics/create" component={CreateTopicView} exact />
          <Route
            path="/app/topics/:topic/edit"
            component={EditTopicView}
            exact
          />
          <Route path="/app/topics/:topic" component={TopicDetailView} exact />
          <Route path="/app/surveys" component={SurveysView} exact />
          <Route path="/app/user-surveys" component={UserSurveysView} exact />
          <Route path="/app/surveys/start" component={StartSurveyView} exact />
          <Route
            path="/app/user-surveys/:id"
            component={SubmitSurveyView}
            exact
          />
          <Route path="/app/surveys/:id" component={SurveyDetailView} exact />
          <Route
            path="/app/surveys/:id/full-page"
            component={SurveyDetailFullPageView}
            exact
          />
          <Route path="/app/reputation" component={ReputationView} exact />
          <Route path="/app/to-formal" component={OnboardingsView} exact />
          <Route path="/app/settings" component={SettingsView} exact />
          <Route path="/app/scheme" component={SchemeView} exact />
          <Route
            path="/app/global-settings"
            component={GlobalSettingsView}
            exact
          />
          <Route path="/app/accounting" component={AccountingView} exact />
          <Route path="/app/va-directory" component={VADirectoryView} exact />
          <Route path="/app/admin-team" component={AdminTeamView} exact />
          <Route path="/app/emailer" component={EmailerView} exact />
          <Route path="/app/report" component={ReportView} exact />
          <Route component={AuthAppErrorView} />
        </Switch>
      </Suspense>
    </IdleTimer>
  );
}
