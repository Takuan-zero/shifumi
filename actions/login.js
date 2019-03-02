import LOGIN from './types';

const login = data => {
  return {
    type: LOGIN,
    jwt: data,
  };
};

export default login;
