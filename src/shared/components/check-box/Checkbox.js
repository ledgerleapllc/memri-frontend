import classNames from "classnames";
import React, { useEffect, useState } from "react";
import * as Icon from "react-feather";

export default function Checkbox({ className, value, text, onChange, readOnly }) {
  const [val, setVal] = useState();

  const toggleCheck = () => {
    if (!readOnly) {
      setVal(!val);
      if (onChange) onChange(!val);
    }
  };

  useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <div className={classNames('flex items-center', className)}>
      <span onClick={() => toggleCheck()}>
        {val ? (
          <Icon.CheckSquare />
        ) : (
          <Icon.Square />
        )}
      </span>
      <label className="pl-3" onClick={() => toggleCheck()}>
        {text}
      </label>
    </div>
  );
}
