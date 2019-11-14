import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "./../../common/spinner";
import PostItem from "./PostItem";
import { getPostDetail } from "./../../actions/posts";
import CommentForm from "../comment/CommentForm";
import CommentFeed from "./../comment/CommentFeed";

class PostDetail extends Component {
  componentDidMount() {
    this.props.getPostDetail(this.props.match.params.id);
  }
  render() {
    const { post, loading } = this.props.post;
    let postContent;
    if (post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner />;
    } else {
      postContent = (
        <div>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <CommentFeed postId={post._id} comments={post.comments} />
        </div>
      );
    }
    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/feed" className="btn btn-light mb-3">
                Back To Feed
              </Link>
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
PostDetail.propTypes = {
  getPostDetail: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  post: state.posts
});
export default connect(
  mapStateToProps,
  { getPostDetail }
)(PostDetail);
