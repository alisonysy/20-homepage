import {SWITCH_TODO_STATE} from '../actionTypes';
import {wrapToStart} from '../../utils/strings';

const allStates = ['TODO','DOING','DONE'];
const switchTodoState = (state,noteId) => {
  let idx = allStates.indexOf(state);
  return {
    type:SWITCH_TODO_STATE,
    payload: {
      noteId,
      currentState: allStates[wrapToStart(allStates.length, ++idx)]
    }
  }
}

export default {
  allStates,
  switchTodoState
}