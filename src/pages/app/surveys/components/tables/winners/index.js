import moment from "moment";
import React, { useEffect } from "react";
import { getWinners } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { LIMIT_API_RECORDS } from "utils/Constant";
import { Tooltip } from "@mui/material";

const WinnersTable = React.forwardRef(({ outParams }, ref) => {
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
      status: "active",
      page_id: pageValue,
    };

    dispatch(
      getWinners(
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
        <Table.HeaderCell >
          <p>Survey End</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Survey #</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Spot #</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Proposal #</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Current Status</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow className="py-4" key={ind}>
            <Table.BodyCell>
              <p>{moment(item.end_time).local().format("M/D/YYYY")}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p>S{item.survey_id}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{item.rank}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <Link to={`/app/proposal/${item.id}`}>
                <p>{item.id}</p>
              </Link>
            </Table.BodyCell>
            <Table.BodyCell>
              <Tooltip title={item.title} placement="left">
                <Link to={`/app/proposal/${item.id}`}>
                  <p>S{item.title}</p>
                </Link>
              </Tooltip>
            </Table.BodyCell>
            <Table.BodyCell>
              <p
                className={
                  item.status.label === "In Discussion"
                    ? "text-danger"
                    : "text-success"
                }
              >
                {item.status.label}
              </p>
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default WinnersTable;