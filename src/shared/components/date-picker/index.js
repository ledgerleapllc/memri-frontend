import React from "react";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import "./style.scss";

export default function BasicDatePicker({ value, onChange }) {
  return (
    <div className="basic-calendar">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          label=""
          value={value || null}
          onChange={onChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
