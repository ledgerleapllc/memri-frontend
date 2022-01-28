import moment from "moment";
import React, { useEffect } from "react";
import Helper from "@utils/Helper";
import { getCompletedProposalsShared } from "@utils/Thunk";
import { PROPOSAL_TYPES } from "@utils/enum";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Table, useTable } from '@shared/partials';
import styles from "./style.module.scss";

const CompletedProposals = ({ outParams }) => {
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
      getCompletedProposalsShared(
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
        <Table.HeaderCell>
          <p>Forum Name</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.type">
          <p>Type</p>
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
            <Table.BodyCell className="capitalize">
              {PROPOSAL_TYPES[row.type]}
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

export default CompletedProposals;