import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile, deleteAccount } from "./../../actions/profiles";
import Spinner from "../../common/spinner";
import { Link } from "react-router-dom";
import ProfileActions from "./ProfileActions";

class DashBoard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  onDelete = e => {
    this.props.deleteAccount();
  };
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    let dashBoardContent;
    if (profile === null || loading) {
      dashBoardContent = <Spinner />;
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        dashBoardContent = (
          <div>
            <p className="lead text-muted">
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </p>
            <ProfileActions />
            <div style={{ marginBottom: "60px" }}>
              <button onClick={this.onDelete} class="btn btn-danger">
                Delete My Account
              </button>
            </div>
          </div>
        );
      } else {
        dashBoardContent = (
          <div style={{ minHeight: "73vh" }}>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashBoardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
DashBoard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  profile: state.profiles,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(DashBoard);
