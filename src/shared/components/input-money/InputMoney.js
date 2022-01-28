import React from "react";
import { InputBase, InputAdornment } from "@mui/material";
import "./input-money.scss";

const InputMoney = ({ value, onChange }) => {
  return (
    <InputBase
      className="input-base-custom input-money"
      startAdornment={<InputAdornment position="start">€</InputAdornment>}
      type="number"
      inputProps={{ min: 0 }}
      onChange={onChange}
      value={value || ""}
    />
  );
};

export default InputMoney;
