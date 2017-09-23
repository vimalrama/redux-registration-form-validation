import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import bankAccounts from './bankAccounts';


export default combineReducers({
  form: reduxFormReducer,
  bankAccounts,
});
