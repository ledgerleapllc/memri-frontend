import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router";
import { LineChart, PieChart } from "@shared/components";
import { hideCanvas, showCanvas, setActiveModal } from "@redux/actions";
import {
  getReportOnboarding,
  getReportReputation,
  getReportTotalRep,
} from "@utils/Thunk";
import OnboardingStats from "./components/onboarding-stats";
import { FROM_YEAR } from "@utils/Constant";
import { Card, CardHeader, CardBody, Button } from '@shared/partials';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    settings: state.global.settings,
    customModalData: state.global.customModalData,
  };
};

class Report extends Component {
  constructor(props) {
    super(props);
    const currentYear = new Date().getFullYear();
    this.state = {
      currentYear,
      yearOnboarding: currentYear,
      yearReputation: currentYear,
      yearTotalRep: currentYear,
      reportOnboarding: null,
      reportReputation: null,
      reportTotalRep: null,
    };
  }

  componentDidMount() {
    this.fetchReportOnboarding();
    this.fetchReportReputation();
    this.fetchReportTotalRep();
    document.body.classList.add('scroll-window');
  }

  componentWillUnmount() {
    document.body.classList.remove('scroll-window');
  }

  fetchReportOnboarding = () => {
    this.props.dispatch(
      getReportOnboarding(
        { year: this.state.yearOnboarding },
        () => {
          this.props.dispatch(showCanvas());
        },
        async (res) => {
          this.props.dispatch(hideCanvas());
          if (res.success) {
            const temp = {
              xAxis: res.onboarding_results.map((x) => x.month),
              data: [
                {
                  name: "Onboardings",
                  data: res.onboarding_results.map((x) => x.number_onboarded),
                },
              ],
              rawData: res.onboarding_results,
            };
            this.setState({ reportOnboarding: temp });
          }
        }
      )
    );
  };

  fetchReportReputation = () => {
    this.props.dispatch(
      getReportReputation(
        { year: this.state.yearReputation },
        () => {
          this.props.dispatch(showCanvas());
        },
        async (res) => {
          this.props.dispatch(hideCanvas());
          if (res.success) {
            const temp = {
              xAxis: res.rep_results[0].rep_results.map((x) => x.month),
              data: res.rep_results.map((user) => ({
                name: user.username,
                data: user.rep_results.map((x) => x.total),
              })),
              rawData: res.rep_results,
            };
            this.setState({ reportReputation: temp });
          }
        }
      )
    );
  };

  fetchReportTotalRep = () => {
    this.props.dispatch(
      getReportTotalRep(
        { year: this.state.yearTotalRep },
        () => {
          this.props.dispatch(showCanvas());
        },
        async (res) => {
          this.props.dispatch(hideCanvas());
          if (res.success) {
            const temp = {
              data: res.rep_results.map((user) => ({
                label: user.username,
                value: user.total_rep,
              })),
            };
            this.setState({ reportTotalRep: temp });
          }
        }
      )
    );
  };

  download = () => {
    this.props.dispatch(setActiveModal("export-report-selection"));
  };

  handleChangeOnboarding = (e) => {
    this.setState({ yearOnboarding: e.target.value }, () => {
      this.fetchReportOnboarding();
    });
  };

  handleChangeReputation = (e) => {
    this.setState({ yearReputation: e.target.value }, () => {
      this.fetchReportReputation();
    });
  };

  handleChangeTotalRep = (e) => {
    this.setState({ yearTotalRep: e.target.value }, () => {
      this.fetchReportTotalRep();
    });
  };

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    if (!authUser.is_admin) return <Redirect to="/" />;

    return (
      <div id="report-page" className="pb-8 flex flex-col gap-4">
        <div className="flex justify-end">
          <Button
            onClick={() => this.download()}
          >
            Export Report
          </Button>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between w-full">
              <h3 className="font-bold">Onboarding Stats</h3>
              <select
                value={this.state.yearOnboarding}
                className="mr-3"
                onChange={(e) => this.handleChangeOnboarding(e)}
              >
                {[...Array(this.state.currentYear - FROM_YEAR + 1).keys()].map(
                  (x) => (
                    <option key={x} value={FROM_YEAR + x}>
                      {FROM_YEAR + x}
                    </option>
                  )
                )}
              </select>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-128">
              <LineChart
                name="Voting Associates Onboard by Month"
                xAxis={this.state.reportOnboarding?.xAxis}
                data={this.state.reportOnboarding?.data}
              />
            </div>
            <div className="my-5">
              {this.state.reportOnboarding?.rawData && <OnboardingStats data={this.state.reportOnboarding?.rawData} />}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between w-full">
              <h3 className="font-bold">Total reputation by User</h3>
              <select
                value={this.state.yearReputation}
                className="mr-3"
                onChange={(e) => this.handleChangeReputation(e)}
              >
                {[...Array(this.state.currentYear - FROM_YEAR + 1).keys()].map(
                  (x) => (
                    <option key={x} value={FROM_YEAR + x}>
                      {FROM_YEAR + x}
                    </option>
                  )
                )}
              </select>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-128">
              <LineChart
                name=""
                xAxis={this.state.reportReputation?.xAxis}
                data={this.state.reportReputation?.data}
                strokeWidth={1}
              />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between w-full">
              <h3 className="font-bold">Relative Voting Weights</h3>
              <select
                value={this.state.yearTotalRep}
                className="mr-3"
                onChange={(e) => this.handleChangeTotalRep(e)}
              >
                {[...Array(this.state.currentYear - FROM_YEAR + 1).keys()].map(
                  (x) => (
                    <option key={x} value={FROM_YEAR + x}>
                      {FROM_YEAR + x}
                    </option>
                  )
                )}
              </select>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-128">
              <PieChart
                name="Relative Voting Weights (Reputation)"
                data={this.state.reportTotalRep?.data}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Report));
