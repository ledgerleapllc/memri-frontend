import moment from "moment";
import React, { useEffect } from "react";
import Helper from "utils/Helper";
import { getActiveProposalsShared } from "utils/Thunk";
import { PROPOSAL_TYPES } from "utils/enum";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Table, useTable, Button } from 'shared/partials';
import styles from "./style.module.scss";
import {
  setActiveModal,
  setCustomModalData,
  setDOSPaymentData,
  setEditProposalData,
} from "redux/actions";

const ActiveProposals = ({ outParams }) => {
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
  const authUser = useSelector(state => state.global.authUser);
  const history = useHistory();

  const fetchData = (pageValue = page, paramsValue = params) => {
    const params = {
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getActiveProposalsShared(
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

  const clickRow = (item) => {
    history.push(`/app/proposal/${item.id}`);
  }

  const renderStatusLabel = (text, type) => {
    return <label className={`text-${type}`}>{text}</label>;
  }

  const clickPayDOS = (e, item) => {
    e.preventDefault();
    dispatch(setDOSPaymentData(item));
    dispatch(setActiveModal("dos-payment"));
  }

  const clickWithdraw = (e, item) => {
    e.preventDefault();
    dispatch(
      setCustomModalData({
        "confirm-withdraw": {
          render: true,
          title: "Are you sure you want to withdraw this proposal?",
          data: item,
        },
      })
    );
    dispatch(setActiveModal("custom-global-modal"));
  }

  const clickDenied = (e, proposal) => {
    e.preventDefault();
    dispatch(setEditProposalData(proposal));
    dispatch(setActiveModal("edit-deny"));
  }

  const renderStatus = (item) => {
    const { dos_paid } = item;
    if (item.status == "payment") {
      if (authUser.is_admin) return null;

      if (dos_paid) {
        // Paid
        return renderStatusLabel("Payment Clearing", "info");
      } else {
        // Not Paid
        return (
          <>
            <Button
              color="success"
              size="sm"
              onClick={(e) => clickPayDOS(e, item)}
            >
              Pay DOS Fee
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={(e) => clickWithdraw(e, item)}
            >
              Withdraw
            </Button>
          </>
        );
      }
    } else if (item.status == "pending")
      return (
        <>
          {renderStatusLabel("Pending", "primary")}
          <div>
            <Button
              color="danger"
              size="sm"
              onClick={(e) => clickWithdraw(e, item)}
            >
              Withdraw
            </Button>
          </div>
        </>
      );
    else if (item.status == "denied") {
      if (authUser.is_admin) return null;

      return (
        <label
          className="text-danger"
          onClick={(e) => clickDenied(e, item)}
        >
          <u>Denied</u>
        </label>
      );
    } else if (item.status == "completed")
      return renderStatusLabel("Completed", "");
    else if (item.status == "approved") {
      if (item.votes && item.votes.length) {
        const lastVote = item.votes[item.votes.length - 1];
        const labelText =
          lastVote.type === "formal" ? "Formal Voting" : "Informal Voting";
        if (lastVote.status === "active") {
          return renderStatusLabel(
            <>
              {labelText}
              <br />
              Live
            </>,
            "success"
          );
        } else if (lastVote.result == "success") {
          return renderStatusLabel(
            <>
              {labelText}
              <br />
              Passed
            </>,
            "success"
          );
        } else if (lastVote.result == "no-quorum") {
          return renderStatusLabel(
            <>
              {labelText}
              <br />
              No Quorum
            </>,
            "danger"
          );
        } else {
          return renderStatusLabel(
            <>
              {labelText}
              <br />
              Failed
            </>,
            "danger"
          );
        }
      } else return renderStatusLabel("In Discussion", "success");
    }
    return null;
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
      className="h-full"
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
        <Table.HeaderCell sortKey="proposal.type">
          <p>Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Status</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.changes">
          <p>Changes</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.comments">
          <p>Comments</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.created_at">
          <p>Started</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((row, ind) => (
          <Table.BodyRow key={ind} selectRowHandler={() => clickRow(row)}>
            <Table.BodyCell>
              {row.id}
            </Table.BodyCell>
            <Table.BodyCell>
              <p className="font-bold pb-2">
                {row.title}
              </p>
              <p className="text-xs">
                {Helper.getExcerpt(row.short_description || row.member_reason)}
              </p>
            </Table.BodyCell>
            <Table.BodyCell className="capitalize">
              {PROPOSAL_TYPES[row.type]}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderStatus(row)}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.changes}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.comments}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(row.created_at).local().format("M/D/YYYY")}{" "}
              {moment(row.created_at).local().format("h:mm A")}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
}

export default ActiveProposals;