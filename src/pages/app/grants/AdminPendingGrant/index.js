import React, { useContext, useEffect } from "react";
import {
  getGrantsShared,
  beginGrant,
  remindHellosignGrant,
  resendHellosignGrant,
} from "@utils/Thunk";
import { useDispatch, useSelector } from "react-redux";
import { Table, useTable, Button } from '@shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "@utils/Constant";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useHistory } from "react-router";
import { AppContext } from '@src/App';
import { Tooltip } from "@mui/material";import {
  setCustomModalData,
  setActiveModal,
  setGrantTableStatus,
  showAlert,
} from "@redux/actions";

const TOTAL_SIGN_COUNT = 3;

const AdminPendingGrantTable = React.forwardRef(({ outParams }, ref) => {
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
    setData
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
      return <p className="text-info">Active</p>;
    return <p className="text-success">Completed</p>;
  }

  const clickActivate = (item) => {
    dispatch(
      setCustomModalData({
        "activate-grant": {
          render: true,
          title:
            "Please upload the grant document with the association President's signature approving and activating this grant.",
          data: item,
        },
      })
    );
    dispatch(setActiveModal("custom-global-modal"));
  }

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
        },
      })
    );
    dispatch(setActiveModal("custom-global-modal"));
  }

  const clickBeginGrant = (item) => {
    const signedCount = +item.signture_grants.filter((x) => x.signed).length;
    if (signedCount === TOTAL_SIGN_COUNT) {
      dispatch(
        beginGrant(
          item.id,
          () => {
            setLoading(true);
          },
          (res) => {
            setLoading(false);
            if (res && res.success) {
              dispatch(setGrantTableStatus(true));
            }
          }
        )
      );
    }
  }

  const remind = (grant) => {
    dispatch(
      remindHellosignGrant(
        grant.id,
        () => {
          setLoading(true);
        },
        (res) => {
          if (res.success) {
            dispatch(showAlert(`Remind successfully`, "success"));
            reloadTable();
          }
          setLoading(false);
        }
      )
    );
  }

  const reloadTable = () => {
    resetData();
    fetchData(1);
  }

  const resend = (grant) => {
    dispatch(
      resendHellosignGrant(
        grant.id,
        () => {
          setLoading(true);
        },
        (res) => {
          if (res.success) {
            const ind = data.findIndex((x) => x.id === grant.id);
            data[ind].signture_grants = grant.signture_grants.map(
              (x) => x.signed === 0
            );
            setData([...data]);
            dispatch(showAlert(`Resend successfully`, "success"));
            reloadTable();
          }
          setLoading(false);
        }
      )
    );
  }

  const renderSignAgreement = (item) => {
    const signedCount = +item.signture_grants.filter((x) => x.signed).length;
    return (
      <div className="flex flex-col gap-1 justify-start">
        <div>
          <Button 
            variant="text"
            size="xs"
            onClick={() => showSignDialog(item)}>
            {signedCount}/{TOTAL_SIGN_COUNT}
          </Button>
        </div>
        <div>
          <Button
            variant="text"
            size="xs"
            onClick={() => remind(item)}
            className="underline inline"
          >
            Remind
          </Button>
        </div>
        <div>
          <Button
            variant="text"
            size="xs"
            onClick={() => resend(item)}
            className="underline"
          >
            Resend
          </Button>
        </div>
      </div>
    );
  }

  const renderGrantAction = (item) => {
    const signedCount = +item.signture_grants.filter((x) => x.signed).length;
    return (
      <div className="flex items-center flex-col">
        <Button
          size="sm"
          onClick={() => clickBeginGrant(item)}
          disabled={signedCount < TOTAL_SIGN_COUNT}
        >
          Activate
        </Button>
        {item.status == "pending" && (
          <Button
            size="sm"
            variant="text"
            onClick={() => clickActivate(item)}
            className="underline"
          >
            Force Activation
          </Button>
        )}
      </div>
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
        <Table.HeaderCell>
          <p>Signatures</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Action</p>
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
              {renderSignAgreement(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderGrantAction(item)}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default AdminPendingGrantTable;