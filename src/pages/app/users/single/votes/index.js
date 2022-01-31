import moment from "moment";
import React, { useEffect } from "react";
import { getVotesByUser } from "@utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable } from '@shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "@utils/Constant";

const UserVotesTable = React.forwardRef(({ outParams, userId }, ref) => {
  const {
    data,
    register,
    hasMore,
    appendData,
    setHasMore,
    setParams,
    page,
    params,
    resetData,
  } = useTable();
  const dispatch = useDispatch();
  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getVotesByUser(
        userId,
        params,
        () => {},
        (res) => {
          setHasMore(false);
          appendData(res.items);
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

  const renderDirection = (item) => {
    if (item.type == "for")
      return <label className="text-success">For</label>;
    return <label className="text-danger">Against</label>;
  }

  const renderStake = (item) => {
    if (item.value > 0)
      return <label className="text-success">{item.value}</label>;
    return <label className="text-danger">{item.value}</label>;
  }

  const renderResult = (item) => {
    const vote = item.vote;
    if (vote.status == "completed") {
      if (vote.result == "success")
        return <label className="text-success">Passed</label>;
      else if (vote.result == "no-quorum")
        return <label className="text-danger">No Quorum</label>;
      return <label className="text-danger">Failed</label>;
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
          <p>Proposal Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Direction</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Stake</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Result</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Date</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow className="py-4" key={ind}>
            <Table.BodyCell>
              {item.proposal.title}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.vote.type == "formal" ? "Formal" : "Informal"}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderDirection(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderStake(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderResult(item)}
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

export default UserVotesTable;