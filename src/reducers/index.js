import {combineReducers} from 'redux';
import noteReducer from './noteReducer';
const initialState = {};

function rootReducer(state = initialState, action){
  switch(action.type){
    case 'note':
      break;
    default:
      break;
  }
}

export default combineReducers({
  notes:noteReducer
})