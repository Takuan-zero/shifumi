import LOGIN from '../actions/types';

const initialState = {
  jwt: '',
};

const loginReducer = (state = initialState, action) => {
  console.log('Action :', action);
  switch (action.type) {
    case LOGIN:
      return action.jwt;
    default:
      return state;
  }
};

export default loginReducer;
