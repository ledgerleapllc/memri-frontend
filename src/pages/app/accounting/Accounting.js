import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Helper from "@utils/Helper";
import "./accounting.scss";
import { downloadCSVAccounting, getMetrics } from "@utils/Thunk";
import { hideCanvas, showCanvas } from "@redux/actions";
import DosFeeTable from "./components/DosFeeTable";
import moment from "moment";
import { Card, CardHeader, CardBody, DatePicker, Button } from '@shared/partials';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Accounting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metrics: {},
      params: {},
      total: {},
    };
  }

  componentDidMount() {
    this.fetchMetrics();
  }

  fetchMetrics() {
    this.props.dispatch(
      getMetrics(
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res.success) {
            const metrics = {
              totalGrant: res.data.totalGrant,
            };
            this.setState({
              metrics,
            });
          }
        }
      )
    );
  }

  handleParams = (key, value) => {
    const { params } = this.state;
    if (key === "notSubmitted") {
      if (value) {
        params[key] = 1;
      } else {
        delete params[key];
      }
    } else if (["hidePaid", "hideCompletedGrants"].includes(key)) {
      if (value) {
        params[key] = 1;
      } else {
        delete params[key];
      }
    } else if (["start_date", "end_date"].includes(key)) {
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

  // Handle Search
  handleSearch = (val) => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.timer = setTimeout(() => {
      this.handleParams("search", val);
    }, 500);
  };

  downloadCSV = () => {
    this.props.dispatch(
      downloadCSVAccounting(
        this.state.params,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "accounting.csv");
          document.body.appendChild(link);
          link.click();
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  getTotal = (total) => {
    this.setState({ total });
  };

  render() {
    const { authUser } = this.props;
    const { metrics, total, params } = this.state;
    if (!authUser || !authUser.id) return null;

    if (!authUser.is_admin) return <Redirect to="/" />;

    return (
      <div className="h-full flex flex-col">
        <Card className="mb-4">
          <CardHeader>
            <h3 className="font-bold">System metrics</h3>
          </CardHeader>
          <CardBody>
            <div>
              <label className="pr-3">Sum of grants activated:</label>
              <span>
                {Helper.formatPriceNumber(metrics?.totalGrant || 0, "€")}
              </span>
            </div>
          </CardBody>
        </Card>
        <Card className="flex-1 min-h-0">
          <CardHeader>
            <h3 className="font-bold">DOS Fee Tracker</h3>
          </CardHeader>
          <CardBody className="flex flex-col">
            <div className="flex justify-between pb-8">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="pr-3">ETH total for date range:</label>
                  <span>{Helper.formatPriceNumber(total?.totalETH || 0, "€")}</span>
                </div>
                <div>
                  <label className="pr-3">CC total for date range:</label>
                  <span>{Helper.formatPriceNumber(total?.totalCC || 0, "€")}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col">
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
                <div className="flex flex-col">
                  <label>End date</label>
                  <DatePicker
                    format="M/d/yyyy"
                    value={params?.end_date ? new Date(params.end_date) : null}
                    onChange={(val) => this.handleParams("end_date", val)}
                    onCalendarClose={() => {}}
                    calendarIcon={""}
                    clearIcon={""}
                  />
                </div>
                <div className="flex items-end">
                  <input
                    className="text-xs"
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => this.handleSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button size="sm" onClick={() => this.downloadCSV()}>
                    Download CSV
                  </Button>
                </div>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <DosFeeTable outParams={this.state.params} onTotal={this.getTotal} />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Accounting));
