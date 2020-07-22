import {SWITCH_TODO_STATE} from '../actionCreators/actionTypes';

const initialState = {
  todos:[{
    id:0,
    state:'TODO',
    note:''
  }]
}

export default function(state = initialState,action){
  let p = action.payload;
  switch(action.type){
    case SWITCH_TODO_STATE:
      return Object.assign({},state,{
        todos:state.todos.map( t => {
          if(t.id === p.noteId) return {...t,state:p.currentState};
          return t;
        })
      })
    default:
      return state;
  }
}