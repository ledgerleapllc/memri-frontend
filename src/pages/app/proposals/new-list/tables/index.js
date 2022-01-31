import moment from "moment";
import React, { useEffect } from "react";
import Helper from "utils/Helper";
import { PROPOSAL_TYPES } from "utils/enum";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Table, useTable, Button } from 'shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "utils/Constant";
import * as Icon from "react-feather";
import { approveProposal, getPendingProposals } from "utils/Thunk";
import {
  hideCanvas,
  setActiveModal,
  setAdminActiveProposalTableStatus,
  setCustomModalData,
  setDOSReviewData,
  setReviewProposal,
  showCanvas,
} from "redux/actions";
const NewProposals = React.forwardRef(({ outParams }, ref) => {
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
  const authUser = useSelector(state => state.global.authUser);
  const history = useHistory();

  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getPendingProposals(
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

  const clickRow = (item) => {
    if (authUser && authUser.is_admin) {
      history.push(`/app/proposal/${item.id}`);
    }
  }

  const handleSort = async (key, direction) => {
    const newParams = {
      sort_key: key,
      sort_direction: direction,
    };
    setParams(newParams);
    resetData();
    fetchData(1, newParams);
  };

  const renderFlag = (item) => {
    let relationship = item.relationship || "";
    relationship = relationship.split(",");

    if (relationship.includes("0")) return <Icon.Flag />;
    return null;
  }

  const approve = (e, proposal) => {
    e.preventDefault();
    if (
      !window.window.confirm("Are you sure you are going to approve the selected proposal?")
    )
      return;

    dispatch(
      approveProposal(
        proposal.id,
        () => {
          dispatch(showCanvas());
        },
        () => {
          dispatch(hideCanvas());
          this.reloadTable();
          dispatch(setAdminActiveProposalTableStatus(true));
        }
      )
    );
  }

  const clickWithdraw = (e, item) => {
    e.preventDefault();
    dispatch(
      setCustomModalData({
        "confirm-withdraw": {
          render: true,
          title: "Are you sure you want to withdraw this proposal?",
          data: item,
        },
      })
    );
    dispatch(setActiveModal("custom-global-modal"));
  }

  const deny = (e, proposal) => {
    e.preventDefault();
    dispatch(setReviewProposal(proposal));
    dispatch(setActiveModal("deny-proposal"));
  }

  const clickReviewPayment = (e, proposal) => {
    e.preventDefault();
    this.props.dispatch(setDOSReviewData(proposal));
    this.props.dispatch(setActiveModal("dos-review"));
  }

  const renderActions = (item) => {
    if (item.status == "pending") {
      return (
        <div className="flex gap-4">
          <Button
            color="success"
            size="xs"
            onClick={(e) => approve(e, item)}
          >
            Approve
          </Button>
          <Button
            color="danger"
            size="xs"
            onClick={(e) => deny(e, item)}
          >
            Deny
          </Button>
        </div>
      );
    } else if (item.status == "payment" && item.dos_paid) {
      return (
        <div className="c-action-buttons">
          <Button
            color="secondary"
            size="sm"
            onClick={(e) => clickReviewPayment(e, item)}
          >
            Review Payment
          </Button>
        </div>
      );
    } else if (!item.dos_paid) {
      return (
        <>
          <label
            className="text-primary"
            onClick={() => clickRow(item)}
          >
            Payment Waiting
          </label>
          <Button
            className="mt-2"
            color="danger"
            variant="outline"
            size="sm"
            onClick={(e) => clickWithdraw(e, item)}
          >
            Force Withdraw
          </Button>
        </>
      );
    }

    return null;
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
        <Table.HeaderCell sortKey="proposal.id">
          <p>#</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.title">
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Affiliate</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.type">
          <p>Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.created_at">
          <p>Date</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Action</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((row, ind) => (
          <Table.BodyRow className="py-4" key={ind} selectRowHandler={() => clickRow(row)}>
            <Table.BodyCell>
              {row.id}
            </Table.BodyCell>
            <Table.BodyCell>
              <p className="font-bold pb-2">
                {row.title}
              </p>
              <p className="text-xs">
                {Helper.getExcerpt(row.short_description || row.member_reason)}
              </p>
            </Table.BodyCell>
            <Table.BodyCell>
              {renderFlag(row)}
            </Table.BodyCell>
            <Table.BodyCell className="capitalize">
              {PROPOSAL_TYPES[row.type]}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(row.created_at).local().format("M/D/YYYY")}{" "}
              {moment(row.created_at).local().format("h:mm A")}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderActions(row)}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default NewProposals;