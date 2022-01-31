import React from "react";
import { useDispatch } from "react-redux";
import TeamTable from "./components/TeamTable";
import { setActiveModal } from "redux/actions";
import { Card, CardHeader, CardBody, Button } from 'shared/partials';

const AdminTeam = () => {
  const dispatch = useDispatch();

  const openAddAdminDialog = () => {
    dispatch(setActiveModal("add-admin-box"));
  };
  
  return (
    <Card className="mt-4 h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg">Teams</h3>
          <Button
            size="md"
            onClick={openAddAdminDialog}
          >
            + New Admin
          </Button>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-scroll">
        <TeamTable />
      </CardBody>
    </Card>
  )
}

export default AdminTeam;