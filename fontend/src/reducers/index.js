import { combineReducers } from "redux";
import auth from "./auth";
import errors from "./errors";
import profiles from "./profiles";

export default combineReducers({
  auth,
  errors,
  profiles
});
