import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MoveToFormalView from "../shared/move-to-formal";
import PendingGrantsView from "../shared/pending-grants";
import { useDelayInput } from '@shared/hooks/useDelayInput';
import { Card, CardHeader, CardBody, Checkbox } from '@shared/partials';
import "./onboardings.scss";

const MoveToFormalCard = () => {
  const { params, setSearchTerm } = useDelayInput();

  return (
    <Card className="mt-4 h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg">Simple and Milestone Submissions That Passed Informal Vote</h3>
          <input
            className="text-xs"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody>
        <MoveToFormalView outParams={params} />
      </CardBody>
    </Card>
  )
}

const PendingGrantsCard = () => {
  const { params, setSearchTerm, setParams } = useDelayInput();
  return (
    <Card className="mt-4 h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg">Grant Proposals That Passed Informal Vote</h3>
          <div className="flex gap-8">
            <Checkbox
              text="Hide denied"
              onChange={(e) => setParams({ ...params, hide_denied: +e })}
            />
            <input
              className="text-xs"
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-scroll">
        <PendingGrantsView outParams={params} />
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Onboardings extends Component {
  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id || !authUser.is_admin) return null;

    return (
      <div id="app-onboardings-page" className="flex flex-col">
        <div className="h-1/2 pb-4">
          <MoveToFormalCard />
        </div>
        <div className="h-1/2">
          <PendingGrantsCard />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Onboardings));
