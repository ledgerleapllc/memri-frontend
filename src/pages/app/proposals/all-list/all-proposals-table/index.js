import moment from "moment";
import React, { useContext, useEffect, useImperativeHandle } from "react";
import Helper from "utils/Helper";
import { getAllProposalsShared, downloadCSVAllProposals } from "utils/Thunk";
import { PROPOSAL_TYPES } from "utils/enum";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { AppContext } from 'App';
import { LIMIT_API_RECORDS } from "utils/Constant";

const Proposals = React.forwardRef(({ outParams }, ref) => {
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
  const { setLoading } = useContext(AppContext);

  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getAllProposalsShared(
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

  useImperativeHandle(ref, () => ({
    downloadCSV: () => {
      dispatch(
        downloadCSVAllProposals(
          params,
          () => {
            setLoading(true);
          },
          (res) => {
            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "all-proposals.csv");
            document.body.appendChild(link);
            link.click();
            setLoading(false);
          }
        )
      );
    }
  }), [params]);

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
    if (authUser.is_admin || authUser.is_member)
      history.push(`/app/proposal/${item.id}`);
    else if (authUser.is_participant) {
      if (item.user_id == authUser.id) {
        // OP
        history.push(`/app/proposal/${item.id}`);
      } else {
        // Not OP & Not Vote
        if (!item.votes || !item.votes.length)
          history.push(`/app/proposal/${item.id}`);
      }
    }
  }

  const renderStatusLabel = (text, type) => {
    return <label className={`text-${type}`}>{text}</label>;
  }

  const renderStatus = (item) => {
    const { dos_paid } = item;
    if (item.status == "payment") {
      if (dos_paid) {
        // Paid
        return renderStatusLabel("Payment Clearing", "info");
      } else {
        // Not Paid
        return renderStatusLabel("Payment Waiting", "info");
      }
    } else if (item.status == "pending")
      return renderStatusLabel("Pending", "primary");
    else if (item.status == "denied") {
      return renderStatusLabel("Denied", "danger");
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

  const renderEuros = (item) => {
    const lastVote = item.votes[item.votes.length - 1];
    if (lastVote?.content_type === "simple") {
      return "";
    } else if (lastVote?.content_type === "grant") {
      return Helper.formatPriceNumber(item.total_grant || "", "€");
    } else if (lastVote?.content_type === "milestone") {
      return Helper.formatPriceNumber(lastVote.milestone_grant || "", "€");
    } else {
      return "";
    }
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
        <Table.HeaderCell sortKey="proposal.id">
          <p>#</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.title">
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Forum</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Telegram</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.type">
          <p>Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Euros</p>
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
            <Table.BodyCell>
              {row.forum_name}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.telegram}
            </Table.BodyCell>
            <Table.BodyCell className="capitalize">
              {PROPOSAL_TYPES[row.type]}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderEuros(row)}
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
});

export default Proposals;