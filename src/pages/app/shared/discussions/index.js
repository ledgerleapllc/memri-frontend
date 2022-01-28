import moment from "moment";
import React, { useEffect } from "react";
import Helper from "@utils/Helper";
import { getActiveDiscussions, getCompletedDiscussions } from "@utils/Thunk";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Table, useTable } from '@shared/partials';
import styles from "./style.module.scss";
import * as Icon from "react-feather";
import { LIMIT_API_RECORDS } from "@utils/Constant";

const DiscussionsTable = ({ outParams, type }) => {
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
  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };
    if (type === 'active') {
      dispatch(
        getActiveDiscussions(
          params,
          () => {},
          (res) => {
            setHasMore(!res.finished);
            appendData(res.proposals);
            setPage(prev => prev + 1);
          }
        )
      );
    } else if (type === 'completed') {
      dispatch(
        getCompletedDiscussions(
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
    if (authUser && authUser.is_admin) history.push(`/app/proposal/${item.id}`);
    else {
      if (item.status != "approved") return;

      if (authUser.is_member) history.push(`/app/proposal/${item.id}`);
      else {
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

  const renderTimeClock = (item) => {
    let diff = moment().diff(moment(item.created_at));
    if (item.approved_at)
      diff = moment().diff(moment(item.approved_at + ".000Z"));

    const seconds = parseInt(diff / 1000);
    let mins = parseInt(seconds / 60);
    let hours = parseInt(mins / 60);
    mins -= 60 * hours;
    let days = parseInt(hours / 24);
    hours -= 24 * days;
    return `${days}D:${hours}H:${mins}MIN`;
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
          <p>Forums</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.approved_at">
          <p>Time Active</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.comments">
          <p>Comments</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.changes">
          <p>Changes</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.created_at">
          <p>Date</p>
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
            <Table.BodyCell className="flex gap-2">
              <Icon.Clock size={16} />
              <span>{renderTimeClock(row)}</span>
            </Table.BodyCell>
            <Table.BodyCell className="flex gap-2">
              <Icon.MessageCircle size={16} />
              <span>{row.comments}</span>
            </Table.BodyCell>
            <Table.BodyCell className="flex gap-2">
              <Icon.Monitor size={16} />
              <span>{row.changes}</span>
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

export default DiscussionsTable;