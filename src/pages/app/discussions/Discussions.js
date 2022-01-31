import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DiscussionsTable from "../shared/discussions";
import { Tab, Card, CardHeader, CardBody } from 'shared/partials';
import { useDelayInput } from 'shared/hooks/useDelayInput';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

const DiscussionView = ({ type }) => {
  const { params, setSearchTerm } = useDelayInput();

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-lg">Proposals</h3>
          <input
            className="text-xs"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody>
        <DiscussionsTable outParams={params} type={type} />
      </CardBody>
    </Card>
  )
}

const tabsData = [
  {
    content: () => <DiscussionView type='active' />,
    id: 'active',
    title: 'Active',
  },
  {
    content: () => <DiscussionView type='completed' />,
    id: 'completed',
    title: 'Completed',
  },
];
class Discussions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "active",
    };
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <Tab tabs={tabsData} />
    );
  }
}

export default connect(mapStateToProps)(withRouter(Discussions));
