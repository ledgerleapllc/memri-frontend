import React, { useState } from "react";
import { SwitchButton } from "@shared/components";
import "./proposals.scss";
import PublicProposalTable from "./components/public-proposal-table";
import PublicMilestoneTable from "./components/milestones-table";
import { useDelayInput } from '@shared/hooks/useDelayInput';
import { Card, CardHeader, CardBody } from '@shared/partials';

const PublicProposals = () => {
  const { params, setSearchTerm, resetParams } = useDelayInput();
  const [typeShow, setTypeShow] = useState();

  const changeTypeShow = (e) => {
    setTypeShow(e.target.checked);
    resetParams();
  }
  
  return (
    <Card className="mt-4 h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg">Public Transparency Viewer Tool</h3>
          <SwitchButton
            labelLeft="Show grant"
            labelRight="Show milestones"
            value={typeShow}
            onChange={changeTypeShow}
          />
          <input
            className="text-xs"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody>
        {!typeShow && (
          <section className="h-full" data-aos="fade-up" data-aos-duration="500" >
            <PublicProposalTable outParams={params} />
          </section>
        )}
        {typeShow && (
          <section className="h-full" data-aos="fade-up" data-aos-duration="500" >
            <PublicMilestoneTable outParams={params}/>
          </section>
        )}
      </CardBody>
    </Card>
  )
}

export default PublicProposals;
