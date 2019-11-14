import {
  ADD_POST,
  GET_POSTS,
  GET_POST_DETAIL,
  DELETE_POST,
  POST_LOADING
} from "../actions/types";

const initialState = {
  posts: [],
  post: {},
  loading: false
};

const PostsReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case GET_POSTS:
      return {
        ...state,
        loading: false,
        posts: action.payload
      };
    case GET_POST_DETAIL:
      return {
        ...state,
        post: action.payload,
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      };
    default:
      return state;
  }
};
export default PostsReducer;
