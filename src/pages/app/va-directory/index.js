import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import VATables from "./components/VATables";
import { useDelayInput } from 'shared/hooks/useDelayInput';
import { Card, CardHeader, CardBody } from 'shared/partials';

const VADirectory = () => {
  const { params, setSearchTerm } = useDelayInput();
  const ref = useRef();
  const authUser = useSelector(state => state.global.authUser);
  const [total, setTotal] = useState(0);
  if (!authUser || !authUser.id) return null;
  if (!authUser.is_member && !authUser.is_admin && !authUser.is_super_admin)
    return <Redirect to="/" />;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="w-full flex justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">
              VA Directory
            </h3>
            <span>Total voting associates: {total}</span>
          </div>
          <div>
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
        <VATables ref={ref} outParams={params} getValue={(val) => setTotal(val)} />
      </CardBody>
    </Card>
  )
}

export default VADirectory;
