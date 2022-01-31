import moment from "moment";
import React, { useEffect } from "react";
import Helper from "@utils/Helper";
import { getCompletedVotes } from "@utils/Thunk";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Table, useTable, Button } from '@shared/partials';
import styles from "./style.module.scss";
import { Tooltip } from "@mui/material";
import { BALLOT_TYPES } from "@utils/enum";
import {
  setCustomModalData,
  setActiveModal,
} from "@redux/actions";
import classNames from "classnames";
const CompletedVotes = ({ outParams, authUser }) => {
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
  const history = useHistory();
  const fetchData = (pageValue = page, paramsValue = params) => {
    const params = {
      ...paramsValue,
      page_id: pageValue,
    };
    dispatch(
      getCompletedVotes(
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
  }, [outParams]);

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

  const renderStake = (vote) => {
    if (vote.result_count && vote.result == "success") {
      return (
        <>
          <label className="text-success">{vote.for_value}</label>
          &nbsp;{"/"}&nbsp;
          <label className="">{vote.against_value}</label>
        </>
      );
    }

    return (
      <>
        <label className="">{vote.for_value}</label>
        &nbsp;{"/"}&nbsp;
        <label className="text-danger">
          {vote.against_value}
        </label>
      </>
    );
  }


  const renderQuorum = (vote) => {
    if (vote.result == "no-quorum") {
      let showButton = false;
      if (authUser.is_admin || authUser.id == vote.user_id) showButton = true;

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="font-size-14 color-danger text-nowrap">
            <label>{vote.result_count}</label> /{" "}
            <label>{authUser.totalMembers}</label>
          </div>
          {showButton ? (
            <Button size="sm"
              style={{ marginLeft: "10px" }}
              onClick={() => this.clickRevote(vote)}
            >
              Revote
            </Button>
          ) : null}
        </div>
      );
    }
    return (
      <div className="font-size-14 color-success">
        <label>{vote.result_count}</label> /{" "}
        <label>{authUser.totalMembers}</label>
      </div>
    );
  }

  const renderResult = (vote) => {
    if (vote.result_count && vote.result == "success")
      return <label className="text-success">Pass</label>;
    else if (vote.result == "no-quorum")
      return (
        <label className="text-danger">No Quorum</label>
      );
    return <label className="text-danger">Fail</label>;
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
        <Table.HeaderCell sortKey="vote.type">
          <p>Type</p>
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
        <Table.HeaderCell>
          <p>Result</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Stake For/Against</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Quorum</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="vote.updated_at">
          <p>Completed Date</p>
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
            <Table.BodyCell>
              {vote.type == "informal" ? "Informal" : "Formal"}
            </Table.BodyCell>
            <Table.BodyCell className="flex gap-2">
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
              {renderResult(vote)}
            </Table.BodyCell>
            <Table.BodyCell className="flex gap-2 flex-wrap">
              {renderStake(vote)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderQuorum(vote)}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(vote.updated_at).local().format("M/D/YYYY")}{" "}
              {moment(vote.updated_at).local().format("h:mm A")}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
}

export default CompletedVotes;