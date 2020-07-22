import React from 'react';
import {connect} from 'react-redux';
import {note} from '../actionCreators/index';
import {ClockCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';

import {wrapToStart} from '../utils/strings';

const style_icon = {
  fontSize:20,
  marginRight:6
}

const mapStateToProps = (state,props) => {
  const {todos} = state.notes;
  const currentTodo = todos.filter( t => t.id === props.todoId)[0];
  return {
    currentState: currentTodo.state
  }
}

const mapDispatchToProps = (dispatch,props) => {
  return {
    switchTodoState: (todoState,noteId) => dispatch(note.switchTodoState(todoState,props.todoId))
  }
}

class TodoState extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      
    }
    this.onChangeState = this.onChangeState.bind(this);
  }

  onChangeState(e){
    e.persist();
    this.props.switchTodoState(this.props.currentState);
  }

  componentDidMount(){
    this.props.handleTodoState(this.props.todoId,this.state.currentState);
  }

  render(){
    return (
      <div onClick={this.onChangeState} style={{display:'inline-flex',verticalAlign:'middle'}}>
      {
        this.props.currentState === 'TODO'?
          <div className="todoState_todo theme-comfort-icon-border" style={style_icon}></div>
          :
          this.props.currentState === 'DOING'?
            <ClockCircleOutlined style={style_icon} className="theme-comfort-icon"/>
            :
            <CheckCircleOutlined style={style_icon} className="theme-comfort-icon"/>
      }
      </div>
    )
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TodoState);