import moment from "moment";
import React, { useEffect } from "react";
import { getUserSurveys } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable, Button } from 'shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "utils/Constant";
import { Link } from "react-router-dom";
import { useHistory } from 'react-router';
import { setActiveModal } from "redux/actions";

const defaultOutParams = {status: 'active', type: 'rfp'};

const ActiveRFPSurveysTable = React.forwardRef((
  { 
    outParams = defaultOutParams, 
    authUser 
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

    // const doCancel = (id) => {
    //   dispatch(setActiveModal("cancel-active-survey", { id }));
    // };

    const showAnswer = (survey) => {
      dispatch(
        setActiveModal("show-survey-voter-answer", {
          surveyId: survey.id,
          user: authUser,
          surveyData: survey,
        })
      );
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
            <p>Survey #</p>
          </Table.HeaderCell>
          <Table.HeaderCell sortKey="email">
            <p>Status</p>
          </Table.HeaderCell>
          <Table.HeaderCell sortKey="total_vote_percent">
            <p>RFP title</p>
          </Table.HeaderCell>
          <Table.HeaderCell sortKey="last_month_vote_percent">
            <p>Bids</p>
          </Table.HeaderCell>
          <Table.HeaderCell sortKey="this_month_vote_percent">
            <p>Start time</p>
          </Table.HeaderCell>
          <Table.HeaderCell sortKey="this_month_vote_percent">
            <p>Hour Left</p>
          </Table.HeaderCell>
        </Table.Header>
        <Table.Body className="padding-tracker">
          {data.map((item, ind) => (
            <Table.BodyRow className="py-4" key={ind}>
              <Table.BodyCell>
                <Link to={`/app/user-surveys/${item.id}`}>
                  <p>RFP{item.id}</p>
                </Link>
              </Table.BodyCell>
              <Table.BodyCell>
                {item.survey_rfp_results.findIndex(
                  (x) => +x.user_id === +authUser?.id
                ) < 0 ? (
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => gotoSurveyDetail(item)}
                  >
                    Start Survey
                  </Button>
                ) : (
                  <>
                    <p className="pb-2 text-success">Completed</p>
                    <Button
                      size="sm"
                      variant="text"
                      className="underline"
                      onClick={() => showAnswer(item)}
                    >
                      review choices
                    </Button>
                  </>
                )}
              </Table.BodyCell>
              <Table.BodyCell>
                {item.job_title}
              </Table.BodyCell>
              <Table.BodyCell>
                {item.survey_rfp_bids?.length || 0}
              </Table.BodyCell>
              <Table.BodyCell>
                {moment(item.created_at).local().format("M/D/YYYY HH:mm A")}
              </Table.BodyCell>
              <Table.BodyCell>
                {item.hours_left}
              </Table.BodyCell>
            </Table.BodyRow>
          ))}
        </Table.Body>
      </Table>
    )
});

export default ActiveRFPSurveysTable;