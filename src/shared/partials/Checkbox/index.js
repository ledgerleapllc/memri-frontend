import React, { useEffect, useState } from "react";
import { ReactComponent as IconCheckSquare } from 'assets/icons/ic-check-square.svg';
import { ReactComponent as IconSquare } from 'assets/icons/ic-square.svg';
import { ReactComponent as IconX } from 'assets/icons/ic-x.svg';
import classNames from "classnames";

export const Checkbox = ({ className, children, value, text, onChange, readOnly, statusX, classCheckBox, classText }) => {
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
    <div className={classNames('flex text-sm items-center', className)}>
      <span onClick={() => toggleCheck()}>
        {val ? (
          <IconCheckSquare className={classNames('text-primary text-lg', classCheckBox)} />
        ) : (
          <IconSquare className={classNames('text-primary text-lg', classCheckBox)} />
        )}
      </span>
      <div className={classNames('pl-3', classText)}>
        <label onClick={() => toggleCheck()}>
          {text}
        </label>
        {children}
      </div>
    </div>
  );
}

export const CheckboxX = ({ children, value, text, onChange, readOnly }) => {
  const [val, setVal] = useState(null);

  const toggleCheck = () => {
    if (readOnly) return;
    let temp;
    if (val === 0) {
      temp = null;
    } else if (val === 1) {
      temp = 0;
    } else {
      temp = 1;
    }
    setVal(temp);
    if (onChange) onChange(temp);
  };

  useEffect(() => {
    if (value !== null) {
      setVal(+value);
    } else {
      setVal(value);
    }
  }, [value]);

  const renderCheck = () => {
    if (val === 1) {
      return <IconCheckSquare className="text-primary text-lg" />;
    } else if (val === 0) {
      return <IconX className="text-red text-lg" />;
    } else {
      return <IconSquare className="text-primary text-lg" />;
    }
  }

  return (
    <div className="flex text-sm">
      <span className="pt-0.5" onClick={() => toggleCheck()}>
        {renderCheck()}
      </span>
      <div className="pl-3 select-none">
        <label onClick={() => toggleCheck()}>
          {text} {val === 0 && <span className="text-red italic">Needs Review</span>}
        </label>
        {children}
      </div>
    </div>
  );
}

