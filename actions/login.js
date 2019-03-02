import LOGIN from './types';

const login = data => {
  return {
    type: LOGIN,
    user: data,
  };
};

export default login;
