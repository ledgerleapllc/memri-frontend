import moment from "moment";
import React, { useEffect } from "react";
import { getRFPSurveys } from "utils/Thunk";
import { useDispatch, useSelector } from "react-redux";
import { Table, useTable, Button } from 'shared/partials';
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { LIMIT_API_RECORDS } from "utils/Constant";
import {
  forceReloadActiveSurveyTable,
} from "redux/actions";
import { useHistory } from "react-router";

const CompletedRFPSurveysTable = React.forwardRef(({ outParams }, ref) => {
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
  const history = useHistory();
  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      status: 'completed',
      page_id: pageValue,
    };

    dispatch(
      getRFPSurveys(
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

  const viewResults = (id) => {
    history.push(`/app/surveys/${id}`);
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
          <p>Survey #</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>RFP title</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Bids</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Start time</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Hours</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Responses</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Actions</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow className="py-4" key={ind}>
            <Table.BodyCell>
              <Link to={`/app/surveys/${item.id}`}>
                <p>RFP{item.id}</p>
              </Link>
            </Table.BodyCell>
            <Table.BodyCell>
              {item.job_title}
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{item.survey_rfp_bids?.length || 0}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(item.created_at).local().format("M/D/YYYY HH:mm A")}
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{item.time}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              {item.user_responded}
            </Table.BodyCell>
            <Table.BodyCell>
              <Button
                size="sm"
                onClick={() => viewResults(item.id)}
              >
                View Results
              </Button>
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default CompletedRFPSurveysTable;