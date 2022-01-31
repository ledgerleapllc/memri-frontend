import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WinnersTable from "../../tables/winners";
import moment from "moment";
import { downloadSurveyWinner } from "@utils/Thunk";
import { hideCanvas, showCanvas } from "@redux/actions";
import { Card, CardHeader, CardBody, Button, DatePicker } from '@shared/partials';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class WinnersTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      statuses: [
        { label: "In Discussion", key: "in_discussion" },
        { label: "Informal Voting Failed", key: "informal_voting_failed" },
        {
          label: "Informal Voting No Quorum",
          key: "informal_voting_no_quorum",
        },
        { label: "Informal Voting Passed", key: "informal_voting_passed" },
        { label: "Informal Voting Live", key: "informal_voting_live" },
        { label: "Formal Voting Failed", key: "formal_voting_failed" },
        { label: "Formal Voting No Quorum", key: "formal_voting_no_quorum" },
        { label: "Formal Voting Passed", key: "formal_voting_passed" },
        { label: "Formal Voting Live", key: "formal_voting_live" },
        { label: "Completed", key: "completed" },
      ],
    };
  }

  downloadCSV() {
    this.props.dispatch(
      downloadSurveyWinner(
        this.state.params,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "winners.csv");
          document.body.appendChild(link);
          link.click();
          this.props.dispatch(hideCanvas());
        }
      )
    );
  }

  handleParams = (key, value) => {
    const { params } = this.state;
    if (["start_date", "end_date"].includes(key)) {
      if (value) {
        const temp = moment(value).local().format("YYYY-MM-DD");
        params[key] = temp;
      } else {
        delete params[key];
      }
    } else {
      if (value) {
        params[key] = value;
      } else {
        delete params[key];
      }
    }
    this.setState({ params: { ...params } });
  };

  render() {
    const { statuses, params } = this.state;
    return (
      <>
        <Card className="h-full">
          <CardHeader>
              <div className="flex justify-between w-full">
                <h3 className="font-bold">Survey Winners</h3>
                <div className="flex items-center gap-4">
                  <Button
                    size="md"
                    onClick={() => this.downloadCSV()}
                  >
                    Download
                  </Button>
                  <div className="flex flex-col">
                    <label className="pb-2">Filter by Spot #</label>
                    <select
                      className="w-48 px-4 py-2 border border-white1 rounded-md outline-none"
                      value={params?.spot_rank || ""}
                      onChange={(event) => {
                        this.handleParams("spot_rank", event.target.value);
                      }}
                    >
                      <option value="">Spot #</option>
                      {[...Array(10).keys()].map((x) => (
                        <option key={`option1_${x + 1}`} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="pb-2">Filter by Status</label>
                    <select
                      className="w-48 px-4 py-2 border border-white1 rounded-md outline-none"
                      value={params?.current_status || ""}
                      onChange={(event) => {
                        this.handleParams("current_status", event.target.value);
                      }}
                    >
                      <option value="">Status</option>
                      {statuses.map((x, i) => (
                        <option key={`option1_${i}`} value={x.key}>
                          {x.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col w-48">
                    <label>Start date</label>
                    <DatePicker
                      format="M/d/yyyy"
                      value={
                        params?.start_date ? new Date(params.start_date) : null
                      }
                      onChange={(val) => this.handleParams("start_date", val)}
                      onCalendarClose={() => {}}
                      calendarIcon={""}
                      clearIcon={""}
                    />
                  </div>
                  <div className="flex flex-col w-48">
                    <label className="pb-2">End date</label>
                    <DatePicker
                      format="M/d/yyyy"
                      value={
                        params?.end_date ? new Date(params.end_date) : null
                      }
                      onChange={(val) => this.handleParams("end_date", val)}
                      onCalendarClose={() => {}}
                      calendarIcon={""}
                      clearIcon={""}
                    />
                  </div>
                </div>
              </div>
          </CardHeader>
          <CardBody>
            <WinnersTable outParams={params} />
          </CardBody>
        </Card>
      </>
    );
  }
}

export default connect(mapStateToProps)(withRouter(WinnersTab));
