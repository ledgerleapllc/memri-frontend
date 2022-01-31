import React from "react";
import styles from "./style.module.scss";
import { Table } from '@shared/partials';

const OnboardingStats = ({ data }) => {
  return (
    <Table
      styles={styles}
      className="h-full"
      hasMore={false}
      dataLength={data.length}
    >
      <Table.Header>
        <Table.HeaderCell sortKey="proposal.id">
          <p>Month</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="proposal.title">
          <p>Number Onboarded</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Total</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((item, ind) => (
          <Table.BodyRow>
            <Table.BodyCell>
              {item.month}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.number_onboarded}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.total}
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
}

export default OnboardingStats;
