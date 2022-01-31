/* eslint-disable no-undef */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import { PageHeaderComponent } from "@shared/components";
import { Card, CardHeader, CardBody, Button } from '@shared/partials';
import {
  setActiveModal,
  showAlert,
  showCanvas,
  hideCanvas,
  setCustomModalData,
  setRefreshSingleUserPage,
  setKYCData,
} from "@redux/actions";
import {
  banUser,
  unbanUser,
  getSingleUserByAdmin,
  approveKYC,
  denyKYC,
  getReputationByUser,
  downloadCSVUserRep,
  exportProposalMentor,
  sendKycKangarooByAdmin,
} from "@utils/Thunk";
import ProposalsView from "./proposals";
import VotesView from "./votes";
import ReputationView from "./reputation";
import ProposalMentorView from "./proposal-mentor";
import { DECIMALS } from "@utils/Constant";

// eslint-disable-next-line no-undef
const moment = require("moment");

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    refreshSingleUserPage: state.admin.refreshSingleUserPage,
  };
};

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      user: {},
      loading: false,
      totalStaked: 0,
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    const userId = params.userId;
    this.setState({ userId }, () => {
      this.getUser();
    });
    this.props.dispatch(
      getReputationByUser(
        userId,
        params,
        () => {},
        (res) => {
          this.setState({
            totalStaked: res.total_staked,
          });
        }
      )
    );
    document.body.classList.add('scroll-window');
  }

  componentWillUnmount() {
    document.body.classList.remove('scroll-window');
  }

  componentDidUpdate(prevProps) {
    const { refreshSingleUserPage } = this.props;
    if (!prevProps.refreshSingleUserPage && refreshSingleUserPage) {
      this.getUser();
      this.props.dispatch(setRefreshSingleUserPage(false));
    }
  }

  getUser() {
    const { userId, loading } = this.state;
    if (loading) return;

    this.props.dispatch(
      getSingleUserByAdmin(
        userId,
        () => {
          this.setState({ loading: true });
          this.props.dispatch(showCanvas());
        },
        (res) => {
          const user = res.user || {};
          this.setState({ user, loading: false });
          this.props.dispatch(hideCanvas());
        }
      )
    );
  }

  // Click Reset Password
  clickResetPassword = (e) => {
    e.preventDefault();
    const { user } = this.state;
    this.props.dispatch(
      setCustomModalData({
        "reset-password": {
          render: true,
          title: "You are resetting password of this user",
          data: user,
        },
      })
    );
    this.props.dispatch(setActiveModal("custom-global-modal"));
  };

  // Click Add Reputation
  clickAddRep = async (e) => {
    e.preventDefault();
    const { user } = this.state;
    await this.props.dispatch(
      setCustomModalData({
        "add-reputation": {
          render: true,
          title: "You are adding to this users reputation score",
          data: user,
        },
      })
    );
    await this.props.dispatch(setActiveModal("custom-global-modal"));
  };

  // Click Sub Reputation
  clickSubRep = async (e) => {
    e.preventDefault();
    const { user } = this.state;
    await this.props.dispatch(
      setCustomModalData({
        "sub-reputation": {
          render: true,
          title: "You are subtracting from this users reputation score",
          data: user,
        },
      })
    );
    await this.props.dispatch(setActiveModal("custom-global-modal"));
  };

  // Click Change User Type
  clickChangeUserType = async (e) => {
    e.preventDefault();
    const { user } = this.state;
    await this.props.dispatch(
      setCustomModalData({
        "change-user-type": {
          render: true,
          title: "You are changing this users type",
          data: user,
        },
      })
    );
    await this.props.dispatch(setActiveModal("custom-global-modal"));
  };

  // Click Change User AML
  clickChangeUserAML = async (e, field, value) => {
    e.preventDefault();
    const { user } = this.state;
    await this.props.dispatch(
      setCustomModalData({
        "change-user-aml": {
          render: true,
          title: "Please enter the updated information",
          data: user,
          field,
          value,
        },
      })
    );
    await this.props.dispatch(setActiveModal("custom-global-modal"));
  };

  // Click Change User AML
  clickChangeShuftiRef = async (e) => {
    e.preventDefault();
    const { user } = this.state;
    await this.props.dispatch(setActiveModal("shufti-ref-change", { user }));
  };

  downloadCSV = () => {
    const { user } = this.state;
    this.props.dispatch(
      downloadCSVUserRep(
        user.id,
        this.state.params,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `user-${user.id}-rep.csv`);
          document.body.appendChild(link);
          link.click();
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  downloadCSVMentor = () => {
    const { user } = this.state;
    this.props.dispatch(
      exportProposalMentor(
        user.id,
        this.state.params,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `user-mentor.csv`);
          document.body.appendChild(link);
          link.click();
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  banUser = (e) => {
    e.preventDefault();
    const { user } = this.state;

    if (!window.confirm("Are you sure you are going to ban this user?")) return;

    this.props.dispatch(
      banUser(
        user.id,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            this.props.dispatch(
              showAlert("You've successfully banned this user", "success")
            );
            this.getUser();
          }
        }
      )
    );
  };

  unbanUser = (e) => {
    e.preventDefault();
    const { user } = this.state;

    if (!window.confirm("Are you sure you are going to unban this user?")) return;

    this.props.dispatch(
      unbanUser(
        user.id,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            this.props.dispatch(
              showAlert("You've successfully unbanned this user", "success")
            );
            this.getUser();
          }
        }
      )
    );
  };

  clickApprove = (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you are going to approve this KYC?")) return;
    const { user } = this.state;
    this.props.dispatch(
      approveKYC(
        user.id,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) this.getUser();
        }
      )
    );
  };

  sendKYC = (item) => {
    this.props.dispatch(
      sendKycKangarooByAdmin(
        { user_id: item?.id },
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res.success) {
            this.props.dispatch(
              setActiveModal("confirm-kyc-link", { email: item?.email })
            );
          }
          this.getUser();
        }
      )
    );
  };

  clickDeny = (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you are going to deny this KYC?")) return;
    const { user } = this.state;
    this.props.dispatch(
      denyKYC(
        user.id,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) this.getUser();
        }
      )
    );
  };

  clickReset = (e) => {
    const { user } = this.state;
    e.preventDefault();
    this.props.dispatch(setKYCData(user));
    this.props.dispatch(setActiveModal("reset-kyc"));
  };

  renderButtons() {
    const { user } = this.state;
    const upbuttons = [];
    const downbuttons = [];
    const thirdButtons = [];

    if (!user.banned) {
      upbuttons.push(
        <Button
          color="danger"
          size="sm"
          key="button_ban"
          onClick={this.banUser}
        >
          Ban User
        </Button>
      );
    } else {
      upbuttons.push(
        <Button
          color="danger"
          variant="outline"
          size="sm"
          key="button_unban"
          onClick={this.unbanUser}
        >
          Unban User
        </Button>
      );
    }

    upbuttons.push(
      <Button
        color="success"
        size="sm"
        key="button_reset"
        onClick={this.clickResetPassword}
      >
        Reset Password
      </Button>
    );

    upbuttons.push(
      <Button
        color="success"
        variant="outline"
        className="px-2"
        size="sm"
        key="button_change_ut"
        onClick={this.clickChangeUserType}
      >
        Change User Type
      </Button>
    );

    downbuttons.push(
      <Button
        size="sm"
        color="primary"
        key="button_add_r"
        onClick={this.clickAddRep}
      >
        Add Reputation
      </Button>
    );

    downbuttons.push(
      <Button
        color="primary"
        variant="outline"
        size="sm"
        key="button_subtract_r"
        onClick={this.clickSubRep}
        className="px-2"
      >
        Subtract Reputation
      </Button>
    );

    if (user && user.shuftipro && user.shuftipro.id) {
      const shuftipro = user.shuftipro;
      if (!shuftipro.reviewed && shuftipro.status != "approved") {
        thirdButtons.push(
          <Button
            color="warning"
            variant="outline"
            size="sm"
            key="button_approve_kyc"
            onClick={this.clickApprove}
          >
            Approve KYC
          </Button>
        );

        thirdButtons.push(
          <Button
            color="danger"
            variant="outline"
            size="sm"
            key="button_deny_kyc"
            onClick={this.clickDeny}
          >
            Deny KYC
          </Button>
        );

        thirdButtons.push(
          <Button
            color="secondary"
            size="sm"
            key="button_reset_kyc"
            onClick={this.clickReset}
          >
            Reset KYC
          </Button>
        );
      }
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-8">{upbuttons}</div>
        <div className="flex gap-8">{downbuttons}</div>
        <div className="flex gap-8">{thirdButtons}</div>
      </div>
    );
  }

  renderShuftiproStatus() {
    const { user } = this.state;
    if (user.shuftipro && user.shuftipro.id) {
      if (user.shuftipro.status == "approved") return "Approved";
      return "Denied";
    }

    if (user.shuftipro_temp && user.shuftipro_temp.status != "pending")
      return "Submitted";
    return "Not Submitted";
  }

  renderKYCInfo() {
    const { authUser } = this.props;
    const { user } = this.state;
    let approvedAt = null;
    let approver = null;
    if (user.shuftipro && user.shuftipro.manual_approved_at)
      approvedAt = moment(user.shuftipro.manual_approved_at + ".000Z").format(
        "M/D/YYYY"
      );
    if (user.shuftipro && user.shuftipro.manual_reviewer)
      approver = user.shuftipro.manual_reviewer;
    const new_kyc = user.shuftipro_temp?.invite_id;
    let data;
    if (user.shuftipro?.data) data = JSON.parse(user.shuftipro?.data);
    if (!new_kyc) {
      return (
        <table>
          <tr>
            <td className="font-bold w-80">Date of Birth</td>
            <td>{user.profile.dob}</td>
          </tr>
          <tr>
            <td className="font-bold w-80">Country of Citizenship</td>
            <td>{user.profile.country_citizenship}</td>
          </tr>
          <tr>
            <td className="font-bold w-80">Country of Residence</td>
            <td>{user.profile.country_residence}</td>
          </tr>
          <tr>
            <td className="font-bold w-80">Address</td>
            <td>
              {user.profile.address}
              {authUser.is_admin && (
                <Button
                  size="xs"
                  className="ml-4"
                  onClick={(e) =>
                    this.clickChangeUserAML(
                      e,
                      "address",
                      user.profile.address
                    )
                  }
                >
                  Edit
                </Button>
                )}
            </td>
          </tr>
          <tr>
            <td className="font-bold w-80">City</td>
            <td>
              {user.profile.city}
              {authUser.is_admin && (
                <Button
                  className="ml-4"
                  size="xs"
                  onClick={(e) =>
                    this.clickChangeUserAML(e, "city", user.profile.city)
                  }
                >
                  Edit
                </Button>
                )}
            </td>
          </tr>
          <tr>
            <td className="font-bold w-80">Postal / Zip Code</td>
            <td>
              {user.profile.zip}
              {authUser.is_admin && (
                <Button
                  className="ml-4"
                  size="xs"
                  onClick={(e) =>
                    this.clickChangeUserAML(e, "zip", user.profile.zip)
                  }
                >
                  Edit
                </Button>
                )}
            </td>
          </tr>
          <tr>
            <td className="font-bold w-80">Overall Status</td>
            <td>
              {this.renderShuftiproStatus()}
              {(!user.shuftipro_temp ||
                user.shuftipro_temp?.status === "pending") &&
                !!authUser.is_admin && (
                  <Button
                    className="ml-4"
                    size="xs"
                    onClick={() => this.sendKYC(user)}
                  >
                    Update
                  </Button>
                )}
            </td>
          </tr>
          {user.shuftipro && (
            <tr>
              <td className="font-bold w-80">Shufti Ref #</td>
              <td>
                {user.shuftipro?.reference_id}
                {authUser.is_admin && (
                  <Button
                    className="ml-4"
                    size="xs"
                    onClick={(e) =>
                      this.clickChangeShuftiRef(e, "zip", user.profile.zip)
                    }
                  >
                    Add/Update
                  </Button>
                )}
              </td>
            </tr>
          )}
          {approvedAt ? (
            <tr>
              <td className="font-bold w-80">Manually Approved At</td>
              <td>{approvedAt}</td>
            </tr>
          ) : null}
          {approver ? (
            <tr>
              <td className="font-bold w-80">Manually Approved By</td>
              <td>{approver}</td>
            </tr>
          ) : null}
        </table>
      );
    } else {
      return (
        <table>
          <tr>
            <td className="font-bold w-80">KycKangaroo status</td>
            <td className="text-capitalize">{user?.shuftipro?.status}</td>
          </tr>
          <tr>
            <td className="font-bold w-80">Invite ID</td>
            <td>{user?.shuftipro_temp?.invite_id}</td>
          </tr>
          <tr>
            <td className="font-bold w-80">Shufti REFID</td>
            <td>{user?.shuftipro?.reference_id}</td>
          </tr>
          <tr>
            <td className="font-bold w-80">Name Verified in KYC kangaroo</td>
            <td>
              {data?.address_document?.name?.first_name}{" "}
              {data?.address_document?.name?.last_name}
            </td>
          </tr>
          <tr>
            <td className="font-bold w-80">Address Verified in KYC kangaroo</td>
            <td>{data?.address_document?.full_address}</td>
          </tr>
          <tr>
            <td className="font-bold w-80">Country Verified in KYC kangaroo</td>
            <td>{data?.address_document?.country}</td>
          </tr>
        </table>
      );
    }
  }

  renderHellosignForm() {
    const { user } = this.state;
    const { profile } = user;
    if (profile.hellosign_form) {
      return (
        <a
          target="_blank"
          rel="noreferrer"
          href={process.env.REACT_APP_BACKEND_URL + profile.hellosign_form}
          className="text-underline"
        >
          Click Here
        </a>
      );
    }
    return null;
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    if (!authUser.is_admin) return <Redirect to="/" />;

    const { loading, user, totalStaked } = this.state;
    if (loading) return null;
    if (!user || !user.id) return <div>{`We can't find any details`}</div>;

    return (
      <>
      <div className="flex flex-col gap-4 pb-8">
        <PageHeaderComponent title="Back" />
        <Card>
          <CardHeader>
            <h3 className="font-bold">Basic Info</h3>
          </CardHeader>
          <CardBody>
            <table>
              <tr>
                <td className="font-bold w-80">User ID</td>
                <td>{user.id}</td>
              </tr>
              <tr>
                <td className="font-bold w-80">User Type</td>
                <td> {user.is_member
                        ? "Voting Associate"
                        : user.is_participant
                        ? "Associate"
                        : "Guest"}
                </td>
              </tr>
              <tr>
                <td className="font-bold w-80">V%</td>
                <td>
                  {user.total_voted && user.total_informal_votes
                    ? (
                        (user.total_voted / user.total_informal_votes) *
                        100
                      ).toFixed(DECIMALS)
                    : 0}
                  %  
                </td>
              </tr>
              <tr>
                <td className="font-bold w-80">Registration Date</td>
                <td>
                  {moment(user.created_at).format("M/D/YYYY")}
                </td>
              </tr>
              <tr>
                <td className="font-bold w-80">Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td className="font-bold w-80">Telegram</td>
                <td>{user.profile?.telegram}</td>
              </tr>
              <tr>
                <td className="font-bold w-80">First Name</td>
                <td>{user.first_name}</td>
              </tr>
              <tr>
                <td className="font-bold w-80">Last Name</td>
                <td>{user.last_name}</td>
              </tr>
              <tr>
                <td className="font-bold w-80">Forum Name</td>
                <td>{user.profile.forum_name}</td>
              </tr>
              <tr>
                <td className="font-bold w-80">Company Name</td>
                <td>{user.company}</td>
              </tr>
              <tr>
                <td className="font-bold w-80">Associate Agreement</td>
                <td>{this.renderHellosignForm()}</td>
              </tr>
              <tr>
                <td className="font-bold w-80">Associate Agreement Timestamp</td>
                <td>
                  {moment(
                    user?.profile?.associate_agreement_at + ".000Z"
                  ).format("MM/DD/YYYY hh:mm")}
                </td>
              </tr>
              {user.member_no ? (
                  <tr>
                    <td className="font-bold w-80">Voting Associate #</td>
                    <td>
                      {user.member_no}
                    </td>
                  </tr>
                ) : null}
              {user.member_at ? (
                <tr className="app-sup-row">
                  <td className="font-bold w-80">Voting Promotion Date</td>
                  <td>
                    {moment(user.member_at + ".000Z").format("M/D/YYYY")}
                  </td>
                </tr>
              ) : null}
            </table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-bold">KYC / AML Info</h3>
          </CardHeader>
          <CardBody>
            {this.renderKYCInfo()}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-bold">Proposals ( as OP )</h3>
          </CardHeader>
          <CardBody>
            <div className="h-96">
              <ProposalsView userId={user.id} />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-bold">Votes</h3>
          </CardHeader>
          <CardBody>
            <div className="h-96">
              <VotesView userId={user.id} />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between w-full">
              <h3 className="font-bold">Reputation</h3>
              <Button
                size="sm"
                onClick={() => this.downloadCSV()}
              >
                Download
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <table>
              <tr>
                <td className="font-bold w-80">Total</td>
                <td> 
                  {(user.profile.rep + Math.abs(totalStaked))?.toFixed(
                      DECIMALS
                  )}
                </td>
              </tr>
              <tr>
                <td className="font-bold w-80">Staked</td>
                <td>
                  {Math.abs(totalStaked)?.toFixed(DECIMALS)}
                </td>
              </tr>
              <tr>
                <td className="font-bold w-80">Available</td>
                <td>
                  {user.profile.rep?.toFixed(DECIMALS)}
                </td>
              </tr>
              <tr>
                <td className="font-bold w-80">Minted Pending</td>
                <td>
                  {user.profile.rep_pending?.toFixed(DECIMALS)}
                </td>
              </tr>
            </table>
            <div className="mt-8 h-96">
              <ReputationView userId={user.id} />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between w-full">
              <h3 className="font-bold">Mentor Hours</h3>
              <Button
                size="sm"
                onClick={() => this.downloadCSVMentor()}
              >
                Download
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-96">
              <ProposalMentorView userId={user.id} />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-bold">Admin Functions</h3>
          </CardHeader>
          <CardBody>
            {this.renderButtons()}
          </CardBody>
        </Card>
      </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(withRouter(SingleUser));
