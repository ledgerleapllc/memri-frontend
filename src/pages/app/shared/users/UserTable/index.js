import moment from "moment";
import React, { useContext, useEffect, useImperativeHandle } from "react";
import { getUsersByAdmin, downloadCSVUsers } from "@utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable, Button } from '@shared/partials';
import styles from "./style.module.scss";
import { DECIMALS, LIMIT_API_RECORDS } from "@utils/Constant";
import classNames from "classnames";
import { useHistory } from "react-router";
import { AppContext } from '@src/App';

const UserTables = React.forwardRef(({ outParams }, ref) => {
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
  const history = useHistory();
  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getUsersByAdmin(
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

  useImperativeHandle(ref, () => ({
    downloadCSV: () => {
      dispatch(
        downloadCSVUsers(
          params,
          () => {
            setLoading(true);
          },
          (res) => {
            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "portal-users.csv");
            document.body.appendChild(link);
            link.click();
            setLoading(false);
          }
        )
      );
    }
  }), [params]);

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

  const renderUserType = (user) => {
    if (user.is_member) return "Voting Associate";
    else if (user.is_participant) return "Associate";
    else if (user.is_proposer) return "Proposer";
    else if (user.is_guest) return "Guest";
    return "";
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
        <Table.HeaderCell sortKey="users.id">
          <p>User ID</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="users.email">
          <p>Email</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Telegram</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="users.first_name">
          <p>First Name</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="users.last_name">
          <p>Last Name</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="users.forum_name">
          <p>Forum Name</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>V%</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Total Rep</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>User Type</p>
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
              {item.id}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.email}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.telegram}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.first_name}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.last_name}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.forum_name}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderUserType(item) === "Voting Associate" && (
                <>
                  {item.total_voted && item.total_informal_votes
                    ? (
                        (item.total_voted / item.total_informal_votes) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </>
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.total_rep.toFixed?.(DECIMALS)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderUserType(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              <Button color="primary" size="sm">View</Button>
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

export default UserTables;