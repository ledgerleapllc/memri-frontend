import { useHistory } from 'react-router';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveInformalVotes } from "utils/Thunk";
import { BALLOT_TYPES } from "utils/enum";
import { setActiveModal, setCustomModalData } from "redux/actions";
import { Card, CardHeader, CardBody } from 'shared/partials';
import { TimeClock } from "shared/components/time-clock/TimeClock";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { useDelayInput } from 'shared/hooks/useDelayInput';
import moment from "moment";

export const InformalBallotsTable = ({ outParams, user }) => {
  const {
    data,
    register,
    hasMore,
    appendData,
    setHasMore,
    setPage,
    setParams,
    page,
    params,
    resetData,
  } = useTable();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.global.settings);
  const authUser = useSelector(state => state.global.authUser);
  const history = useHistory();

  const fetchData = (pageValue = page, paramsValue = params) => {
    const params = {
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getActiveInformalVotes(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.votes);
          setPage(prev => prev + 1);
        }
      )
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (outParams) {
      setParams(outParams);
      resetData();
      fetchData(1, outParams);
    }
  }, [outParams]);

  const renderTimeRemaining = (vote) => {
    let mins = 0;
    if (vote.content_type == "grant") {
      if (settings.time_unit_informal == "min")
        mins = parseInt(settings.time_informal);
      else if (settings.time_unit_informal == "hour")
        mins = parseInt(settings.time_informal) * 60;
      else if (settings.time_unit_informal == "day")
        mins = parseInt(settings.time_informal) * 24 * 60;
    } else if (
      ["simple", "admin-grant", "advance-payment"].includes(vote.content_type)
    ) {
      if (settings.time_unit_simple == "min")
        mins = parseInt(settings.time_simple);
      else if (settings.time_unit_simple == "hour")
        mins = parseInt(settings.time_simple) * 60;
      else if (settings.time_unit_simple == "day")
        mins = parseInt(settings.time_simple) * 24 * 60;
    } else if (vote.content_type == "milestone") {
      if (settings.time_unit_milestone == "min")
        mins = parseInt(settings.time_milestone);
      else if (settings.time_unit_milestone == "hour")
        mins = parseInt(settings.time_milestone) * 60;
      else if (settings.time_unit_milestone == "day")
        mins = parseInt(settings.time_milestone) * 24 * 60;
    }
    const lastTime = moment(vote.created_at).add(mins, "minutes");
    return <TimeClock lastTime={lastTime} />;
  }

  const clickRow = (vote) => {
    if (authUser.is_member || authUser.is_admin)
      history.push(`/app/proposal/${vote.proposal_id}`);
    else if (authUser.is_participant) {
      if (vote.user_id == authUser.id) {
        // OP
        history.push(`/app/proposal/${vote.proposal_id}`);
      } else {
        // Not OP
        dispatch(
          setCustomModalData({
            "voting-access-alert": {
              render: true,
              title: "Sorry, only voting associates may access a live vote.",
            },
          })
        );
        dispatch(setActiveModal("custom-global-modal"));
      }
    }
  }

  const handleSort = async (key, direction) => {
    const newParams = {
      sort_key: key,
      sort_direction: direction,
    };
    setParams(newParams);
    resetData();
    fetchData(1, newParams);
  };

  return (
    <Table
      {...register}
      styles={styles}
      className="active-assign-table h-full"
      onLoadMore={fetchData}
      hasMore={hasMore}
      dataLength={data.length}
      onSort={handleSort}
    >
      <Table.Header>
        <Table.HeaderCell sortKey="proposal.id">
          <p>#</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.title">
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="vote.content_type">
          <p>Ballot Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="vote.created_at">
          <p>Submitted</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Time Remaining</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((row, ind) => (
          <Table.BodyRow key={ind} selectRowHandler={() => clickRow(row)}>
            <Table.BodyCell>
              {row.proposalId}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.title}
            </Table.BodyCell>
            <Table.BodyCell className="capitalize">
              {BALLOT_TYPES[row.content_type]}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(row.created_at).fromNow()}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderTimeRemaining(row)}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
}

const InformalBallots = () => {
  const { params, setSearchTerm } = useDelayInput();
  
  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3>Active Informal Ballots</h3>
          <input
            className="text-xs"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody>
        <InformalBallotsTable outParams={params} />
      </CardBody>
    </Card>
  )
}

export default InformalBallots;
