import { Autocomplete, TextField } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardBody, CardHeader, DatePicker } from 'shared/partials';
import { getAllOPMilestones, getAllProposalMilestones } from 'utils/Thunk';
import AllMilestonesTable from './AllMilestonesTable';

const AllMilestones = () => {
  const [params, setParams] = useState({});
  const [total, setTotal] = useState({});
  const [ops, setOps] = useState([]);
  const [proposals, setProposals] = useState([]);
  console.log(total);
  // const authUser = useSelector((state) => state.global.authUser);

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch data
    getOps();
    getProposalFilter();
  }, []);

  const getOps = () => {
    dispatch(
      getAllOPMilestones(
        {},
        () => {},
        (res) => {
          if (res.success) {
            setOps(res.emails);
          }
        }
      )
    );
  };

  const getProposalFilter = () => {
    dispatch(
      getAllProposalMilestones(
        {},
        () => {},
        (res) => {
          if (res.success) {
            setProposals(res.proposalIds.map((x) => `${x}`));
          }
        }
      )
    );
  };

  const handleParams = (key, value) => {
    if (key === 'notSubmitted') {
      if (value) {
        params[key] = 1;
      } else {
        delete params[key];
      }
    } else if (['hidePaid', 'hideCompletedGrants'].includes(key)) {
      if (value) {
        params[key] = 1;
      } else {
        delete params[key];
      }
    } else if (['startDate', 'endDate'].includes(key)) {
      if (value) {
        const temp = moment(value).local().format('YYYY-MM-DD');
        params[key] = temp;
      } else {
        delete params[key];
      }
    } else {
      if (value) {
        params[key] = value;
      } else {
        delete params[key];
      }
    }
    setParams({ ...params });
  };

  return (
    <Card className={'h-full flex-1 min-h-0'}>
      <CardHeader>
        <div className='flex justify-between w-full'>
          <h3 className='font-bold text-lg'>All Milestones</h3>
          <div className='flex'>
            <div className='mr-4 flex flex-col w-52'>
              <label className='pb-2'>Start date</label>
              <DatePicker
                format='M/d/yyyy'
                value={params.startDate ? new Date(params.startDate) : null}
                onChange={(val) => handleParams('startDate', val)}
                onCalendarClose={() => {}}
                calendarIcon={''}
                clearIcon={''}
              />
            </div>
            <div className='mr-4 flex flex-col w-52'>
              <label className='pb-2'>End date</label>
              <DatePicker
                format='M/d/yyyy'
                value={params.endDate ? new Date(params.endDate) : null}
                onChange={(val) => handleParams('endDate', val)}
                onCalendarClose={() => {}}
                calendarIcon={''}
                clearIcon={''}
              />
            </div>
            <div className='mr-4 flex flex-col w-52'>
              <label className='pb-2'>Filter by Grant</label>
              <Autocomplete
                onChange={(event, newValue) => {
                  handleParams('proposalId', newValue);
                }}
                className='autocomplete-custom'
                options={proposals}
                renderInput={(params) => <TextField {...params} label='Select' variant='outlined' />}
              />
            </div>
            <div className='mr-4 flex flex-col w-52'>
              <label className='pb-2'>Filter by OP</label>
              <Autocomplete
                className='autocomplete-custom'
                onChange={(event, newValue) => {
                  handleParams('email', newValue);
                }}
                options={ops}
                renderInput={(params) => <TextField {...params} label='Select' variant='outlined' />}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className='h-full flex flex-col overflow-x-scroll'>
          <AllMilestonesTable sortParams={params} onTotal={(total) => setTotal({ total })} />
        </div>
      </CardBody>
    </Card>
  );
};

export default AllMilestones;
