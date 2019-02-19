import REGISTER from '../actions/types';

const initialState = {
  username: '',
  email: '',
  password: '',
};

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER:
      return {
        ...state,
        user: state.user.concat({
          username: action.username,
          email: action.email,
          password: action.password,
        }),
      };
    default:
      return state;
  }
};

export default registerReducer;
