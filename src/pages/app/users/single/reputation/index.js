import moment from "moment";
import React, { useEffect } from "react";
import { getReputationByUser } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS, DECIMALS } from "utils/Constant";

const ReputationTable = React.forwardRef(({ outParams, userId }, ref) => {
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
      getReputationByUser(
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

  const renderValue = (item) => {
    const value = parseFloat(item.value);

    if (value > 0)
      return (
        <label className="font-size-14 text-success">
          +{value?.toFixed(DECIMALS)}
        </label>
      );
    else if (value < 0)
      return (
        <label className="font-size-14 text-danger">
          {value?.toFixed(DECIMALS)}
        </label>
      );
    return "";
  }

  const renderStaked = (item) => {
    const value = parseFloat(item.staked);

    if (value > 0)
      return (
        <label className="font-size-14 text-success">
          +{value?.toFixed(DECIMALS)}
        </label>
      );
    else if (value < 0)
      return (
        <label className="font-size-14 text-danger">
          {value?.toFixed(DECIMALS)}
        </label>
      );
    return "";
  }

  const renderPending = (item) => {
    const value = parseFloat(item.pending);

    if (value > 0)
      return (
        <label className="font-size-14 text-success">
          +{value?.toFixed(DECIMALS)}
        </label>
      );
    else if (value < 0)
      return (
        <label className="font-size-14 text-danger">
          {value?.toFixed(DECIMALS)}
        </label>
      );
    return "";
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
          <p>Event</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Transaction Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Earned/Returned/Lost</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Staked</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Pending</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Date</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow className="py-4" key={ind}>
            <Table.BodyCell>
              {item.event}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.proposal_title}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.type}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderValue(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderStaked(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderPending(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(item.updated_at).local().format("M/D/YYYY")}{" "}
              {moment(item.updated_at).local().format("h:mm A")}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default ReputationTable;