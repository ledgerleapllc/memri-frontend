import { useHistory } from 'react-router';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Helper from "utils/Helper";
import { getActiveDiscussions } from "utils/Thunk";
import { Card, CardHeader, CardBody } from 'shared/partials';
import { TimeClock } from "shared/components/time-clock/TimeClock";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { useDelayInput } from 'shared/hooks/useDelayInput';
import moment from "moment";

export const ProposalsTable = ({ outParams, user }) => {
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
        <Table.HeaderCell sortKey="proposal.changes">
          <p>Changes</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.comments">
          <p>Comments</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.created_at">
          <p>Started</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Time Active</p>
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
                {Helper.getExcerpt(row.short_description)}
              </p>
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
            <Table.BodyCell>
              <TimeClock lastTime={moment(row.created_at)} isCountUp />
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
}

const Proposals = () => {
  const { params, setSearchTerm } = useDelayInput();
  
  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3>Active Discussions</h3>
          <input
            className="text-xs"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody>
        <ProposalsTable outParams={params} />
      </CardBody>
    </Card>
  )
}

export default Proposals;
