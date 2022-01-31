import moment from "moment";
import React, { useContext, useEffect } from "react";
import { getAdminTeams, resendInvitedEmail, changeAdminPermission, resetPasswordAdmin } from "@utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable, Button } from '@shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "@utils/Constant";
import { showAlert, setActiveModal } from "@redux/actions";
import { SwitchButton } from "@shared/components";
import { AppContext } from '@src/App';
import classNames from "classnames";

const allPermissions = ['users', 'new_proposal', 'move_to_formal', 'grants', 'milestones', 'global_settings', 'emailer', 'accounting'];

const TeamTable = React.forwardRef(({ outParams }, ref) => {
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
    setData,
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
      getAdminTeams(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.users);
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

  const doResendInvitedEmail = (id) => {
    dispatch(
      resendInvitedEmail(
        { id },
        () => {
          setLoading(true);
        },
        (res) => {
          setLoading(false);
          if (res.success) {
            dispatch(
              showAlert("Resend Email successfully!", "success")
            );
          }
        }
      )
    );
  }

  const getPermission = (item, type) => {
    return !!item.permissions.find((x) => x.name === type)?.is_permission;
  }

  const renderAdminStatus = (item) => {
    let colorText = "";
    if (item.admin_status === "active") {
      colorText = "text-success";
    } else if (item.admin_status === "revoked") {
      colorText = "text-danger";
    }
    return (
      <>
        <p className={`${colorText} capitalize`}>{item.admin_status}</p>
        {item.admin_status === "invited" && (
          <Button
            variant="text"
            size="sm"
            className="mt-3 underline"
            onClick={() => doResendInvitedEmail(item.id)}
          >
            resend
          </Button>
        )}
      </>
    );
  }

  const togglePermissions = (item, permission, value) => {
    const currentPermission = item.permissions.find(
      (x) => x.name === permission
    );
    if (currentPermission) {
      currentPermission.is_permission =
        +currentPermission.is_permission === 1 ? 0 : 1;
      const inx = data.findIndex((x) => x.id === item.id);
      data[inx] = item;
      setData([...data]);

      dispatch(
        changeAdminPermission(
          {
            id: item.id,
            permissions: {
              [permission]: value ? 1 : 0,
            },
          },
          () => {},
          () => {}
        )
      );
    }
  };

  const askRevokeAdmin = (item) => {
    dispatch(setActiveModal("ask-revoke-admin", item));
  };

  const askUndoRevokeAdmin = (item) => {
    dispatch(setActiveModal("ask-undo-revoke-admin", item));
  };

  const doResetPWAdmin = (id) => {
    dispatch(
      resetPasswordAdmin(
        { id },
        () => {
          setLoading(true);
        },
        (res) => {
          setLoading(false);
          if (res.success) {
            dispatch(
              showAlert("Reset Password successfully!", "success")
            );
          }
        }
      )
    );
  };


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
          <p>Added Date</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Status</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Email</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Last Login</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>IP</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Users</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>New Proposals</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Move to Formal</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Grants</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Milestones</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Global settings</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Emailer</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Accounting</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow className="py-4" key={ind}>
            <Table.BodyCell>
              {moment(item.created_at).format("M/D/YYYY h:mm A")}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.is_super_admin ? "Super Admin" : "Admin"}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderAdminStatus(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.email}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.last_login_at
                ? moment(item.last_login_at).format("M/D/YYYY h:mm A")
                : ""}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.last_login_ip_address}
            </Table.BodyCell>
            <Table.BodyCell>
              {!item.is_super_admin && (
                <SwitchButton
                  value={getPermission(item, allPermissions[0])}
                  onChange={(e) =>
                    togglePermissions(item, allPermissions[0], e.target.checked)
                  }
                />
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              {!item.is_super_admin && (
                <SwitchButton
                  value={getPermission(item, allPermissions[1])}
                  onChange={(e) =>
                    togglePermissions(item, allPermissions[1], e.target.checked)
                  }
                />
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              {!item.is_super_admin && (
                <SwitchButton
                  value={getPermission(item, allPermissions[2])}
                  onChange={(e) =>
                    togglePermissions(item, allPermissions[2], e.target.checked)
                  }
                />
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              {!item.is_super_admin && (
                <SwitchButton
                  value={getPermission(item, allPermissions[3])}
                  onChange={(e) =>
                    togglePermissions(item, allPermissions[3], e.target.checked)
                  }
                />
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              {!item.is_super_admin && (
                <SwitchButton
                  value={getPermission(item, allPermissions[4])}
                  onChange={(e) =>
                    togglePermissions(item, allPermissions[4], e.target.checked)
                  }
                />
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              {!item.is_super_admin && (
                <SwitchButton
                  value={getPermission(item, allPermissions[5])}
                  onChange={(e) =>
                    togglePermissions(item, allPermissions[5], e.target.checked)
                  }
                />
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              {!item.is_super_admin && (
                <SwitchButton
                  value={getPermission(item, allPermissions[6])}
                  onChange={(e) =>
                    togglePermissions(item, allPermissions[6], e.target.checked)
                  }
                />
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              {!item.is_super_admin && (
                <SwitchButton
                  value={getPermission(item, allPermissions[7])}
                  onChange={(e) =>
                    togglePermissions(item, allPermissions[7], e.target.checked)
                  }
                />
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              <div className="flex flex-col gap-2">
                  {!item.is_super_admin && (
                    <Button
                      size="sm"
                      onClick={() => doResetPWAdmin(item.id)}
                    >
                      Reset Password
                    </Button>
                  )}
                  {!item.is_super_admin && item.admin_status !== "revoked" && (
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() => askRevokeAdmin(item)}
                    >
                      Revoke
                    </Button>
                  )}
                  {!item.is_super_admin && item.admin_status === "revoked" && (
                    <Button 
                      size="sm"
                      color="success"
                      onClick={() => askUndoRevokeAdmin(item)}
                    >
                      Undo
                    </Button>
                  )}
                </div>
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default TeamTable;