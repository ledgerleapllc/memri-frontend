import moment from "moment";
import React, { useEffect } from "react";
import { getUserSurveys } from "@utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable, Button } from '@shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "@utils/Constant";
import { Link } from "react-router-dom";
import { useHistory } from 'react-router';

const defaultOutParams = {status: 'completed', type: 'grant'};

const CompletedSurveysTable = React.forwardRef((
  { 
    outParams = defaultOutParams, 
  }, 
  ref) => {
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

    const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
      const params = {
        limit,
        ...paramsValue,
        page_id: pageValue,
      };

      dispatch(
        getUserSurveys(
          params,
          () => {},
          (res) => {
            setHasMore(!res.finished);
            appendData(res.surveys || []);
            setPage(prev => prev + 1);
          }
        )
      );
    }

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

    const gotoSurveyDetail = (item) => {
      history.push(`/app/user-surveys/${item.id}`);
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
          <Table.HeaderCell sortKey="first_name">
            <p>Survey #</p>
          </Table.HeaderCell>
          <Table.HeaderCell sortKey="email">
            <p>Results</p>
          </Table.HeaderCell>
          <Table.HeaderCell sortKey="total_vote_percent">
            <p>Start date and time</p>
          </Table.HeaderCell>
          <Table.HeaderCell sortKey="last_month_vote_percent">
            <p>End date and time</p>
          </Table.HeaderCell>
          <Table.HeaderCell sortKey="this_month_vote_percent">
            <p>Participation</p>
          </Table.HeaderCell>
        </Table.Header>
        <Table.Body className="padding-tracker">
          {data.map((item, ind) => (
            <Table.BodyRow className="py-4" key={ind}>
              <Table.BodyCell>
                <Link to={`/app/user-surveys/${item.id}`}>
                  <p>S{item.id}</p>
                </Link>
              </Table.BodyCell>
              <Table.BodyCell>
                <Button
                  size="sm"
                  onClick={() => gotoSurveyDetail(item)}
                >
                  View
                </Button>
              </Table.BodyCell>
              <Table.BodyCell>
                {moment(item.created_at).local().format("M/D/YYYY HH:mm A")}
              </Table.BodyCell>
              <Table.BodyCell>
                {moment(item.end_time).local().format("M/D/YYYY HH:mm A")}
              </Table.BodyCell>
              <Table.BodyCell>
                {item.user_responded}
              </Table.BodyCell>
            </Table.BodyRow>
          ))}
        </Table.Body>
      </Table>
    )
});

export default CompletedSurveysTable;