import moment from "moment";
import React, { useEffect } from "react";
import Helper from "utils/Helper";
import { getAllPublicMilestonesShared } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";

const PublicMilestonesTable = ({ outParams }) => {
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
      getAllPublicMilestonesShared(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res?.milestones || []);
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


  const renderVoteResult = (item) => {
    const vote = item.votes[item.votes.length - 1];
    if (vote && vote.status === "completed") {
      if (vote.result_count && vote.result == "success")
        return (
          <label className="font-size-14 color-success d-block">Pass</label>
        );
      else if (vote.result == "no-quorum")
        return (
          <label className="font-size-14 color-danger d-block">No Quorum</label>
        );
      return <label className="font-size-14 color-danger d-block">Fail</label>;
    }
    return null;
  }

  const renderMilestoneIndex = (item) => {
    const idx = item.milestones.findIndex((x) => x.id === item.id);
    return idx + 1;
  }

  const clickRow = (item) => {
    history.push(`/public-milestones/${item.id}`);
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
          <p>Milestone number</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.title">
          <p>Status</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>OP email</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Prop #</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.type">
          <p>Proposal title</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Milestone</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.changes">
          <p>Euro value</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.comments">
          <p>Due date</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.created_at">
          <p>Submitted date</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.created_at">
          <p>Vote result</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.created_at">
          <p>Paid?</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.created_at">
          <p>Paid Date</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((row, ind) => (
          <Table.BodyRow key={ind} selectRowHandler={() => clickRow(row)}>
            <Table.BodyCell>
              {row.proposal_id}-{renderMilestoneIndex(row)}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.submitted_time ? "Submitted" : "Not submitted"}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.email}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.proposal_id}
            </Table.BodyCell>
            <Table.BodyCell className="capitalize">
              {row.proposal_title}
            </Table.BodyCell>
            <Table.BodyCell>
              {this.renderMilestoneIndex(row)}/{row.milestones.length}
            </Table.BodyCell>
            <Table.BodyCell>
              {Helper.formatPriceNumber(row.grant || "", "€")}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.deadline
                  ? moment(row.deadline).local().format("M/D/YYYY")
                  : ""}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.submitted_time
                    ? moment(row.submitted_time).local().format("M/D/YYYY")
                  : ""}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderVoteResult(row)}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.paid ? "Yes" : "No"}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.paid_time
                  ? moment(row.paid_time).local().format("M/D/YYYY")
                  : ""}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
}

export default PublicMilestonesTable;