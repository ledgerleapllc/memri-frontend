import React, { useRef, useState } from "react";
import UserTable from "./UserTable";
import { useDelayInput } from '@shared/hooks/useDelayInput';
import { Card, CardHeader, CardBody, Checkbox, DatePicker, Button } from '@shared/partials';
import moment from "moment";

const UsersTab = () => {
  const { params, setSearchTerm, setParams } = useDelayInput();
  const ref = useRef();
  const [filter_v, setFilterV] = useState();
  const [temp, setTemp] = useState({});

  const filterV = (val) => {
    setFilterV(val);
    if (!val) {
      const temp = {};
      temp.start_date = null;
      temp.end_date = null;
      setTemp(temp);
      setParams({
        ...params,
        ...temp
      });
    }
  };

  const recalculate = () => {
    setParams(temp);
  };

  const changeVA = (val) => {
    setParams({
      ...params,
      is_va: Number(val)
    });
  }

  const download = () => {
    ref.current?.downloadCSV();
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col w-full">
          <h3 className="font-bold text-lg">
            Users Table
          </h3>
          <div className="mt-4 flex flex-col">
            <div className="flex justify-between">
              <Checkbox
                text="Filter V%"
                value={filter_v}
                onChange={(val) => filterV(val)}
              />
              <div className="flex gap-6">
                <Checkbox
                  text="Show only VAs"
                  onChange={(val) => changeVA(val)}
                />
                <Button
                  className="h-10"
                  color="primary"
                  size="sm"
                  onClick={() => download()}
                >
                  Download CSV
                </Button>
                <input
                  input
                  className="text-xs"
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {filter_v && (
              <div data-aos="fade-in" data-aos-duration="800" class="flex gap-6 items-end">
                <div className="flex flex-col">
                  <label className="pb-2">Start date</label>
                  <DatePicker
                    format="M/d/yyyy"
                    value={temp?.start_date ? new Date(temp?.start_date) : null}
                    onChange={(val) =>
                      setTemp({
                        ...temp,
                        start_date: val
                          ? moment(val).local().format("YYYY-MM-DD")
                          : null,
                      })
                    }
                    onCalendarClose={() => {}}
                    calendarIcon={""}
                    clearIcon={""}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="pb-2">End date</label>
                  <DatePicker
                    format="M/d/yyyy"
                    value={temp?.end_date ? new Date(temp?.end_date) : null}
                    onChange={(val) =>
                      setTemp({
                        ...temp,
                        end_date: val
                          ? moment(val).local().format("YYYY-MM-DD")
                          : null,
                      })
                    }
                    onCalendarClose={() => {}}
                    calendarIcon={""}
                    clearIcon={""}
                  />
                </div>
                <Button
                  className="h-10"
                  color="primary"
                  size="sm"
                  onClick={() => recalculate()}
                >
                  Recalculate
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="h-full flex flex-col overflow-x-scroll">
          <UserTable ref={ref} outParams={params} />
        </div>
      </CardBody>
    </Card>
  )
}

export default UsersTab;
