import moment from "moment";
import React, { useEffect } from "react";
import { getProposalsByUser } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "utils/Constant";
import { useHistory } from "react-router";
import Helper from "utils/Helper";
import { PROPOSAL_TYPES } from "utils/enum";

const OPProposals = React.forwardRef(({ outParams, userId }, ref) => {
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
  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getProposalsByUser(
        userId,
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.proposals);
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

  const handleSort = async (key, direction) => {
    const newParams = {
      sort_key: key,
      sort_direction: direction,
    };
    setParams(newParams);
    resetData();
    fetchData(1, newParams);
  };

  const clickRow = (item) => {
    history.push(`/app/proposal/${item.id}`);
  }

  const renderStatusLabel = (text, type) => {
    return <label className={`text-${type}`}>{text}</label>;
  }

  // Render Status
  const renderStatus = (item) => {
    const { dos_paid } = item;
    if (item.status == "payment") {
      if (dos_paid) return renderStatusLabel("Payment Clearing", "info");
      else return renderStatusLabel("Payment Waiting", "info");
    } else if (item.status == "pending")
      return renderStatusLabel("Pending", "primary");
    else if (item.status == "denied")
      return renderStatusLabel("Denied", "danger");
    else if (item.status == "completed")
      return renderStatusLabel("Completed", "");
    else if (item.status == "approved") {
      if (item.votes && item.votes.length) {
        if (item.votes.length > 1) {
          // Formal Vote
          const formalVote = item.votes[1];
          if (formalVote.status == "active") {
            return renderStatusLabel(
              <>
                Formal Voting
                <br />
                Live
              </>,
              "success"
            );
          } else {
            // Formal Vote Result
            if (formalVote.result == "success") {
              return renderStatusLabel(
                <>
                  Formal Voting
                  <br />
                  Passed
                </>,
                "success"
              );
            } else if (formalVote.result == "no-quorum") {
              return renderStatusLabel(
                <>
                  Formal Voting
                  <br />
                  No Quorum
                </>,
                "danger"
              );
            } else {
              return renderStatusLabel(
                <>
                  Formal Voting
                  <br />
                  Failed
                </>,
                "danger"
              );
            }
          }
        } else {
          // Informal Vote
          const informalVote = item.votes[0];
          if (informalVote.status == "active")
            return renderStatusLabel(
              <>
                Informal Voting
                <br />
                Live
              </>,
              "success"
            );
          else {
            // Informal Vote Result
            if (informalVote.result == "success") {
              return renderStatusLabel(
                <>
                  Informal Voting
                  <br />
                  Passed
                </>,
                "success"
              );
            } else if (informalVote.result == "no-quorum") {
              return renderStatusLabel(
                <>
                  Informal Voting
                  <br />
                  No Quorum
                </>,
                "danger"
              );
            } else {
              return renderStatusLabel(
                <>
                  Informal Voting
                  <br />
                  Failed
                </>,
                "danger"
              );
            }
          }
        }
      } else return renderStatusLabel("In Discussion", "success");
    }
    return null;
  }

  const renderInformalResult = (item) => {
    const { votes } = item;
    if (!votes || !votes.length) return null;

    const informalVote = votes[0];
    if (informalVote.status == "completed") {
      if (informalVote.result == "success")
        return renderStatusLabel("Passed", "success");
      else if (informalVote.result == "no-quorum")
        return renderStatusLabel("No Quorum", "danger");
      return renderStatusLabel("Failed", "danger");
    }
    return null;
  }

  const renderFormalResult = (item) => {
    const { votes } = item;
    if (!votes || !votes.length || votes.length < 2) return null;

    const formalVote = votes[1];
    if (formalVote.status == "completed") {
      if (formalVote.result == "success")
        return renderStatusLabel("Passed", "success");
      else if (formalVote.result == "no-quorum")
        return renderStatusLabel("No Quorum", "danger");
      return renderStatusLabel("Failed", "danger");
    }
    return null;
  }

  return (
    <Table
      {...register}
      styles={styles}
      className="h-full"
      onLoadMore={fetchData}
      hasMore={hasMore}
      dataLength={data.length}
      onSort={handleSort}
    >
      <Table.Header>
        <Table.HeaderCell>
          <p>#</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.title">
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.type">
          <p>Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Status</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Informal Result</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Formal Result</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.created_at">
          <p>Date</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow className="py-4" key={ind} selectRowHandler={() => clickRow(item)}>
            <Table.BodyCell>
              {item.id}
            </Table.BodyCell>
            <Table.BodyCell>
              <p className="font-bold pb-2">
                {item.title}
              </p>
              <p className="text-xs">
                {Helper.getExcerpt(item.short_description || item.member_reason)}
              </p>
            </Table.BodyCell>
            <Table.BodyCell>
              {PROPOSAL_TYPES[item.type]}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderStatus(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderInformalResult(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderFormalResult(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(item.created_at).local().format("M/D/YYYY")}{" "}
              {moment(item.created_at).local().format("h:mm A")}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default OPProposals;