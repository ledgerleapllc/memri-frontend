import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import AllMilestones from './components/AllMilestones';
import MilestonesInReview from './components/MilestonesInReview';

const Milestones = () => {
  const authUser = useSelector((state) => state.global.authUser);

  return (
    <div className='h-full' data-aos='fade-up' data-aos-duration='800'>
      <div className={classNames({ 'h-1/2 pb-4': authUser.id })}>
        <MilestonesInReview />
      </div>
      {authUser.id && (
        <div className='h-1/2'>
          <AllMilestones />
        </div>
      )}
    </div>
  );
};

export default Milestones;
