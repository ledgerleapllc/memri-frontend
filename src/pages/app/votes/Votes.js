import ActiveInformalVotesView from "../shared/active-informal-votes";
import ActiveFormalVotesView from "../shared/active-formal-votes";
import CompletedVotesView from "../shared/completed-votes";
import React, { Component, useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { Tab, Card, CardHeader, CardBody } from '@shared/partials';
import { useDelayInput } from '@shared/hooks/useDelayInput';
import { Tooltip } from "@mui/material";
import * as Icon from "react-feather";
import { saveUser } from "@redux/actions";
import {
  saveUnvotedInformal,
} from "@utils/Thunk";
import {
  UnvotedFilter,
} from "@shared/components";
const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

const CardActiveInformalVotes = () => {
  const { params, setSearchTerm, setParams } = useDelayInput({
    sort_key: 'timeLeft',
    sort_direction: 'asc',
  });
  const [showTable, setShowTable] = useState();
  const authUser = useSelector(state => state.global.authUser);
  const [totalUnvoted, setTotalUnvoted] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      setParams({...params, show_unvoted: Number(authUser.show_unvoted_informal)});
      setShowTable(true);
    }
  }, [authUser])

  const getUnvoted = (val) => {
    setParams({...params, show_unvoted: Number(val)})
    dispatch(saveUnvotedInformal({ check: Number(val) }));
    authUser.show_unvoted_informal = Number(val);
    dispatch(saveUser({ ...authUser }));
  }

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            Active Informal Votes
            <Tooltip title="This area displays informal votes currently in progress. If you are a Voting Associate, you should review and vote." placement="right-end">
              <Icon.Info size={16} />
            </Tooltip>
          </h3>
          {!authUser.is_admin && (
            <div className="app-tooltip-wrap">
              <UnvotedFilter
                votes={totalUnvoted}
                show_unvoted={params?.show_unvoted}
                onChange={(val) => getUnvoted(val)}
              />
            </div>
          )}
          <input
            className="text-xs"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody>
        {showTable && <ActiveInformalVotesView outParams={params} authUser={authUser} getValue={setTotalUnvoted} />}
      </CardBody>
    </Card>
  )
}

const CardActiveFormalVotes = () => {
  const { params, setSearchTerm, setParams } = useDelayInput({
    sort_key: 'timeLeft',
    sort_direction: 'asc',
  });
  const [showTable, setShowTable] = useState();
  const authUser = useSelector(state => state.global.authUser);
  const [totalUnvoted, setTotalUnvoted] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      setParams({...params, show_unvoted: Number(authUser.show_unvoted_informal)});
      setShowTable(true);
    }
  }, [authUser])

  const getUnvoted = (val) => {
    setParams({...params, show_unvoted: Number(val)})
    dispatch(saveUnvotedInformal({ check: Number(val) }));
    authUser.show_unvoted_formal = Number(val);
    dispatch(saveUser({ ...authUser }));
  }

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            Active Formal Votes
            <Tooltip title="This area displays informal votes currently in progress. If you are a Voting Associate, you should review and vote." placement="right-end">
              <Icon.Info size={16} />
            </Tooltip>
          </h3>
          {!authUser.is_admin && (
            <div className="app-tooltip-wrap">
              <UnvotedFilter
                votes={totalUnvoted}
                show_unvoted={params?.show_unvoted}
                onChange={(val) => getUnvoted(val)}
              />
            </div>
          )}
          <input
            className="text-xs"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody>
        {showTable && <ActiveFormalVotesView outParams={params} authUser={authUser} getValue={setTotalUnvoted} />}
      </CardBody>
    </Card>
  )
}

const Tab1 = () => {
  return (
    <div className="flex flex-col h-full gap-4">
      <CardActiveInformalVotes />
      <CardActiveFormalVotes />
    </div>
  )
}

const Tab2 = () => {
  const { params, setSearchTerm } = useDelayInput();
  const authUser = useSelector(state => state.global.authUser);

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg flex-center gap-2">
            Completed Votes
            <Tooltip title={'This area displays the votes that have already completed in the system.'} placement="right-end">
              <Icon.Info size={16} />
            </Tooltip>
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
        <CompletedVotesView outParams={params} authUser={authUser} />
      </CardBody>
    </Card>
  )
}

const tabsData = [
  {
    content: Tab1,
    id: 'active',
    title: 'Active',
  },
  {
    content: Tab2,
    id: 'completed',
    title: 'Completed',
  },
];
class Votes extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <Tab tabs={tabsData} />
    );
  }
}

export default connect(mapStateToProps)(withRouter(Votes));
