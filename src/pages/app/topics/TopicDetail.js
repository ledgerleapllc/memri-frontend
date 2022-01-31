import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  CardBody,
  CardHeader,
  Card,
  PageHeaderComponent,
  GlobalRelativeCanvasComponent,
} from "shared/components";
import TopicPosts from "../shared/topic-posts/TopicPosts";
import API from "utils/API";
import { connect } from "react-redux";
import { setActiveModal } from "redux/actions";
import { Flag } from "react-feather";
import TopicConfirmation from "../shared/topic-confirmation/TopicConfirmation";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class TopicDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: {},
      loading: true,
    };
  }

  componentDidMount() {
    const { match } = this.props;

    API.getTopic(match.params.topic).then((res) => {
      this.setState({
        loading: false,
        topic: res.data,
      });
    });
  }

  handleFlag = () => {
    this.props.dispatch(
      setActiveModal("topic-flag", {
        topic: this.state.topic,
      })
    );
  };

  // Render Header
  renderHeader() {
    const { topic } = this.state;
    if (!topic || !topic.id) return null;

    const { authUser, history } = this.props;

    return (
      <PageHeaderComponent title={topic.title}>
        <div className="fd-page-actions ml-auto">
          {topic.details.can_edit && (
            <button
              onClick={() => history.push(`/app/topics/${topic.id}/edit`)}
              className="btn btn-primary btn-fluid less-small"
            >
              Edit Topic Title
            </button>
          )}
          {(authUser.is_member ||
            authUser.is_admin ||
            authUser.is_super_admin) && (
            <button
              onClick={this.handleFlag}
              className="btn btn-primary btn-fluid less-small"
            >
              Flag Topic
            </button>
          )}
          {topic.flags_count > 0 && (
            <div className="total-flag-count">
              <Flag />
              <span>{topic.flags_count}</span>
            </div>
          )}
        </div>
      </PageHeaderComponent>
    );
  }

  // Render Content
  render() {
    const { loading, topic } = this.state;

    if (loading) return <GlobalRelativeCanvasComponent />;
    if (!topic || !topic.id) return <div>{`We can't find any details`}</div>;

    return (
      <section id="app-topic-detail-page" className="discourse">
        {this.renderHeader()}
        <div className="fd-topic-container">
          <div className="fd-topic-posts">
            <Card isAutoExpand={true}>
              <CardHeader>Posts</CardHeader>
              <CardBody>
                <TopicPosts topic={topic} />
              </CardBody>
            </Card>
          </div>
          <div className="fd-topic-reads">
            <TopicConfirmation topic={topic} />
          </div>
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps)(withRouter(TopicDetail));
