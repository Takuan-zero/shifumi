import { SIGN_IN, SIGN_UP } from '../actions/types';

const initialState = {
  username: '',
  password: '',
};

const signInReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        user: state.user.concat({
          username: action.username,
          email: action.email,
        }),
      };
    case SIGN_UP:
      return {};
    default:
      return state;
  }
};

export default signInReducer;
