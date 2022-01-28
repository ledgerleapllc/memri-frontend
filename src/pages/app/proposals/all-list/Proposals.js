import React, { useRef } from "react";
import { useSelector } from "react-redux";
import AllProposals from './all-proposals-table';
import { useDelayInput } from '@shared/hooks/useDelayInput';
import { Card, CardHeader, CardBody, Button } from '@shared/partials';

const Proposals = ({ type }) => {
  const { params, setSearchTerm } = useDelayInput();
  const authUser = useSelector(state => state.global.authUser);
  const ref = useRef();
  if (!authUser || !authUser.id) return null;
  if (!authUser.is_admin && !authUser.is_member && !authUser.is_participant)
    return null;

  const onDownload = () => {
    ref.current?.downloadCSV();
  }

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg">All Proposals</h3>
          <div className="flex gap-8">
            {!!authUser.is_admin && <Button color="secondary" size="md" onClick={onDownload}>Download CSV</Button>}
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
        <AllProposals ref={ref} outParams={params} type={type} />
      </CardBody>
    </Card>
  )
}

export default Proposals;