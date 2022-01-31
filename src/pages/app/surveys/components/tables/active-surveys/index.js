import moment from "moment";
import React, { useEffect } from "react";
import { getSurveys } from "utils/Thunk";
import { useDispatch, useSelector } from "react-redux";
import { Table, useTable, Button } from 'shared/partials';
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { LIMIT_API_RECORDS } from "utils/Constant";
import {
  forceReloadActiveSurveyTable,
  setActiveModal,
} from "redux/actions";

const ActiveSurveysTable = React.forwardRef(({ outParams }, ref) => {
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
  const reloadActiveSurveyTable = useSelector(state => state.admin.reloadActiveSurveyTable);

  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      status: "active",
      page_id: pageValue,
    };

    dispatch(
      getSurveys(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.surveys);
          setPage(prev => prev + 1);
        }
      )
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (reloadActiveSurveyTable) {
      resetData();
      fetchData(1);
      dispatch(forceReloadActiveSurveyTable(false));
    }
  }, [reloadActiveSurveyTable]);

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

  const doCancel = (id) => {
    dispatch(setActiveModal("cancel-active-survey", { id }));
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
          <p>Survey Number</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Start date</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>End date</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>User Responded</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Users eligible</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Action</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow className="py-4" key={ind}>
            <Table.BodyCell>
              <Link to={`/app/surveys/${item.id}`}>
                <p>S{item.id}</p>
              </Link>
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(item.created_at).local().format("M/D/YYYY HH:mm A")}
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{moment(item.end_time).local().format("M/D/YYYY HH:mm A")}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{item.user_responded}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{item.total_member}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => doCancel(item.id)}
              >
                Cancel Survey
              </Button>
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default ActiveSurveysTable;