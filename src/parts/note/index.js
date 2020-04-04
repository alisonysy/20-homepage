import React, { useState, useEffect } from 'react';

import {Card, Button, Rate, Input, Tag, Form, Row, Typography, Select} from 'antd';
import {DeleteFilled, PlusCircleOutlined,MinusCircleOutlined,ClockCircleOutlined,CheckCircleOutlined} from '@ant-design/icons';
import './style.css';
import {wrapToStart} from '../../utils/strings';

const {TextArea} = Input;
const {Title} = Typography;
const {Option} = Select;
// This should be in the note list, which is outside of this .js file
function AddNote(){
  return (
    <Button shape="circle" size="large">+</Button>
  )
}

function TodoState(props){
  const todo = 'todo', doing = 'doing', done = 'done';
  const stateArr = [todo,doing,done];
  let [todoState,setTodoState] = useState(todo);

  const style_icon = {
    fontSize:20,
    marginRight:6
  }

  useEffect(()=>{
    props.handleTodoState(props.todoId,todoState);
  },[]);

  const onChangeState = (e) => {
    e.persist();
    let idx = stateArr.indexOf(todoState);
    let nextState = stateArr[wrapToStart(stateArr.length,++idx)];
    setTodoState(nextState);
    props.handleTodoState(props.todoId,nextState);
  }

  return (
    <div onClick={onChangeState}>
      {
        todoState === todo?
          <div className="todoState_todo" style={style_icon}></div>
          :
          todoState === doing?
            <ClockCircleOutlined style={style_icon}/>
            :
            <CheckCircleOutlined style={style_icon}/>
      }
    </div>
  )
}

function DynamicTodo(props){
  const _handleTodoState = (id,state) => {
    props.handleTodoState({id,state})
  }
  return (
    <div>
      <Form.List name="todos">
        {(fields,{add, remove})=>{
          return (
            <div>
              {fields.map((f,idx)=>(
                <Form.Item 
                  label={idx===0? 'Add a to-do':''}
                  required={false}
                  key={f.key}
                >
                  <TodoState handleTodoState={_handleTodoState} todoId={f.key}/>
                  <Form.Item
                    noStyle
                    {...f}
                    validateTrigger={['onBlur']}
                    rules={[{required:true,whitespace:true,message:'Please add a to-do or delete this field.'}]}
                  >
                    <Input placeholder="To do ..." />
                  </Form.Item>
                  {fields.length>0? (<MinusCircleOutlined onClick={()=> remove(f.name)} />) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={()=> {add();}}>
                  <PlusCircleOutlined />Add a To-do
                </Button>
              </Form.Item>
            </div>
          )
        }}
      </Form.List>
    </div>
  )
}

class Note extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      content:'',
      todos:[],
      created:undefined,
      tags:[],
      urgency:0,
      tagInput:''
    }
    this.handleUrgencyChange = this.handleUrgencyChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onTagClosed = this.onTagClosed.bind(this);
    this.onTagInpChange = this.onTagInpChange.bind(this);
    this.onNotesChange = this.onNotesChange.bind(this);
    this.handleAddedTodo = this.handleAddedTodo.bind(this);
    this.handleTodoState = this.handleTodoState.bind(this);
  }

  

  handleUrgencyChange(e){
    this.setState({...this.state,urgency:e});
  }

  onTagInpChange(e){
    e.persist();
    let v = e.target.value;
    this.setState({tagInput:v});
    if(v.indexOf(',')!==-1){
      let tag = v.slice(0,-1);
      if(!tag.trim().length || this.state.tags.indexOf(tag) !== -1){
        this.setState({tagInput:''});
      }
      this.setState({tags:[...this.state.tags,tag]},(prev)=> console.log(this.state.tags));
      this.setState({tagInput:''});
    }
  }

  onTagClosed(t){
    t.persist();
    let tagToRemove = t.target.parentElement.parentElement.textContent;
    for(let t=0;t<this.tags.length;t++){
      if(this.tags[t].name===tagToRemove){
        let copiedTagsArr = [...this.tags];
        copiedTagsArr.splice(t,1);
        this.setState({tags:copiedTagsArr});
      }
    }
  }

  onNotesChange(e){
    e.persist();
    this.setState({content:e.target.value});
  }

  handleTodoState(e){
    this.setState((prevState)=>{
      let prevTodos = prevState.todos, isNew=true;
      prevTodos.map((t,pId)=>{
        isNew = pId !== e.id;
      });
      if(isNew){
        prevTodos.push({...e,note:''})
        return {...prevState,todos:prevTodos}
      };
      prevTodos[e.id] = {...prevTodos[e.id],...e};
      return {...prevState,todos:[...prevTodos]}
    });
  }

  handleAddedTodo(e){
    this.setState((prev)=>{
      let prevTodos = prev.todos;
      if(prevTodos.indexOf(e) === -1){
        return {...prev,todos:[...prevTodos,e]}
      };
    },function(){console.log('new todos',this.state.todos)})
  }

  onFormSubmit(e){
    console.log('values are',e);
    // combine todoState array
    let todosState = [...this.state.todos];
    todosState = todosState.map((t,tId)=>{
      return {...t,note:e.todos[tId]}
    });
    console.log(todosState);
  }


  render(){
    let {tags,content,urgency} = this.state;
    
    return (
      <Card hoverable className="note" >
        <Form onFinish={this.onFormSubmit} >
          <Form.Item name="urgency" >
            <Rate character="!" style={{fontSize:20,fontWeight:800,color:'#629bec'}} value={urgency}/>
          </Form.Item>
          <Row>
            <label htmlFor="tags">Tags:</label>
            <input onChange={this.onTagInpChange} value={this.state.tagInput} id="tags"/>
          </Row>
          {tags.length>0? 
            tags.map((t)=>{
              let k = 'notes-'+t;
              return <Tag closable={true} onClose={this.onTagClosed} color='#ea45b8' key={k}>{t}</Tag>;
            })
          : null}
          <Form.Item name="notes" label="Notes">
            <TextArea allowClear value={content} onChange={this.onNotesChange} autoSize={{minRows:8,maxRows:8}} style={{resize:'none'}}/> 
          </Form.Item>
          <DynamicTodo handleAddedTodo={this.handleAddedTodo} handleTodoState={this.handleTodoState}/>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default Note;