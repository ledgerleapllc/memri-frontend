import React, { useEffect, useRef, useState } from "react";
import PendingUserTable from "./tables";
import { useDelayInput } from 'shared/hooks/useDelayInput';
import { Card, CardHeader, CardBody } from 'shared/partials';
import { useDispatch, useSelector } from "react-redux";
import { getPendingUsersByAdmin } from "utils/Thunk";

const PendingUsersTab = () => {
  const { params, setSearchTerm } = useDelayInput();
  const ref = useRef();
  const authUser = useSelector(state => state.global.authUser);
  const dispatch = useDispatch();
  const [show, setShow] = useState();
  if (!authUser || !authUser.id) return null;

  useEffect(() => {
    dispatch(
      getPendingUsersByAdmin(
        params,
        () => {},
        (res) => {
          setShow(res.users.length > 0);
        }
      )
    );
  }, []);
  
  if (!show) return null;
  
  return (
    <Card className="h-1/4">
      <CardHeader>
        <div className="flex justify-between w-full">
          <h3 className="font-bold text-lg">
            Pending Users Table
          </h3>
          <input
            input
            className="text-xs"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody>
        <div className="h-full flex flex-col">
          <PendingUserTable ref={ref} outParams={params} />
        </div>
      </CardBody>
    </Card>
  )
}

export default PendingUsersTab;
