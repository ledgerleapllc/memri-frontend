import moment from "moment";
import React, { useContext, useEffect, useImperativeHandle } from "react";
import { getReputationTrack, downloadCSVMyRep } from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { AppContext } from 'App';
import { DECIMALS, LIMIT_API_RECORDS } from "utils/Constant";

const RepTable = React.forwardRef(({ outParams }, ref) => {
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
      getReputationTrack(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.items);
          setPage(prev => prev + 1);
        }
      )
    );
  }

  useImperativeHandle(ref, () => ({
    downloadCSV: () => {
      dispatch(
        downloadCSVMyRep(
          { search: params.search },
          () => {
            setLoading(true);
          },
          (res) => {
            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "my-rep.csv");
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



  // Render Value
  const renderValue = (item) => {
    const value = parseFloat(item.value);

    if (value > 0)
      return (
        <label className="font-size-14 text-success">
          +{value?.toFixed?.(DECIMALS)}
        </label>
      );
    else if (value < 0)
      return (
        <label className="font-size-14 text-danger">
          {value?.toFixed?.(DECIMALS)}
        </label>
      );
    return "";
  }

  // Render Staked
  const renderStaked = (item) => {
    const value = parseFloat(item.staked);

    if (value > 0)
      return (
        <label className="font-size-14 text-success">
          +{value?.toFixed?.(DECIMALS)}
        </label>
      );
    else if (value < 0)
      return (
        <label className="font-size-14 text-danger">
          {value?.toFixed?.(DECIMALS)}
        </label>
      );
    return "";
  }

  // Render Pending
  const renderPending = (item) => {
    const value = parseFloat(item.pending);

    if (value > 0)
      return (
        <label className="font-size-14 text-success">
          +{value?.toFixed?.(DECIMALS)}
        </label>
      );
    else if (value < 0)
      return (
        <label className="font-size-14 text-danger">
          {value?.toFixed?.(DECIMALS)}
        </label>
      );
    return "";
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
        <Table.HeaderCell sortKey="reputation.event">
          <p>Event</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.title">
          <p>Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="reputation.type">
          <p>Transaction Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Earned/Returned/Lost</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.type">
          <p>Stake</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Pending</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="reputation.updated_at">
          <p>Date</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((row, ind) => (
          <Table.BodyRow key={ind}>
            <Table.BodyCell>
              {row.event}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.proposal_id ? row.proposal_title : "-"}
            </Table.BodyCell>
            <Table.BodyCell>
              {row.type}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderValue(row)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderStaked(row)}
            </Table.BodyCell>
            <Table.BodyCell>
              {renderPending(row)}
            </Table.BodyCell>
            <Table.BodyCell>
              {moment(row.updated_at).local().format("M/D/YYYY")}{" "}
              {moment(row.updated_at).local().format("h:mm A")}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default RepTable;