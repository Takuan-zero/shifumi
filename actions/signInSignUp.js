import { SIGN_IN, SIGN_UP } from './types';

export const signIn = data => {
  return {
    type: SIGN_IN,
    user: data,
  };
};

export const signUp = () => {
  return {
    type: SIGN_UP,
  };
};

export default { signIn, signUp };
