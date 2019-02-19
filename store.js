import { createStore, combineReducers } from 'redux';
import registerReducer from './reducers/register';
import signInSignUpReducer from './reducers/signInSignUp';

const rootReducer = combineReducers({
  register: registerReducer,
  user: signInSignUpReducer,
});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;
