import React, { Component, useRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as Icon from "react-feather";
import { Checkbox } from "shared/components";
import { useDelayInput } from 'shared/hooks/useDelayInput';
import { Card, CardHeader, CardBody, Button } from 'shared/partials';
import {
  getReputationTrack,
  postRepDailyCsv,
} from "utils/Thunk";
import "./reputation.scss";
import { DECIMALS } from "utils/Constant";
import { hideCanvas, showCanvas } from "redux/actions";
import RepTable from './rep-table';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

const RepCard = ({ type }) => {
  const { params, setSearchTerm } = useDelayInput();
  const ref = useRef();

  const onDownload = () => {
    ref.current?.downloadCSV();
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg">Reputation Tracking</h3>
          <div className="flex gap-8">
            <Button color="secondary" size="md" onClick={onDownload}>Download</Button>
            <input
              className="text-xs"
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <RepTable ref={ref} outParams={params} type={type} />
      </CardBody>
    </Card>
  )
}
class Reputation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: "",
      daily_email: false,
    };

    this.$elem = null;
    this.timer = null;
  }

  componentDidMount() {
    const { authUser } = this.props;
    this.setState({ daily_email: authUser.notice_send_repatution });
    this.getReputation();
  }

  getReputation() {
    this.props.dispatch(
      getReputationTrack(
        {},
        () => {},
        (res) => {
          this.setState({
            total: res.total,
          });
        }
      )
    );
  }

  toggleDailyEmail(e) {
    const value = e ? 1 : 0;
    this.setState({ daily_email: value });
    this.props.dispatch(
      postRepDailyCsv(
        { setting: value },
        () => {
          this.props.dispatch(showCanvas());
        },
        () => {
          this.props.dispatch(hideCanvas());
        }
      )
    );
  }

  renderTotal() {
    const { total } = this.state;
    const { authUser } = this.props;

    let totalV = parseFloat(total) + parseFloat(authUser.profile.rep);

    return totalV?.toFixed?.(DECIMALS);
  }

  render() {
    const { total } = this.state;
    const { authUser } = this.props;

    if (!authUser || !authUser.id) return null;

    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl flex gap-6">
              My Available Reputation:
              <span className="flex gap-2"><Icon.Droplet /> {authUser.profile.rep?.toFixed?.(DECIMALS)}</span>
            </h3>
            <label>
              Total: <span className="pl-2">{this.renderTotal()}</span>
            </label>
            <label>
              Staked: <span className="pl-2">{total?.toFixed?.(DECIMALS)}</span>
            </label>
            <label>
              Minted Pending:
              <span className="pl-2">{authUser.profile.rep_pending?.toFixed?.(DECIMALS)}</span>
            </label>
          </div>
          <Checkbox
            value={this.state.daily_email}
            onChange={(e) => this.toggleDailyEmail(e)}
            text="Daily CSV email"
          />
        </div>
        <div className="flex-1 min-h-0">
          <RepCard />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Reputation));