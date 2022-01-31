import moment from "moment";
import React, { useContext, useEffect } from "react";
import { getNotSubmitMilestones, getGrantsShared, startFormalMilestoneVotingUser } from "@utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable, Button } from '@shared/partials';
import styles from "./style.module.scss";
import {
  setCustomModalData,
  setActiveModal,
  setMilestoneVoteData,
  showAlert,
  setGrantTableStatus
} from "@redux/actions";
import { AppContext } from '@src/App';

const MemberGrantTable = React.forwardRef(({ outParams }, ref) => {
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

  const fetchData = (pageValue = page, paramsValue = params, limit = 25) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getGrantsShared(
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

  const renderStatus = (item) => {
    if (item.status == "pending")
      return (
        <p
          className="text-primary"
          onClick={() => showSignDialog()}
        >
          Awaiting signatures
        </p>
      );
    else if (item.status == "active")
      return <p className="text-info">Active</p>;
    return <p className="text-success">Completed</p>;
  };

  const showSignDialog = (item) => {
    if (
      !item.proposal ||
      !item.signture_grants ||
      !item.signture_grants.length
    ) {
      return null;
    }
    dispatch(
      setCustomModalData({
        signatures: {
          render: true,
          title: "Grant Agreement Signatures",
          data: item,
          hideGrantLogs: true,
        },
      })
    );
    dispatch(setActiveModal("custom-global-modal"));
  };

  const canMultipleSubmit = (item) => {
    return (
      item.status == "active" &&
      item.proposal?.milestones?.some((x) => {
        if (!x.submitted_time) {
          return true;
        } else {
          const latestReview =
            x.milestone_review[x.milestone_review.length - 1];
          return ["denied"].includes(latestReview?.status);
        }
      })
    );
  };

  const multipleSubmit = (item) => {
    dispatch(
      getNotSubmitMilestones(
        item.proposal_id,
        () => {
          setLoading(true);
        },
        (res) => {
          setLoading(false);
          if (res.success) {
            dispatch(
              setActiveModal("multiple-milestone-submit", {
                item,
                unsubmittedMilestones: res.milestones,
              })
            );
          }
        }
      )
    );
  };

  const renderAction = (item, mile, index) => {
    const latestReview =
      mile.milestone_review[mile.milestone_review.length - 1];
    if (item?.status === "pending") {
      return "-";
    }
    if (!mile.submitted_time) {
      return (
        <Button
          color="primary"
          size="sm"
          onClick={() => singleSubmit(item, mile, index)}
        >
          Submit Milestone
        </Button>
      );
    }
    if (
      mile.submitted_time &&
      ["pending", "active"].includes(latestReview?.status)
    ) {
      return <p className="text-primary">In Review with Admin</p>;
    }
    if (mile.submitted_time && ["denied"].includes(latestReview?.status)) {
      return (
        <Button
          color="primary"
          size="sm"
          onClick={() => singleSubmit(mile, index)}
        >
          Re-submit Milestone
        </Button>
      );
    }
    if (mile.votes.length > 0) {
      const lastVote = mile.votes[mile.votes.length - 1];
      if (lastVote.type === "informal" && lastVote.result === "success") {
        return (
          <Button
            color="primary"
            size="sm"
            onClick={() => startFormalMilestoneVote(item, mile, lastVote)}
          >
            Start Formal Milestone Vote
          </Button>
        );
      }
      if (lastVote.type === "formal" && lastVote.result === "success") {
        return <p className="text-success">Completed</p>;
      }
      if (lastVote.result === "fail") {
        return (
          <Button
            color="primary"
            size="sm"
            onClick={() => singleSubmit(mile, index)}
          >
            Re-Submit Milestone
          </Button>
        );
      }
    }
    return "-";
  };

  const singleSubmit = async (item, mile, index) => {
    const milestone = {
      index,
      proposal: item.proposal,
      milestone: mile,
    };
    await dispatch(setMilestoneVoteData(milestone));
    await dispatch(setActiveModal("milestone-vote"));
  };

  const startFormalMilestoneVote = (item, mile, lastVote) => {
    dispatch(
      startFormalMilestoneVotingUser(
        item.proposal_id,
        lastVote.id,
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
            dispatch(setGrantTableStatus(true));
          }
        }
      )
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
      canExpand
    >
      <Table.Header>
        <Table.HeaderCell>
          <p>#</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="final_grant.status">
          <p>Status</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="final_grant.created_at">
          <p>Start date</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Milestones Complete</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Milestones Total</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Action</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow className="py-4" key={ind}>
            <Table.BodyCell>
              {item.proposal_id}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.proposal.title}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderStatus(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(item.created_at).local().format("M/D/YYYY")}{" "}
              {moment(item.created_at).local().format("h:mm A")}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.milestones_complete ? item.milestones_complete : 0}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.milestones_total || 0}
            </Table.BodyCell>
            <Table.BodyCell>
              {canMultipleSubmit(item) ? (
                <Button size="sm" color="primary"
                  onClick={() => multipleSubmit(item)}
                >
                  Submit Milestones
                </Button>
              ) : (
                "-"
              )}
            </Table.BodyCell>
            <Table.BodyExpandRow>
              <div>
                {item.proposal?.milestones?.map((mile, ind) => (
                  <div className="flex justify-between">
                    <p className={styles['col-expand-1']}>Milestone {ind + 1} - {mile.title}</p>
                    <div className={styles['col-expand-2']}>{renderAction(item, mile, ind)}</div>
                  </div>
                ))}
              </div>
            </Table.BodyExpandRow>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default MemberGrantTable;