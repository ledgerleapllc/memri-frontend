import moment from "moment";
import React, { useEffect } from "react";
import { getActiveDiscussions } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "utils/Constant";
import { Link } from "react-router-dom";
import { SwitchButton } from "shared/components";
import { Tooltip } from "@mui/material";
import classNames from "classnames";

const defaultOutParams = {status: 'active', type: 'grant'};

const DiscussionProposalsTable = React.forwardRef((
  { 
    outParams = defaultOutParams, 
    hideWonColumn,
    hideFilterWinner,
    target
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

    const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
      const params = {
        limit,
        ...paramsValue,
        page_id: pageValue,
      };

      dispatch(
        getActiveDiscussions(
          params,
          () => {},
          (res) => {
            setHasMore(!res.finished);
            appendData(res.proposals || []);
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

    const changeFilter = (value) => {
      const newParams = {
        ...params, is_winner: value
      };
      setParams(newParams);
      resetData();
      fetchData(1, newParams);
    };


    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between">
          <h3 className="mt-2 mb-4 text-xl font-bold">Proposals for surveying</h3>
            {!hideFilterWinner && (
              <SwitchButton
                labelRight="Winners only"
                value={params?.is_winner}
                onChange={(e) => changeFilter(e.target.checked)}
              />
            )}
        </div>
        <Table
          {...register}
          styles={styles}
          className={classNames('flex-1 min-h-0', hideWonColumn && styles.noWonTable)}
          onLoadMore={fetchData}
          hasMore={hasMore}
          dataLength={data.length}
          onSort={handleSort}
          target={target}
        >
          <Table.Header>
            <Table.HeaderCell>
              <p>Proposal number</p>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <p>Date discussion started</p>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <p>Proposal title</p>
            </Table.HeaderCell>
            {!hideWonColumn ? 
              <Table.HeaderCell>
                <p>Won prior survey?</p>
              </Table.HeaderCell> : <></>
            }
          </Table.Header>
          <Table.Body className="padding-tracker">
            {data.map((item, ind) => (
              <Table.BodyRow className="py-4" key={ind}>
                <Table.BodyCell>
                  <Link to={`/app/proposal/${item.id}`}>
                    <p>{item.id}</p>
                  </Link>
                </Table.BodyCell>
                <Table.BodyCell>
                  <p>{moment(item.approved_at).local().format("M/D/YYYY")}</p>
                </Table.BodyCell>
                <Table.BodyCell>
                  <Tooltip title={item.title} placement="bottom">
                    <p>{item.title}</p>
                  </Tooltip>
                </Table.BodyCell>
                {!hideWonColumn ? (
                  <Table.BodyCell>
                    {item.survey_ranks[0] ? (
                      <p>
                        Yes -{" "}
                        <Link
                          className="text-underline"
                          to={`/app/surveys/${item.survey_ranks[0].survey_id}`}
                        >
                          Survey {item.survey_ranks[0].survey_id}
                        </Link>
                      </p>
                    ) : (
                      <p>No</p>
                    )}
                  </Table.BodyCell>
                  ) : <></>
                }
              </Table.BodyRow>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
});

export default DiscussionProposalsTable;