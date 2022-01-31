import React, { useContext, useEffect, useImperativeHandle } from "react";
import {
  getGrantsShared,
  viewSignedGrant,
  downloadCSVActiveGrants,
} from "@utils/Thunk";
import { useDispatch, useSelector } from "react-redux";
import { Table, useTable, Button } from '@shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "@utils/Constant";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useHistory } from "react-router";
import { AppContext } from '@src/App';
import { Tooltip } from "@mui/material";
import moment from 'moment';

const AdminActiveGrantTable = React.forwardRef(({ outParams }, ref) => {
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
      getGrantsShared(
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

  useImperativeHandle(ref, () => ({
    downloadCSV: () => {
      dispatch(
        downloadCSVActiveGrants(
          params,
          () => {
            setLoading(true);
          },
          (res) => {
            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "active-grant.csv");
            document.body.appendChild(link);
            link.click();
            setLoading(false);
          }
        )
      );
    }
  }), [params]);

  const clickRow = (item) => {
    if (authUser.is_admin || authUser.is_member)
      history.push(`/app/proposal/${item.proposal_id}`);
    else if (authUser.is_participant) {
      if (item.user_id == authUser.id) {
        // OP
        history.push(`/app/proposal/${item.proposal_id}`);
      } else {
        // Not OP & Not Vote
        if (!item.votes || !item.votes.length)
          history.push(`/app/proposal/${item.proposal_id}`);
      }
    }
  }

  const renderStatus = (item) => {
    if (item.status == "pending")
      return <p className="text-primary">Pending</p>;
    else if (item.status == "active")
      return <p className="text-secondary">Active</p>;
    return <p className="text-success">Completed</p>;
  }

  const openSignedGrant = (item) => {
    dispatch(
      viewSignedGrant(
        item.id,
        () => {
          setLoading(true);
        },
        (res) => {
          if (res.success) {
            window.open(res.file_url, "_blank").focus();
          }
          setLoading(false);
        }
      )
    );
  }

  const renderSignAgreement = (item) => {
    return (
      <>
        <Button
          size="sm"
          onClick={() => openSignedGrant(item)}
        >
          View
        </Button>
      </>
    );
  }

  const renderMilestonesComplete = (item) => {
    return (
      <p
        className={`${
          +item.milestones_complete === +item.milestones_total
            ? "text-success"
            : ""
        }`}
      >
        {item.milestones_complete}/{item.milestones_total}
      </p>
    );
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
        <Table.HeaderCell >
          <p>#</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>OP Email</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="final_grant.status">
          <p>Status</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="final_grant.created_at">
          <p>Start Date</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Milestones<br/> Complete</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Grant Agreement</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker" >
        {data.map((item, ind) => (
          <Table.BodyRow key={ind}>
            <Table.BodyCell>
              {item.proposal_id}
            </Table.BodyCell>
            <Table.BodyCell>
              <Tooltip title={item.proposal.title} placement="bottom">
                <p onClick={() => clickRow(item)}>
                  {item.proposal.title}
                </p>
              </Tooltip>
            </Table.BodyCell>
            <Table.BodyCell>
              <Link
                  to={`/app/user/${item.proposal.user_id}`}
                  style={{ color: "inherit" }}
                >
                  {item.user?.email}
              </Link>
            </Table.BodyCell>
            <Table.BodyCell>
              {renderStatus(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              <p className="font-size-14">
                {moment(item.created_at).local().format("M/D/YYYY")}
                <br />
                {moment(item.created_at).local().format("h:mm A")}
              </p>
            </Table.BodyCell>
            <Table.BodyCell>
              {renderMilestonesComplete(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderSignAgreement(item)}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default AdminActiveGrantTable;