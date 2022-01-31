import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import { Switch } from '@mui/material';
import {
  getEmailerData,
  updateEmailerTriggerAdmin,
  deleteEmailerAdmin,
  updateEmailerTriggerUser,
  updateEmailerTriggerMember,
} from "@utils/Thunk";
import { Card, CardHeader, CardBody, Button, Table } from '@shared/partials';
import {
  showCanvas,
  hideCanvas,
  setCustomModalData,
  setActiveModal,
  showAlert,
} from "@redux/actions";
import styles from './style.module.scss';

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    settings: state.global.settings,
    customModalData: state.global.customModalData,
  };
};

class Emailer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      triggerAdmin: [],
      triggerUser: [],
      triggerMember: [],
    };
  }

  componentDidMount() {
    this.getEmailerData();
    document.body.classList.add('scroll-window');
  }

  componentWillUnmount() {
    document.body.classList.remove('scroll-window');
  }

  componentDidUpdate(prevProps) {
    const { customModalData } = this.props;
    const { customModalData: customModalDataPrev } = prevProps;

    if (
      (!customModalData["add-emailer-admin"] ||
        !customModalData["add-emailer-admin"].render) &&
      customModalDataPrev["add-emailer-admin"] &&
      customModalDataPrev["add-emailer-admin"].render
    ) {
      this.getEmailerData();
    }
  }

  // Get Emailer Data
  getEmailerData() {
    this.props.dispatch(
      getEmailerData(
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          const data = res.data || {};
          const admins = data.admins || [];
          const triggerAdmin = data.triggerAdmin || [];
          const triggerUser = data.triggerUser || [];
          const triggerMember = data.triggerMember || [];
          this.setState({
            admins,
            triggerAdmin,
            triggerUser,
            triggerMember,
          });
        }
      )
    );
  }

  // Click Add
  clickAdd = (e) => {
    e.preventDefault();
    this.props.dispatch(
      setCustomModalData({
        "add-emailer-admin": {
          render: true,
          title: "Add a new recipient of admin email alerts.",
        },
      })
    );
    this.props.dispatch(setActiveModal("custom-global-modal"));
  };

  // Click Remove
  clickRemove = (item) => {
    if (!window.window.confirm("Are you sure you are going to remove this emailer admin?"))
      return;
    this.props.dispatch(
      deleteEmailerAdmin(
        item.id,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) this.getEmailerData();
        }
      )
    );
  };

  // Render Infinite Header
  renderHeader() {
    return (
      <div className="infinite-header">
        <div className="infinite-headerInner">
          <div className="c-col-1 c-cols">
            <label className="font-size-14">Email</label>
          </div>
          <div className="c-col-2 c-cols">
            <label className="font-size-14">Action</label>
          </div>
        </div>
      </div>
    );
  }

  // Render Admins
  renderAdmins() {
    const { admins } = this.state;
    const items = [];

    if (!admins || !admins.length) {
      return (
        <div id="infinite-no-result">
          <label className="font-size-14">No Results Found</label>
        </div>
      );
    }

    admins.forEach((item) => {
      items.push(
        <li key={`proposal_${item.id}`}>
          <div className="infinite-row">
            <div className="c-col-1 c-cols">
              <label className="font-size-14">{item.email}</label>
            </div>
            <div className="c-col-2 c-cols">
              <label className="font-size-14">
                <Button size="sm" color="danger"
                  onClick={() => this.clickRemove(item)}
                >
                  Remove
                </Button>
              </label>
            </div>
          </div>
        </li>
      );
    });
    return <ul>{items}</ul>;
  }

  // Trigger Admin
  changeTriggerAdmin = (e, item, index) => {
    let { triggerAdmin } = this.state;
    const itemNew = {
      ...item,
      enabled: e.target.checked,
    };
    triggerAdmin[index] = {
      ...triggerAdmin[index],
      ...itemNew,
    };
    this.setState({ triggerAdmin }, () => {
      this.props.dispatch(
        updateEmailerTriggerAdmin(item.id, itemNew, null, null)
      );
    });
  };

  // Trigger Member
  changeTriggerMember = (e, item, index) => {
    let { triggerMember } = this.state;
    const itemNew = {
      ...item,
      enabled: e.target.checked,
    };
    triggerMember[index] = {
      ...triggerMember[index],
      ...itemNew,
    };
    this.setState({ triggerMember }, () => {
      this.props.dispatch(
        updateEmailerTriggerMember(item.id, itemNew, null, null)
      );
    });
  };

  //
  changeTriggerUserMessage = (e, item, index) => {
    let { triggerUser } = this.state;
    const itemNew = {
      ...item,
      content: e.target.value,
    };
    triggerUser[index] = {
      ...triggerUser[index],
      ...itemNew,
    };
    this.setState({ triggerUser });
  };

  //
  changeTriggerMemberMessage = (e, item, index) => {
    let { triggerMember } = this.state;
    const itemNew = {
      ...item,
      content: e.target.value,
    };
    triggerMember[index] = {
      ...triggerMember[index],
      ...itemNew,
    };
    this.setState({ triggerMember });
  };

  //
  saveTriggerUser = (e, index) => {
    e.preventDefault();
    const { triggerUser } = this.state;
    const item = triggerUser[index];
    if (!item.content || !item.content.trim()) {
      this.props.dispatch(showAlert("Please input message content"));
      return;
    }

    this.props.dispatch(
      updateEmailerTriggerUser(
        item.id,
        item,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success)
            this.disableTriggerUserEdit(null, item, index);
        }
      )
    );
  };

  //
  saveTriggerMember = (e, index) => {
    e.preventDefault();
    const { triggerMember } = this.state;
    const item = triggerMember[index];
    if (!item.content || !item.content.trim()) {
      this.props.dispatch(showAlert("Please input message content"));
      return;
    }

    this.props.dispatch(
      updateEmailerTriggerMember(
        item.id,
        item,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success)
            this.disableTriggerMemberEdit(null, item, index);
        }
      )
    );
  };

  // Trigger User
  changeTriggerUser = (e, item, index) => {
    let { triggerUser } = this.state;
    const itemNew = {
      ...item,
      enabled: e.target.checked,
    };
    triggerUser[index] = {
      ...triggerUser[index],
      ...itemNew,
    };
    this.setState({ triggerUser }, () => {
      this.props.dispatch(
        updateEmailerTriggerUser(item.id, itemNew, null, null)
      );
    });
  };

  // Trigger Member
  changeTriggerMember = (e, item, index) => {
    let { triggerMember } = this.state;
    const itemNew = {
      ...item,
      enabled: e.target.checked,
    };
    triggerMember[index] = {
      ...triggerMember[index],
      ...itemNew,
    };
    this.setState({ triggerMember }, () => {
      this.props.dispatch(
        updateEmailerTriggerMember(item.id, itemNew, null, null)
      );
    });
  };

  //
  enableTriggerUserEdit = (e, item, index) => {
    e.preventDefault();
    let { triggerUser } = this.state;
    const itemNew = {
      ...item,
      editing: true,
    };
    triggerUser[index] = {
      ...triggerUser[index],
      ...itemNew,
    };
    this.setState({ triggerUser });
  };

  //
  enableTriggerMemberEdit = (e, item, index) => {
    e.preventDefault();
    let { triggerMember } = this.state;
    const itemNew = {
      ...item,
      editing: true,
    };
    triggerMember[index] = {
      ...triggerMember[index],
      ...itemNew,
    };
    this.setState({ triggerMember });
  };

  //
  disableTriggerUserEdit = (e, item, index) => {
    if (e) e.preventDefault();
    let { triggerUser } = this.state;
    const itemNew = {
      ...item,
      editing: false,
    };
    triggerUser[index] = {
      ...triggerUser[index],
      ...itemNew,
    };
    this.setState({ triggerUser });
  };

  //
  disableTriggerMemberEdit = (e, item, index) => {
    if (e) e.preventDefault();
    let { triggerMember } = this.state;
    const itemNew = {
      ...item,
      editing: false,
    };
    triggerMember[index] = {
      ...triggerMember[index],
      ...itemNew,
    };
    this.setState({ triggerMember });
  };

  // Render Admin Section
  renderTriggerAdmin() {
    const { triggerAdmin } = this.state;
    const items = [];
    if (triggerAdmin && triggerAdmin.length) {
      triggerAdmin.forEach((item, index) => {
        items.push(
          <div className="d-emailer-item" key={`d-emailer-item-${index}`}>
            <div>
              <Switch
                checked={item.enabled ? true : false}
                onChange={(e) => this.changeTriggerAdmin(e, item, index)}
                color="primary"
              />
              <label>{item.title}</label>
            </div>
            <p className="bg-white1 rounded-md px-4 py-2">{item.content}</p>
          </div>
        );
      });
    }
    return items;
  }

  // Render User Section
  renderTriggerUser() {
    const { triggerUser } = this.state;
    const items = [];
    if (triggerUser && triggerUser.length) {
      triggerUser.forEach((item, index) => {
        items.push(
          <div className="d-emailer-item" key={`d-emailer-item-${index}`}>
            <div>
              <Switch
                checked={item.enabled ? true : false}
                onChange={(e) => this.changeTriggerUser(e, item, index)}
                color="primary"
              />
              <label>{item.title}</label>
            </div>
            {item.editing ? (
              <textarea
                className="w-full bg-white1 rounded-md px-4 py-2"
                value={item.content}
                onChange={(e) => this.changeTriggerUserMessage(e, item, index)}
              ></textarea>
            ) : (
              <p className="bg-white1 rounded-md px-4 py-2">{item.content}</p>
            )}
            <div className="mt-2">
              {item.editing ? (
                <>
                  <Button
                    color="success"
                    size="sm"
                    style={{ marginRight: "10px" }}
                    onClick={(e) => this.saveTriggerUser(e, index)}
                  >
                    Save
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={(e) => this.disableTriggerUserEdit(e, item, index)}
                  >
                    Cancel Edit
                  </Button>
                </>
              ) : (
                <Button
                  color="secondary"
                  size="sm"
                  onClick={(e) => this.enableTriggerUserEdit(e, item, index)}
                >
                  Edit Message
                </Button>
              )}
            </div>
          </div>
        );
      });
    }
    return items;
  }

  // Render Member Section
  renderTriggerMember() {
    const { triggerMember } = this.state;
    const items = [];
    if (triggerMember && triggerMember.length) {
      triggerMember.forEach((item, index) => {
        items.push(
          <div className="d-emailer-item" key={`d-emailer-item-${index}`}>
            <div>
              <Switch
                checked={item.enabled ? true : false}
                onChange={(e) => this.changeTriggerMember(e, item, index)}
                color="primary"
              />
              <label>{item.title}</label>
            </div>
            {item.editing ? (
              <textarea
                value={item.content}
                className="w-full bg-white1 rounded-md px-4 py-2"
                onChange={(e) =>
                  this.changeTriggerMemberMessage(e, item, index)
                }
              ></textarea>
            ) : (
              <p className="bg-white1 rounded-md px-4 py-2">{item.content}</p>
            )}
            <div className="mt-2">
              {item.editing ? (
                <>
                  <Button
                    color="success"
                    size="sm"
                    style={{ marginRight: "10px" }}
                    onClick={(e) => this.saveTriggerMember(e, index)}
                  >
                    Save
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={(e) => this.disableTriggerMemberEdit(e, item, index)}
                  >
                    Cancel Edit
                  </Button>
                </>
              ) : (
                <Button
                  color="secondary"
                  size="sm"
                  onClick={(e) => this.enableTriggerMemberEdit(e, item, index)}
                >
                  Edit Message
                </Button>
              )}
            </div>
          </div>
        );
      });
    }
    return items;
  }

  render() {
    const { admins } = this.state;
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    if (!authUser.is_admin) return <Redirect to="/" />;

    return (
      <div className="flex flex-col gap-4 pb-4">
        <Card>
          <CardHeader>
            <h3 className="font-bold">Emailer Admins</h3>
          </CardHeader>
          <CardBody>
            <Table className="mb-10" styles={styles} hasMore={false} dataLength={admins.length}>
              <Table.Header>
                <Table.HeaderCell>
                  Email
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Action
                </Table.HeaderCell>
              </Table.Header>
              <Table.Body className="padding-tracker">
                {admins.map((row, ind) => (
                  <Table.BodyRow key={ind}>
                    <Table.BodyCell>
                      {row.email}
                    </Table.BodyCell>
                    <Table.BodyCell>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => this.clickRemove(row)}
                      >
                        Remove
                      </Button>
                    </Table.BodyCell>
                  </Table.BodyRow>
                ))}
              </Table.Body>
            </Table>
            <Button color="success" size="md" onClick={this.clickAdd}>
              Add
            </Button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-bold">Admin Email Triggers</h3>
          </CardHeader>
          <CardBody className="flex flex-col gap-8">
            {this.renderTriggerAdmin()}      
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-bold">User Email Triggers</h3>
          </CardHeader>
          <CardBody className="flex flex-col gap-8">
            {this.renderTriggerUser()}      
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-bold">Member Email Triggers</h3>
          </CardHeader>
          <CardBody className="flex flex-col gap-8">
            {this.renderTriggerMember()}      
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Emailer));
