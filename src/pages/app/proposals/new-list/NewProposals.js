import React from "react";
import { useSelector } from "react-redux";
import NewProposalsTable from './tables';
import { useDelayInput } from 'shared/hooks/useDelayInput';
import { Card, CardHeader, CardBody } from 'shared/partials';

const NewProposals = ({ type }) => {
  const { params, setSearchTerm } = useDelayInput();
  const authUser = useSelector(state => state.global.authUser);
  if (!authUser || !authUser.id || !authUser.is_admin) return null;

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg">New Proposals (Admin Only)</h3>
          <div className="flex gap-8">
            <input
              className="text-xs"
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <NewProposalsTable outParams={params} />
      </CardBody>
    </Card>
  )
}

export default NewProposals;