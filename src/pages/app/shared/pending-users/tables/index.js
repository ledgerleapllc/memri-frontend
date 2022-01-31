import moment from "moment";
import React, { useEffect } from "react";
import { getPendingUsersByAdmin } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable, Button } from 'shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "utils/Constant";
import classNames from "classnames";
import { useHistory } from "react-router";
import {
  setCustomModalData,
  setActiveModal,
} from "redux/actions";
const PendingUsersTable = React.forwardRef(({ outParams }, ref) => {
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
      getPendingUsersByAdmin(
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

  const clickRow = (user) => {
    history.push(`/app/user/${user.id}`);
  }

  const clickManage = (user) => {
    dispatch(
      setCustomModalData({
        "manage-access": {
          render: true,
          title: "You can allow/deny access of this user.",
          data: user,
        },
      })
    );
    dispatch(setActiveModal("custom-global-modal"));
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
        <Table.HeaderCell sortKey="users.email">
          <p>Email</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="users.first_name">
          <p>Alias</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="profile.telegram">
          <p>Telegram</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Action</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="users.created_at">
          <p>Registered Date</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker" >
        {data.map((item, ind) => (
          <Table.BodyRow key={ind} selectRowHandler={() => clickRow(item)}>
            <Table.BodyCell>
              {item.email}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.first_name} {item.last_name}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.telegram}
            </Table.BodyCell>
            <Table.BodyCell>
              <Button
                size="sm"
                onClick={() => clickManage(item)}
              >
                Manage Access
              </Button>
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(item.created_at).local().format("M/D/YYYY")}{" "}
              {moment(item.created_at).local().format("h:mm A")}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default PendingUsersTable;