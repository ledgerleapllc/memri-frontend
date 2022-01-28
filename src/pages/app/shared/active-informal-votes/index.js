import moment from "moment";
import React, { useEffect } from "react";
import Helper from "@utils/Helper";
import { getActiveInformalVotes } from "@utils/Thunk";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Table, useTable, Button } from '@shared/partials';
import styles from "./style.module.scss";
import * as Icon from "react-feather";
import { Tooltip } from "@mui/material";
import { LIMIT_API_RECORDS } from "@utils/Constant";
import { BALLOT_TYPES } from "@utils/enum";
import {
  setCustomModalData,
  setActiveModal,
} from "@redux/actions";
import classNames from "classnames";
const ActiveInformalVotes = ({ outParams, authUser }) => {
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
  const history = useHistory();
  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
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
    if (outParams) {
      setParams(outParams);
      resetData();
      fetchData(1, outParams);
    }
  }, [outParams]);

  const clickRow = (vote) => {
    if (!authUser.is_guest) {
      if (vote.milestone_id) {
        history.push(
          `/app/proposal/${vote.proposal_id}?milestone_id=${vote.milestone_id}`
        );
      } else {
        history.push(`/app/proposal/${vote.proposal_id}`);
      }
    } else {
      dispatch(
        setCustomModalData({
          "voting-access-alert": {
            render: true,
            title: "Sorry, you can't access a live vote.",
          },
        })
      );
      dispatch(setActiveModal("custom-global-modal"));
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

  const renderMyVote = (vote) => {
    // OP
    if (authUser.id == vote.user_id)
      return <Button color="primary" size="sm">Not Eligible</Button>;

    if (!vote.vote_result_type)
      return <Button color="secondary" size="sm">None</Button>;
    else if (vote.vote_result_type == "for")
      return <Button color="success" size="sm">For</Button>;
    return <Button color="danger" size="sm">Against</Button>;
  }

  const renderRep = (vote) => {
    // OP
    if (authUser.id == vote.user_id)
      return <label className="d-block">-</label>;
    return (
      <label className="d-block">
        {vote.vote_result_value || 0}
      </label>
    );
  }

  const renderTime = (vote) => {
    let minsAdd = 0;
    if (vote.content_type == "grant") {
      if (settings.time_unit_informal && settings.time_informal) {
        if (settings.time_unit_informal == "min")
          minsAdd = parseInt(settings.time_informal);
        else if (settings.time_unit_informal == "hour")
          minsAdd = parseInt(settings.time_informal) * 60;
        else if (settings.time_unit_informal == "day")
          minsAdd = parseInt(settings.time_informal) * 24 * 60;
      }
    } else if (
      ["simple", "admin-grant", "advance-payment"].includes(vote.content_type)
    ) {
      if (settings.time_unit_simple && settings.time_simple) {
        if (settings.time_unit_simple == "min")
          minsAdd = parseInt(settings.time_simple);
        else if (settings.time_unit_simple == "hour")
          minsAdd = parseInt(settings.time_simple) * 60;
        else if (settings.time_unit_simple == "day")
          minsAdd = parseInt(settings.time_simple) * 24 * 60;
      }
    } else if (vote.content_type == "milestone") {
      if (settings.time_unit_milestone && settings.time_milestone) {
        if (settings.time_unit_milestone == "min")
          minsAdd = parseInt(settings.time_milestone);
        else if (settings.time_unit_milestone == "hour")
          minsAdd = parseInt(settings.time_milestone) * 60;
        else if (settings.time_unit_milestone == "day")
          minsAdd = parseInt(settings.time_milestone) * 24 * 60;
      }
    }

    /* Calculate Duration */
    let min = 0;
    let hours = 0;
    let day = 0;

    let diff = moment(vote.created_at)
      .add(minsAdd, "minutes")
      .diff(moment(), "minutes");
    if (diff > 0) {
      min = diff % 60;
      hours = parseInt(diff / 60);
      day = parseInt(hours / 24);
      hours = hours % 24;
    }
    return `${day}D:${hours}H:${min}MIN`;
  }

  const renderQuorum = (vote) => {
    let quorumRate = 0;
    if (
      ["simple", "admin-grant", "advance-payment"].includes(vote.content_type)
    ) {
      quorumRate = +settings.quorum_rate_simple;
    } else if (vote.content_type === "grant") {
      quorumRate = +settings.quorum_rate;
    } else if (vote.content_type === "milestone") {
      quorumRate = +settings.quorum_rate_milestone;
    }
    if (!quorumRate) return;
    const checkQuorumMet =
      +vote.result_count / +authUser.totalMembers >= +quorumRate / 100;

    return (
      <div className="flex gap-1">
        <label>{vote.result_count}</label> /{" "}
        <label className="pr-2">{authUser.totalMembers}</label>
        {checkQuorumMet ? <Icon.Check size="14" /> : <Icon.X size="14" />}
      </div>
    );
  }

  return (
    <Table
      {...register}
      styles={styles}
      className={classNames('h-full', authUser.is_member && styles.member)}
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
        <Table.HeaderCell>
          <p>Euros</p>
        </Table.HeaderCell>
        {authUser.is_member ? (
          <Table.HeaderCell sortKey="vote_result_type">
            <p>My Vote</p>
          </Table.HeaderCell>
        ) : <></>}
        {authUser.is_member ? (
          <Table.HeaderCell sortKey="vote_result_type">
            <p>Rep</p>
          </Table.HeaderCell>
        ) : <></>}
        <Table.HeaderCell sortKey="timeLeft">
          <p>Time Left</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Quorum</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="vote.created_at">
          <p>Submitted</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((vote, ind) => (
          <Table.BodyRow key={ind} selectRowHandler={() => clickRow(vote)}>
            <Table.BodyCell>
              {vote.proposalId}
            </Table.BodyCell>
            <Table.BodyCell>
              <Tooltip title={vote.title} placement="bottom">
                <label className="d-block">{vote.title}</label>
              </Tooltip>
            </Table.BodyCell>
            <Table.BodyCell className="flex gap-2 capitalize">
              {BALLOT_TYPES[vote.content_type]}
            </Table.BodyCell>
            <Table.BodyCell className="flex gap-2">
              {Helper.formatPriceNumber(vote.euros || "", "€")}
            </Table.BodyCell>
            {authUser.is_member ? (
              <Table.BodyCell className="flex gap-2">
                {renderMyVote(vote)}
              </Table.BodyCell>
            ) : <></>}
            {authUser.is_member ? (
              <Table.BodyCell className="flex gap-2">
                {renderRep(vote)}
              </Table.BodyCell>
            ) : <></>}
            <Table.BodyCell className="flex gap-2">
              <Icon.Clock size={14} />
              <p>{renderTime(vote)}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              {renderQuorum(vote)}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(vote.created_at).local().format("M/D/YYYY")}{" "}
              {moment(vote.created_at).local().format("h:mm A")}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
}

export default ActiveInformalVotes;