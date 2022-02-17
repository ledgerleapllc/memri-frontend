import classNames from 'classnames';
import moment from 'moment';
import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardBody, CardHeader, Button, Table, useDialog, Dialog, useTable } from 'shared/partials';
import Helper from 'utils/Helper';
import { sendToVote, getAllReviewMilestones, leaveFeedback } from 'utils/Thunk';
import { renderMilestoneIndex } from '../../utils';
import styles from './style.module.scss';
import { AppContext } from 'App';

const LeaveFeedbackDialog = ({ id, close }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState();
  const { setLoading } = useContext(AppContext);

  const sendFeedback = () => {
    dispatch(
      leaveFeedback(
        id,
        { message: value },
        () => {
          setLoading(true);
        },
        (res) => {
          close(true);
          setLoading(false);
        }
      )
    );
  }

  return (
    <Dialog className='p-8 rounded-lg' showCloseBtn={false} close={close}>
      <Dialog.Header className='text-center text-3.75 font-semibold'>Send feedback to the OP about this milestone and request that they submit it again after the changes have taken effect?</Dialog.Header>
      <Dialog.Body className={classNames('pt-4')}>
        <textarea className="border p-4 w-full" value={value} onChange={(e) => setValue(e.target.value)} />
      </Dialog.Body>
      <Dialog.Footer className='pt-10 flex justify-center gap-4'>
        <Button onClick={() => close(false)} variant="outline">No, cancel</Button>
        <Button variant='contained' disabled={!value} onClick={sendFeedback}>
          Send Feedback
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}


const SendInVoteDialog = ({ id, close }) => {
  const dispatch = useDispatch();
  const { setLoading } = useContext(AppContext);
  const doSendToVote = () => {
    dispatch(
      sendToVote(
        id,
        () => {
          setLoading(true);
        },
        (res) => {
          close(true);
          setLoading(false);
        }
      )
    );
  }
  return (
    <Dialog className='pt-14 pb-8 rounded-lg' showCloseBtn={false} close={close}>
      <Dialog.Header className='text-center text-3.75 font-semibold'>Have you reviewed the milestone fully, and are ready to send it into live voting?</Dialog.Header>
      <Dialog.Footer className='pt-10 flex justify-center gap-4'>
        <Button onClick={() => close(false)} variant="outline">No, cancel</Button>
        <Button variant='contained' onClick={doSendToVote}>
          Send to Vote
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

const MilestonesInReview = () => {
  const { data, register, hasMore, appendData, setHasMore, setPage, setParams, page, params, resetData } = useTable();
  const dispatch = useDispatch();
  const { appendDialog } = useDialog();

  useEffect(() => {
    setParams({});
    resetData();
    fetchData(1, {});
  }, []);

  const fetchData = (pageValue = page, paramsValue = params, limit = 20) => {
    const params = {
      limit,
      ...paramsValue,
      page_id: pageValue,
    };

    dispatch(
      getAllReviewMilestones(
        params,
        () => {},
        (res) => {
          setHasMore(!res.finished);
          appendData(res.milestoneReviews);
          setPage((prev) => prev + 1);
        }
      )
    );
  };

  const reset = (val) => {
    if (val) {
      setTimeout(() => {
        setParams({});
        resetData();
        fetchData(1, {});
      }, 300);
    }
  }

  const leaveFeedback = (milestone) => {
    appendDialog(<LeaveFeedbackDialog id={milestone.milestone_id} afterClosed={(val) => reset(val)} />);
  }

  const sendInVote = (milestone) => {
    appendDialog(<SendInVoteDialog id={milestone.milestone_id} afterClosed={(val) => reset(val)} />);
  }

  return (
    <Card className={'h-full flex-1 min-h-0'}>
      <CardHeader>
        <div className='w-full flex justify-between'>
          <h3 className='font-bold text-lg'>Milestones in Review</h3>
        </div>
      </CardHeader>
      <CardBody>
        <Table
          {...register}
          styles={styles}
          className={classNames('h-full')}
          onLoadMore={fetchData}
          hasMore={hasMore}
          dataLength={data.length}
          // onSort={handleSort}
        >
          <Table.Header>
            <Table.HeaderCell>
              <p>Milestone number</p>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <p>Submitted date</p>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <p>Times submitted</p>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <p>OP email</p>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <p>Prop #</p>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <p>Proposal title</p>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <p>Milestone</p>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <p>Euro value</p>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <p>Action</p>
            </Table.HeaderCell>
          </Table.Header>
          <Table.Body className='padding-tracker'>
            {data.map((item, ind) => (
              <Table.BodyRow key={ind}>
                <Table.BodyCell>
                  {item.proposal_id}-{renderMilestoneIndex(item)}
                </Table.BodyCell>
                <Table.BodyCell>{moment(item.submitted_time).local().format('M/D/YYYY')}</Table.BodyCell>
                <Table.BodyCell>{item.time_submit}</Table.BodyCell>
                <Table.BodyCell>{item.email}</Table.BodyCell>
                <Table.BodyCell>{item.proposal_id}</Table.BodyCell>
                <Table.BodyCell>{item.proposal_title}</Table.BodyCell>
                <Table.BodyCell>
                  {renderMilestoneIndex(item)}/{item.milestones.length}
                </Table.BodyCell>
                <Table.BodyCell>{Helper.formatPriceNumber(item.grant || '', '€')}</Table.BodyCell>
                <Table.BodyCell>
                  <div className='flex gap-2'>
                    <Button 
                      size="sm"
                      color="primary"
                      variant="outline"
                      onClick={() => { leaveFeedback(item) }}
                    >
                      Leave Feedback
                    </Button>
                    <Button 
                      size="sm"
                      color="primary"
                      onClick={() => { sendInVote(item) }}
                    >
                      Send to Vote
                    </Button>
                  </div>
                </Table.BodyCell>
              </Table.BodyRow>
            ))}
          </Table.Body>
        </Table>
      </CardBody>
    </Card>
  );
};

export default MilestonesInReview;
