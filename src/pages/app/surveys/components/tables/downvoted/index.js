import moment from "moment";
import React, { useEffect, useContext } from "react";
import { getLosers, approveDownVote } from "@utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable, Button } from '@shared/partials';
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { LIMIT_API_RECORDS } from "@utils/Constant";
import { Tooltip } from "@mui/material";
import { AppContext } from '@src/App';

const DownvotedTable = React.forwardRef(({ outParams }, ref) => {
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
  const { setLoading } = useContext(AppContext);

  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      status: "active",
      page_id: pageValue,
    };

    dispatch(
      getLosers(
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

  const doApproveDownVote = (item) => {
    dispatch(
      approveDownVote(
        { proposalId: item.id },
        () => {
          setLoading(true);
        },
        (res) => {
          setLoading(false);
          if (res.success) {
            resetData();
            fetchData(1);
          }
        }
      )
    );
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
        <Table.HeaderCell >
          <p>Remove?</p>
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
              {!item.is_approved ? (
                  <p
                    className={
                      item.status.label === "In Discussion"
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {item.status.label}
                  </p>
                ) : (
                  <>
                    <p>Downvoted</p>
                    <p>
                      (approved{" "}
                      {moment(item.downvote_approved_at).format("M/D/YYYY")})
                    </p>
                  </>
                )}
            </Table.BodyCell>
            <Table.BodyCell>
              {!item.is_approved && (
                <Button
                  size="sm"
                  className="px-4 py-2"
                  onClick={() => doApproveDownVote(item)}
                >
                  Approve Downvote
                </Button>
              )}   
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default DownvotedTable;