import React, { useState, useEffect } from 'react';

import {Card, Button, Rate, Input, Tag, Form, Row, Typography, Select} from 'antd';
import {DeleteFilled, PlusCircleOutlined,MinusCircleOutlined,ClockCircleOutlined,CheckCircleOutlined} from '@ant-design/icons';
import './style.css';
import {wrapToStart} from '../../utils/strings';
import {saveData,handleDataResults,updateARecord} from '../../data-service/data-handling';

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
    if(props.state)setTodoState(props.state);
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
    <div onClick={onChangeState} style={{display:'inline-block',verticalAlign:'middle'}}>
      {
        todoState === todo?
          <div className="todoState_todo theme-comfort-icon-border" style={style_icon}></div>
          :
          todoState === doing?
            <ClockCircleOutlined style={style_icon} className="theme-comfort-icon"/>
            :
            <CheckCircleOutlined style={style_icon} className="theme-comfort-icon"/>
      }
    </div>
  )
}

function DynamicTodo(props){
  const _handleTodoState = (id,state) => {
    props.handleTodoState({id,state})
  }
  const style_icon = {
    fontSize:20,
    verticalAlign:'middle'
  }
  let [oldTodos,setOldTodos] = useState(props.recordTodos);
  console.log('---dynmaci record todos',props.recordTodos,oldTodos)
  return (
    <div>
      <Form.List name={props.recordId? props.recordId + "-todos" :"todos"}>
        {(fields,{add, remove})=>{//{name: 0, key: 0, fieldKey: 0} {id,state,note}
          // if(oldTodos && oldTodos.length){
          //   if(fields.length !== oldTodos.length){
          //     for(let n=0;n<oldTodos.length;n++){
          //       fields.push({name:n,key:n,fieldKey:n})
          //     }
          //   }
          // }
          return (
            <div>
              {fields.map((f,idx)=>(
                <Form.Item 
                  //label={idx===0? 'Add a to-do':''}
                  required={false}
                  key={f.key}
                >
                  <TodoState handleTodoState={_handleTodoState} todoId={f.key} state={oldTodos[f.key]? oldTodos[f.key].state : null}/>
                  <Form.Item
                    noStyle
                    {...f}
                    validateTrigger={['onBlur']}
                    rules={[{required:true,whitespace:true,message:'Please add a to-do or delete this field.'}]}
                  >
                    <Input placeholder="To do ..."  style={{display:'inline-block',width:'75%'}} className="note_todoItemInp" />
                  </Form.Item>
                  {fields.length>0? (<MinusCircleOutlined onClick={()=> remove(f.name)} style={style_icon} className="theme-comfort-icon-secondary"/>) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={()=> {add();}} className="note_todo-addBtn theme-comfort-icon-hovered">
                  <PlusCircleOutlined className="note_todo-addBtn-icon theme-comfort-icon" style={style_icon}/>Add a To-do
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
    const r = this.props.data;
    this.state = {
      id: r? r.id : null,
      isNew: r? false:true,
      content: r? r.notes:'',
      todos:r? Array.prototype.slice.call(r.todos): [],
      created:r? r.createdAt :undefined,
      tags:r? Array.prototype.slice.call(r.tags): [],
      urgency:r? r.urgency : 0,
      tagInput:''
    }
    this.form = React.createRef();
    this.handleUrgencyChange = this.handleUrgencyChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onTagClosed = this.onTagClosed.bind(this);
    this.onTagInpChange = this.onTagInpChange.bind(this);
    this.onNotesChange = this.onNotesChange.bind(this);
    this.handleAddedTodo = this.handleAddedTodo.bind(this);
    this.handleTodoState = this.handleTodoState.bind(this);
    this.renderRecordTodosToNote = this.renderRecordTodosToNote.bind(this);
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
    for(let t=0;t<this.state.tags.length;t++){
      if(this.state.tags[t].name===tagToRemove){
        let copiedTagsArr = [...this.state.tags];
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
      let prevTodos = prevState.todos, isNewTodo=true;
      let recordTodosNum = prevState.id? prevTodos.length : 0;
      prevTodos.map((t,pId)=>{
        isNewTodo = pId !== e.id;
      });
      if(isNewTodo){
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
    console.log(e)
    // combine todoState array
    let fields = [], newE = {};
    if(this.state.id){
      for(var k in e){
        newE[k.split('-')[1]] = e[k];
      };
      e = {...newE};
    }
    let todosState = [...this.state.todos];
    console.log(todosState)
    todosState = todosState.map((t,tId)=>{
      return {...t,note:e.todos[tId]}
    });
    for(var key in e){
      fields.push({name: key,value:key === 'todos'? todosState : e[key]})
    }
    fields.push({name:'tags',value:this.state.tags});
    if(this.state.id){
      console.log(fields);
      return;
      updateARecord('Notes',this.state.id,fields)
        .then((res)=>{
          console.log('update success',res)
        })
        .catch( e => console.log('notes update failed',e));
      return;
    }
    saveData('Notes',fields)
      .then((res)=>{
        let n = handleDataResults([res],['createdAt','updatedAt'])[0];
        this.setState({urgency:n.urgency,todos:n.todos,created:n.createdAt,id:n.id,isNew:false},function(){
          console.log(n,this.state);
        })
      })
      .catch( e => console.log('save notes failed',e));
  }

  componentDidMount(){
    // 
    if(this.state.id){
      this.renderRecordTodosToNote();
    }
  }

  renderRecordTodosToNote(){
    const f = this.form.current;
    let k = this.state.id + '-todos', o ={};
    o[k] = this.state.todos.map((t)=>{
      return t.note;
    });
    f.setFieldsValue({
      ...o
    })
  }

  render(){
    const {id} = this.state;
    let {tags,content,urgency,todos} = this.state;

    return (
      <Card hoverable className="note theme-comfort-boxShadow theme-comfort-noteCard-border" >
        <Form onFinish={this.onFormSubmit} ref={this.form} >
          <Form.Item name={id? id+"-urgency":"urgency"} >
            <Rate character="!" style={{fontSize:20,fontWeight:800}} value={urgency} className="theme-comfort-icon"/>
          </Form.Item>
          <Row style={{marginBottom:'1em'}}>
            <label htmlFor="tags" className="theme-comfort-label_underline" style={{marginRight:'1em'}}>Tags</label>
            <input onChange={this.onTagInpChange} value={this.state.tagInput} id={id? id+"-tags" :"tags"} className="note_tagsInp"/>
          </Row>
          {tags.length>0? 
            tags.map((t)=>{
              let k = 'notes-'+t;
              return <Tag closable={true} onClose={this.onTagClosed} className="note_tagItem theme-comfort-noteTag" key={k}>{t}</Tag>;
            })
          : null}
          <Form.Item name={id? id+"-notes":"notes"} rules={[{required:true,message:'Please note down something...'}]}>
            <TextArea  value={content} onChange={this.onNotesChange} autoSize={{minRows:6,maxRows:8}} style={{resize:'none'}} className="note_contentInp"/> 
          </Form.Item>
          <DynamicTodo handleAddedTodo={this.handleAddedTodo} handleTodoState={this.handleTodoState} recordId={id} recordTodos={todos}/>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="theme-comfort-button">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default Note;