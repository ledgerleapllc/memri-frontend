import classNames from 'classnames';
import moment from 'moment';
import { renderMilestoneIndex } from 'pages/app/milestones/utils';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Table, useTable } from 'shared/partials';
import Helper from 'utils/Helper';
import { getAllMilestones } from 'utils/Thunk';
import styles from './style.module.scss';

const REVIEW_STATUS = {
  pending: 'Unassigned',
  active: 'Assigned',
  denied: 'Needs Review',
  'Not Submitted': 'Not Submitted',
  Submitted: 'Submitted',
};

const MILESTONE_FIELD = [
  { title: 'Milestone number' },
  { title: 'Status' },
  { title: 'OP email' },
  { title: 'Prop #' },
  { title: 'Proposal title' },
  { title: 'Milestone' },
  { title: 'Euro value' },
  { title: 'Due date' },
  { title: 'Submitted date' },
  { title: 'Review status' },
  { title: 'Vote result' },
  { title: 'Paid?' },
  { title: 'Paid Date' },
];

const AllMilestonesTable = (props) => {
  const { onTotal, sortParams } = props;
  const { data, register, hasMore, appendData, setHasMore, setPage, setParams, page, params, resetData } = useTable();

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const defaultParams = { sort_key: 'milestone.id', sort_direction: 'desc', search: '', ...sortParams };
    setParams(defaultParams);
    resetData();
    fetchData(1, defaultParams);
  }, [sortParams]);

  const fetchData = (pageValue = page, paramsValue = params, limit = 20) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getAllMilestones(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.milestones);
          setPage((prev) => prev + 1);

          onTotal &&
            onTotal({
              totalGrant: res.totalGrant,
              totalPaid: res.totalPaid,
              totalUnpaid: res.totalUnpaid,
            });
        }
      )
    );
  };

  const renderVoteResult = (item) => {
    const vote = item.votes[item.votes.length - 1];
    if (vote && vote.status === 'completed') {
      if (vote.result_count && vote.result == 'success') return <label className='text-success'>Pass</label>;
      else if (vote.result == 'no-quorum') return <label className='text-danger'>No Quorum</label>;
      return <label className='text-danger'>Fail</label>;
    }
    return null;
  };

  const goToDetail = (item) => {
    history.push(`/app/milestones/${item.id}/logs`);
  };

  return (
    <Table
      {...register}
      styles={styles}
      className={classNames('h-full', styles.table)}
      onLoadMore={fetchData}
      hasMore={hasMore}
      dataLength={data.length}
      // onSort={handleSort}
    >
      <Table.Header>
        {MILESTONE_FIELD.map((field, index) => (
          <Table.HeaderCell key={index}>
            <p>{field.title}</p>
          </Table.HeaderCell>
        ))}
      </Table.Header>
      <Table.Body className='padding-tracker'>
        {data.map((item, ind) => (
          <Table.BodyRow key={ind} onClick={() => goToDetail(item)}>
            <Table.BodyCell>
              {item.proposal_id}-{renderMilestoneIndex(item)}
            </Table.BodyCell>
            <Table.BodyCell>
              {item.submitted_time ? REVIEW_STATUS.Submitted : REVIEW_STATUS['Not Submitted']}
            </Table.BodyCell>
            <Table.BodyCell>{item.email}</Table.BodyCell>
            <Table.BodyCell>{item.proposal_id}</Table.BodyCell>
            <Table.BodyCell>
              {item.milestone_review_status === REVIEW_STATUS.denied && (
                <p>re-submission {renderMilestoneIndex(item)}</p>
              )}
              <p>{item.proposal_title}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              {renderMilestoneIndex(item)}/{item.milestones.length}
            </Table.BodyCell>
            <Table.BodyCell>{Helper.formatPriceNumber(item.grant || '', '€')}</Table.BodyCell>
            <Table.BodyCell>{item.deadline ? moment(item.deadline).local().format('M/D/YYYY') : ''}</Table.BodyCell>
            <Table.BodyCell>
              {item.submitted_time ? moment(item.submitted_time).local().format('M/D/YYYY') : ''}
            </Table.BodyCell>
            <Table.BodyCell>{REVIEW_STATUS[`${item.milestone_review_status}`]}</Table.BodyCell>
            <Table.BodyCell>{renderVoteResult(item)} </Table.BodyCell>
            <Table.BodyCell>{item.paid ? 'Yes' : 'No'}</Table.BodyCell>
            <Table.BodyCell>{item.paid_time ? moment(item.paid_time).local().format('M/D/YYYY') : ''}</Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  );
};

export default AllMilestonesTable;
