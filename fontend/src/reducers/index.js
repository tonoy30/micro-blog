import { combineReducers } from "redux";
import auth from "./auth";
import errors from "./errors";
import profiles from "./profiles";
import posts from "./posts";

export default combineReducers({
  auth,
  errors,
  profiles,
  posts
});
