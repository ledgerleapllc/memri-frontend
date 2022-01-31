import moment from "moment";
import React, { useContext, useEffect } from "react";
import { getMoveToFormalVotes, startFormalMilestoneVoting, startFormalVoting } from "@utils/Thunk";
import { useDispatch, useSelector } from "react-redux";
import { Table, useTable, Button } from '@shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "@utils/Constant";
import classNames from "classnames";
import { useHistory } from "react-router";
import { BALLOT_TYPES } from "@utils/enum";
import { AppContext } from '@src/App';
import {
  showAlert
} from "@redux/actions";
import { Tooltip } from "@mui/material";
const MoveToFormalTable = React.forwardRef(({ outParams }, ref) => {
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
  const authUser = useSelector(state => state.global.authUser);
  const history = useHistory();
  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getMoveToFormalVotes(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.votes);
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

  const clickRow = (vote) => {
    if (authUser?.is_member || authUser?.is_admin)
      history.push(`/app/proposal/${vote.proposal_id}`);
  }

  const clickStartFormal = (vote) => {
    if (!window.window.confirm("Are you sure you are going to start the formal voting?"))
      return;

    if (vote.content_type == "milestone") {
      this.props.dispatch(
        startFormalMilestoneVoting(
          vote.proposal_id,
          vote.id,
          () => {
            setLoading(true);
          },
          (res) => {
            setLoading(false);
            if (res.success) {
              dispatch(
                showAlert(
                  "Formal voting process has been started successfully",
                  "success"
                )
              );
              resetData();
              fetchData(1);
            }
          }
        )
      );
    } else {
      dispatch(
        startFormalVoting(
          vote.proposal_id,
          false,
          () => {
            setLoading(true);
          },
          (res) => {
            setLoading(false);
            if (res.success) {
              dispatch(
                showAlert(
                  "Formal voting process has been started successfully",
                  "success"
                )
              );
              resetData();
              fetchData(1);
            }
          }
        )
      );
    }
  }
  
  return (
    <Table
      {...register}
      styles={styles}
      className={classNames('h-full')}
      onLoadMore={fetchData}
      hasMore={hasMore}
      dataLength={data.length}
      onSort={handleSort}
    >
      <Table.Header>
        <Table.HeaderCell sortKey="proposal.id">
          <p>#</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.title">
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="vote.content_type">
          <p>Ballot Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="vote.updated_at">
          <p>Completed Date</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Action</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker" >
        {data.map((vote, ind) => (
          <Table.BodyRow key={ind} selectRowHandler={() => clickRow(vote)}>
            <Table.BodyCell>
              {vote.proposalId}
            </Table.BodyCell>
            <Table.BodyCell>
              <Tooltip title={vote.title} placement="bottom">
                <p>{vote.title}</p>
              </Tooltip>
            </Table.BodyCell>
            <Table.BodyCell className="capitalize">
              {BALLOT_TYPES[vote.content_type]}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(vote.updated_at).local().format("M/D/YYYY")}{" "}
              {moment(vote.updated_at).local().format("h:mm A")}
            </Table.BodyCell>
            <Table.BodyCell>
              <Button
                className="px-4 py-1"
                size="sm"
                onClick={() => clickStartFormal(vote)}
              >
                Start Formal Voting
              </Button>
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default MoveToFormalTable;