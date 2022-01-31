import moment from "moment";
import React, { useContext, useEffect } from "react";
import { getPendingGrantOnboardings, sendKycKangarooByAdmin, resendKycKangaroo, forceWithdrawProposal, resendComplianceReview, startFormalVoting } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable, Button } from 'shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "utils/Constant";
import classNames from "classnames";
import { AppContext } from 'App';
import { setActiveModal } from "redux/actions";
import {
  showAlert
} from "redux/actions";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
const currentTime = moment(new Date());

const PendingGrantsTable = React.forwardRef(({ outParams }, ref) => {
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
      page_id: pageValue,
    };

    dispatch(
      getPendingGrantOnboardings(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.onboardings);
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

  const reloadTable = () => {
    resetData();
    fetchData(1);
  }

  const sendKYC = (item) => {
    dispatch(
      sendKycKangarooByAdmin(
        { user_id: item.user_id },
        () => {
          setLoading(true);
        },
        (res) => {
          setLoading(false);
          if (res.success) {
            reloadTable();
            dispatch(
              setActiveModal("confirm-kyc-link", { email: item.user?.email })
            );
          }
        }
      )
    );
  };

  const resendKYC = (item) => {
    dispatch(
      resendKycKangaroo(
        { user_id: item.user_id },
        () => {
          setLoading(true);
        },
        (res) => {
          setLoading(false);
          if (res.success) {
            dispatch(
              setActiveModal("confirm-kyc-link", { email: item.user?.email })
            );
          }
        }
      )
    );
  };

  const renderKYCStatus = (item) => {
    if (item.user?.shuftipro_temp) {
      if (!item.user?.shuftipro) {
        return (
          <div>
            <label className="block text-primary">Pending</label>
            <Button
              variant="text"
              size="sm"
              className="underline"
              onClick={() => resendKYC(item)}
            >
              resend email
            </Button>
          </div>
        );
      } else if (item.user?.shuftipro.status === "pending") {
        const duration = moment.duration(
          currentTime.diff(moment(item.user?.shuftipro.created_at))
        );
        const days = Math.floor(duration.asDays());
        return (
          <div className="text-primary">
            <label className="block">In Review</label>
            <span>{days} days</span>
          </div>
        );
      } else if (item.user?.shuftipro.status === "approved") {
        return (
          <div className="text-primary">
            <label>Approved</label>
          </div>
        );
      } else if (item.user?.shuftipro.status === "denied") {
        return (
          <div className="text-primary">
            <label>Denied</label>
          </div>
        );
      } else {
        return "";
      }
    } else {
      return (
        <div>
          <label className="block text-primary">Not submitted</label>
          <Button
            variant="text"
            size="sm"
            className="underline"
            onClick={() => sendKYC(item)}
          >
            Send email
          </Button>
        </div>
      );
    }
  }

  const resendCompliance = (item) => {
    dispatch(
      resendComplianceReview(
        { proposalId: item.proposal_id },
        () => {
          setLoading(true);
        },
        (res) => {
          setLoading(false);
          if (res.success) {
            dispatch(showAlert("Resend Successfully", "success"));
            this.reloadTable();
          }
        }
      )
    );
  };

  const clickStartFormal = (item, force = true) => {
    if (!window.window.confirm("Are you sure you are going to start the formal voting?"))
      return;
    dispatch(
      startFormalVoting(
        item.proposal_id,
        force,
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
            reloadTable();
          }
        }
      )
    );
  }

  const showReason = (item) => {
    dispatch(
      setActiveModal("show-denied-compliance", item.deny_reason)
    );
  };

  const renderComplianceStatus = (item) => {
    if (item.compliance_status === "pending") {
      return (
        <div>
          <label className="block">Pending</label>
          <Button
            size="sm"
            variant="text"
            className="underline"
            onClick={() => resendCompliance(item)}
          >
            resend email
          </Button>
        </div>
      );
    }
    if (item.compliance_status === "denied") {
      return (
        <div>
          <label className="font-size-14">Denied</label>
          <Button
            size="sm"
            className="underline"
            onClick={() => showReason(item)}
          >
            show reason
          </Button>
        </div>
      );
    }
    if (item.compliance_status === "approved") {
      return <label className="text-primary">Approved</label>;
    }
  }

  const clickForceWithdraw = (item) => {
    if (!window.window.confirm("Are you sure you are going to withdraw the formal voting?"))
      return;
    dispatch(
      forceWithdrawProposal(
        item.proposal_id,
        () => {
          setLoading(true);
        },
        (res) => {
          setLoading(false);
          if (res && res.success) this.reloadTable();
        }
      )
    );
  }

  const renderAction = (item) => {
    let buttonHtml = null;
    if (
      item.shuftipro_status &&
      item.shuftipro_status == "approved" &&
      item.form_submitted &&
      item.signature_request_id &&
      item.hellosign_form &&
      item.status == "pending"
    ) {
      buttonHtml = (
        <Button
          size="sm"
          variant="text"
          className="underline"
          onClick={() => clickStartFormal(item, false)}
        >
          Start Formal Voting
        </Button>
      );
    } else if (item.status == "pending") {
      buttonHtml = (
        <Button 
          variant="text"
          size="sm"
          className="underline"
          onClick={() => clickStartFormal(item, true)}
        >
          <u>
            {item.user?.shuftipro?.status === "approved" &&
            item.compliance_status === "approved"
              ? ""
              : "Force"}{" "}
            Start Formal Voting
          </u>
        </Button>
      );
    }

    if (buttonHtml) {
      return (
        <>
          <div>{buttonHtml}</div>
          <div className="mt-2">
            <Button 
              variant="text"
              size="sm"
              className="underline"
              onClick={() => clickForceWithdraw(item)}
            >
              <u>Force Withdraw</u>
            </Button>
          </div>
        </>
      );
    }

    return <label className="font-size-14">-</label>;
  }

  return (
    <Table
      {...register}
      styles={styles}
      className={classNames('h-full', styles.table)}
      onLoadMore={fetchData}
      hasMore={hasMore}
      dataLength={data.length}
      onSort={handleSort}
    >
      <Table.Header>
        <Table.HeaderCell>
          <p>Proposal #</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>OP Email</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Pass Date</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Status</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>First Name</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Last Name</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>KYC/AML</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Compliance Check</p>
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
              <Link
                to={`/app/user/${item.user.id}`}
              >
                {item.user.email}
              </Link>
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(item.updated_at).local().format("M/D/YYYY")}{" "}
              {moment(item.updated_at).local().format("h:mm A")}
            </Table.BodyCell>
            <Table.BodyCell>
              Pending
            </Table.BodyCell>
            <Table.BodyCell>
              <Tooltip title={item.proposal_title} placement="bottom">
                <Link
                  to={`/app/proposal/${item.proposal_id}`}
                  style={{ color: "inherit" }}
                >
                  {item.proposal_title}
                </Link>
              </Tooltip>
            </Table.BodyCell>
            <Table.BodyCell>
              {item.user.first_name}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.user.last_name}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderKYCStatus(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderComplianceStatus(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderAction(item)}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default PendingGrantsTable;