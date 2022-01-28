import React from "react";
import { Checkbox } from "@shared/partials";

export default function UnvotedFilter({ votes, show_unvoted, onChange }) {
  return (
    <div className="flex items-center gap-5">
      <label>{`${votes} votes to do`}</label>
      <Checkbox
        value={show_unvoted}
        onChange={onChange}
        text={`Show only unvoted`}
      />
    </div>
  );
}
