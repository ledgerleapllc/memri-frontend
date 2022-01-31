import React, { useEffect } from "react";
import {
  getDosFee,
} from "utils/Thunk";
import { useDispatch } from "react-redux";
import { Table, useTable } from 'shared/partials';
import styles from "./style.module.scss";
import { LIMIT_API_RECORDS } from "utils/Constant";
import classNames from "classnames";
import moment from 'moment';

const DosFeeTable = React.forwardRef(({ outParams, onTotal }, ref) => {
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
  const fetchData = (pageValue = page, paramsValue = params, limit = LIMIT_API_RECORDS) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getDosFee(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.proposals);
          setPage(prev => prev + 1);
          onTotal({
            totalCC: res.totalCC,
            totalETH: res.totalETH,
          });
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
          <p>Date Time</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>Grant #</p>
        </Table.HeaderCell>
        <Table.HeaderCell >
          <p>OP</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Type</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Amount</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>ETH Amount</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>TXID</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Bypass?</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker" >
        {data.map((item, ind) => (
          <Table.BodyRow key={ind}>
            <Table.BodyCell>
              {moment(item.created_at).format("M/D/YYYY h:mm A")}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.id}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.email}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.type_dos}
            </Table.BodyCell>
            <Table.BodyCell>
              {item?.dos_amount}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.type_dos === "eth" && item.amount_dos?.toFixed(4)}
            </Table.BodyCell>
            <Table.BodyCell className="break-words">
              {item.dos_txid}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.bypass ? "Yes" : "No"}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
});

export default DosFeeTable;