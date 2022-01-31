import moment from "moment";
import React, { useEffect } from "react";
import { getVADirectory } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { DECIMALS, LIMIT_API_RECORDS } from "utils/Constant";

const VATables = React.forwardRef(({ outParams, getValue }, ref) => {
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

  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getVADirectory(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.users);
          setPage(prev => prev + 1);
          getValue(res.total_members);
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
        <Table.HeaderCell sortKey="first_name">
          <p>Name</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="email">
          <p>Email</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="total_vote_percent">
          <p>V% Total</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="last_month_vote_percent">
          <p>V% last month</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="this_month_vote_percent">
          <p>V% this month</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="total_rep">
          <p>Total Rep</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="member_at">
          <p>Date became VA</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow className="py-4" key={ind}>
            <Table.BodyCell>
              {item.first_name} {item.last_name}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.email}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.total_vote_percent?.toFixed?.(2)}%
            </Table.BodyCell>
            <Table.BodyCell>
              {item.last_month_vote_percent?.toFixed?.(2)}%
            </Table.BodyCell>
            <Table.BodyCell>
              {item.this_month_vote_percent?.toFixed?.(2)}%
            </Table.BodyCell>
            <Table.BodyCell>
              {item.total_rep?.toFixed?.(DECIMALS)}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(item.member_at).local().format("M/D/YYYY")}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default VATables;