import moment from "moment";
import React, { useEffect } from "react";
import { listProposalMentors } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "utils/Constant";

const ProposalMentorsTable = React.forwardRef(({ outParams, userId }, ref) => {
  const {
    data,
    register,
    hasMore,
    appendData,
    setHasMore,
    setParams,
    page,
    params,
    resetData,
  } = useTable();
  const dispatch = useDispatch();
  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      listProposalMentors(
        userId,
        params,
        () => {},
        (res) => {
          setHasMore(false);
          appendData(res.proposals || []);
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
        <Table.HeaderCell>
          <p>Proposal #</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Mentor hours</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Submitted Date</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow className="py-4" key={ind}>
            <Table.BodyCell>
              {item.id}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.title}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.total_hours_mentor}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(item.created_at).local().format("M/D/YYYY")}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default ProposalMentorsTable;