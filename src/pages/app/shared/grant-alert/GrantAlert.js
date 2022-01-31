import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getMyPaymentProposals } from "@utils/Thunk";
import { Button } from '@shared/partials';
import { ReactComponent as SettingIcon } from "@assets/icons/ic-settings.svg";
import Banner from '@shared/components/banner';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    activeProposalTableStatus: state.admin.activeProposalTableStatus,
  };
};

class GrantAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      proposals: [],
    };
  }

  componentDidMount() {
    this.getPaymentProposals();
  }

  componentDidUpdate(prevProps) {
    const { activeProposalTableStatus } = this.props;
    if (!prevProps.activeProposalTableStatus && activeProposalTableStatus) {
      this.getPaymentProposals();
    }
  }

  getPaymentProposals() {
    this.props.dispatch(
      getMyPaymentProposals(
        () => {
          this.setState({ loading: true });
        },
        (res) => {
          const proposals = res.proposals || [];
          this.setState({ proposals, loading: false });
        }
      )
    );
  }

  render() {
    // const { authUser } = this.props;
    // const { loading, proposals } = this.state;
    // if (!authUser || !authUser.id) return null;
    // if (loading || !proposals.length) return null;

    // Associate or Voting Associate
    return (
      <Banner>
        <div className="flex gap-6">
          <SettingIcon />
          <div>
            <h6 className="text-base mb-1">
              Way to go! You have a grant active. Need to submit a milestone for
              review and payment?
            </h6>
            <p className="text-xs">{`Go to your "My Grants" section in the left sidebar menu to submit milestones once work is complete.`}</p>
          </div>
        </div>
        <div className="d-flex flex-column actions">
          <Button color="secondary2" to="/app/grants" size="md">
            My Grants
          </Button>
        </div>
      </Banner>
    );
  }
}

export default connect(mapStateToProps)(withRouter(GrantAlert));
