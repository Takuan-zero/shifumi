import { createStore, combineReducers } from 'redux';
import loginReducer from './reducers/login';

const rootReducer = combineReducers({
  user: loginReducer,
});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;
