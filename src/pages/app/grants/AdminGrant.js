import React, { useRef } from "react";
import { useSelector } from "react-redux";
import AdminPendingGrant from "./AdminPendingGrant";
import AdminActiveGrant from "./AdminActiveGrant";
import { Card, CardHeader, CardBody, Button } from 'shared/partials';
import { useDelayInput } from 'shared/hooks/useDelayInput';

const AdminPendingGrantCard = () => {
  const { params, setSearchTerm } = useDelayInput({
    status: 'pending'
  });

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg">Grants Pending Activation</h3>
          <input
            className="text-xs"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody>
        <AdminPendingGrant outParams={params} />
      </CardBody>
    </Card>
  )
}


const AdminActiveGrantCard = () => {
  const { params, setSearchTerm } = useDelayInput({
    status: 'active'
  });
  const ref = useRef();

  const download = () => {
    ref.current?.downloadCSV();
  }

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg">Active Grants</h3>
          <div className="flex gap-8">
            <Button size="sm" onClick={download}>
              Download CSV
            </Button>
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
        <AdminActiveGrant ref={ref} outParams={params} />
      </CardBody>
    </Card>
  )
}

const AdminGrant = () => {
  const authUser = useSelector(state => state.global.authUser);

  if (!authUser || !authUser.id) return null;
  
  return (
    <>
      <div className="h-1/2 pb-4">
        <AdminPendingGrantCard />
      </div>
      <div className="h-1/2">
        <AdminActiveGrantCard />
      </div>
    </>
  )
}
export default AdminGrant;
