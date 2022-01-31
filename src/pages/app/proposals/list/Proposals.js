import React, { Component } from "react";
import { connect, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import * as Icon from "react-feather";
import DosAlertView from "../../shared/dos-alert/DosAlert";
import GrantAlertView from "../../shared/grant-alert/GrantAlert";
import ProposalTracking from "../../shared/proposal-tracking/ProposalTracking";
import ActiveView from "./active";
import CompletedView from "./completed";
import {
  hideCanvas,
  setActiveModal,
  showCanvas,
} from "redux/actions";
import { getProposalDrafts } from "utils/Thunk";
import { Tab, Card, CardHeader, CardBody, Button } from 'shared/partials';
import { useDelayInput } from 'shared/hooks/useDelayInput';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};
const ProposalsView = ({ type }) => {
  const { params, setSearchTerm } = useDelayInput();
  const authUser = useSelector(state => state.global.authUser);

  return (
    <>
      {
        type === 'active' && (
          <div className="flex flex-col h-full gap-5">
            {!authUser.is_admin && (
              <>
                {authUser.grant_active && <GrantAlertView />}
                <DosAlertView />
                <ProposalTracking />
              </>
            )}
            <Card className="flex-1 min-h-0">
              <CardHeader>
                <div className="w-full flex justify-between">
                  <h3 className="font-bold text-lg">
                    {authUser.is_admin ? 'Active Proposals' : 'My Proposals'}
                  </h3>
                  <input
                    className="text-xs"
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardBody>
                <ActiveView outParams={params} type={type} />
              </CardBody>
            </Card>
          </div>
        )
      }
      {
        type === 'completed' && (
          <Card className="h-full flex-1 min-h-0">
            <CardHeader>
              <div className="w-full flex justify-between">
                <h3 className="font-bold text-lg">Completed Proposals</h3>
                <input
                  className="text-xs"
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardBody>
              <CompletedView outParams={params} type={type} />
            </CardBody>
          </Card>
        )
      }
    </>
  )
}

const tabsData = [
  {
    content: () => <ProposalsView type='active' />,
    id: 'active',
    title: 'Active',
  },
  {
    content: () => <ProposalsView type='completed' />,
    id: 'completed',
    title: 'Completed',
  },
];
class Proposals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "active",
    };
  }

  openDraftProposal = () => {
    this.props.dispatch(setActiveModal("draft-proposals"));
  };

  gotoNewGrant = () => {
    const { history } = this.props;
    history.push("/app/proposal/new");
  };

  createGrantProposal = () => {
    this.props.dispatch(
      getProposalDrafts(
        { limit: 1 },
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res.proposals?.length) {
            this.openDraftProposal();
          } else {
            this.gotoNewGrant();
          }
        }
      )
    );
  };

  renderButtons = () => {
    const { authUser } = this.props;
    if (!authUser.is_admin) {
      return (
        <div
          className="flex gap-5 mb-5 align-items-start"
        >
          <div className="flex flex-col gap-2 items-center flex-column">
            <Button
              className="h-14"
              color="secondary"
              onClick={() => this.createGrantProposal()}
            >
              <Icon.Plus />
              New Grant Proposal
            </Button>
            <Button
              className="border-b border-black"
              variant="text"
              onClick={() => this.openDraftProposal()}
            >
              Load a saved proposal
            </Button>
          </div>
          {authUser.is_member ? (
            <Button
              className="h-14"
              to="/app/simple-proposal/new"
              color="secondary"
            >
              <Icon.Plus />
              New Simple Proposal
            </Button>
          ) : null}
          {authUser.is_member ? (
            <Button
              className="h-14"
              to="/app/admin-grant-proposal/new"
              color="secondary"
            >
              <Icon.Plus />
              Admin Grant Proposal
            </Button>
          ) : null}
          {/* {authUser.is_member && authUser.grant_proposal ? (
            <Button
              to="/app/advance-payment-request/new"
              className="btn btn-primary-outline btn-fluid"
            >
              <Icon.Plus />
              Advance payment request
            </Button>
          ) : null} */}
        </div>
      );
    }
    return null;
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    if (!authUser.is_admin && !authUser.is_member && !authUser.is_participant)
      return null;

    return (
      <>
        {this.renderButtons()}
        <div className="flex-1 min-h-0">
          <Tab tabs={tabsData} />
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Proposals));
