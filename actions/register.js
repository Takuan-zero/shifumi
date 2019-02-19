import { REGISTER } from './types';

export const register = data => {
  return {
    type: REGISTER,
    user: data,
  };
};

export default { register };
