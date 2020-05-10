import React, { useState, useEffect } from 'react';

import {Card, Button, Rate, Input, Tag, Form, Row, Typography, Select} from 'antd';
import {DeleteFilled, PlusCircleOutlined,MinusCircleOutlined,ClockCircleOutlined,CheckCircleOutlined} from '@ant-design/icons';
import './style.css';
import {wrapToStart} from '../../utils/strings';
import {findParentEl} from '../../utils/dom';
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
  let [todoState,setTodoState] = useState(props.state);

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
    <div onClick={onChangeState} style={{display:'inline-flex',verticalAlign:'middle'}}>
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
    let isNewTodo = true;
    let temp = oldTodos.map((o,oId)=>{
      if(oId === id){
        isNewTodo = false;
        o.state = state;
      }
      return o;
    });
    if(isNewTodo){
      console.log('added new todo')
      setOldTodos([...oldTodos,{id,state,note:''}]);
    }else{
      console.log('edited original todo',temp)
      setOldTodos(temp);
    }
    props.handleTodoState({id,state})
  }

  const _removeTodo = (key) => {
    let temp = oldTodos.filter(t => t.id !== key);
    temp.map( (t,idx) => t.id = idx );
    setOldTodos(temp);
    props.handleRemovedTodo(temp);
  }

  const onTodoInputChange = (e,idx) => {
    e.persist();
    let v = e.target.value;
    console.log('old todos',oldTodos,idx);
    // setOldTodos([...oldTodos,{}])
    let temp = oldTodos.map((o,oId)=>{
      if(idx===oId){
        o.note = v;
      };
      return o;
    });
    setOldTodos(temp);
    props.handleTodoNote(v,idx)
  }

  const style_icon = {
    fontSize:20,
    verticalAlign:'middle'
  }
  let [oldTodos,setOldTodos] = useState(props.recordTodos);
  return (
    <div>
      <Form.List name={props.recordId? props.recordId + "-todos" :"todos"}>
        {(fields,{add, remove})=>{
          return (
            <div>
              {fields.map((f,idx)=>(
                <Form.Item 
                  //label={idx===0? 'Add a to-do':''}
                  required={false}
                  key={f.key}
                >
                  <TodoState handleTodoState={_handleTodoState} todoId={f.key} state={oldTodos[f.key]? oldTodos[f.key].state : 'todo'}/>
                  <Form.Item
                    noStyle
                    {...f}
                    validateTrigger={['onBlur']}
                    rules={[{required:true,whitespace:true,message:'Please add a to-do or delete this field.'}]}
                  >
                    <Input placeholder="To do ..."  style={{display:'inline-block',width:'75%'}} className="note_todoItemInp" onChange={(e) => onTodoInputChange(e,f.name)}/>
                  </Form.Item>
                  {fields.length>0? (<MinusCircleOutlined onClick={()=> {remove(f.name);_removeTodo(f.key)}} style={style_icon} className="theme-comfort-icon-secondary"/>) : null}
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
      tagInput:'',
      loading:false,
      isEdit:r? false : true
    }
    this.form = React.createRef();
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onUrgencyChange = this.onUrgencyChange.bind(this);
    this.onTagClosed = this.onTagClosed.bind(this);
    this.onTagInpChange = this.onTagInpChange.bind(this);
    this.onNotesChange = this.onNotesChange.bind(this);
    this.handleAddedTodo = this.handleAddedTodo.bind(this);
    this.handleRemovedTodo = this.handleRemovedTodo.bind(this);
    this.handleTodoState = this.handleTodoState.bind(this);
    this.handleTodoNote = this.handleTodoNote.bind(this);
    this.renderRecord = this.renderRecord.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.turnToEditMode = this.turnToEditMode.bind(this);
  }

  onUrgencyChange(n){
    this.setState({urgency:n});
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
    let tagToRemove = findParentEl(t.target,'note_tagItem').textContent;
    for(let t=0;t<this.state.tags.length;t++){
      if(this.state.tags[t]===tagToRemove){
        let copiedTagsArr = [...this.state.tags];
        copiedTagsArr.splice(t,1);
        this.setState({tags:copiedTagsArr},() => {console.log('after tags removed',this.state.tags)});
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
      console.log('to do state',e,prevTodos)
      prevTodos.map((t,pId)=>{
        if(pId === e.id){
          isNewTodo = false;
        }
      });
      if(isNewTodo){
        prevTodos.push({...e,note:''})
        return {...prevState,todos:prevTodos}
      };
      prevTodos[e.id] = {...prevTodos[e.id],...e};
      return {...prevState,todos:[...prevTodos]}
    });
  }

  handleTodoNote(c,id){
    this.setState((prevState)=>{
      let prevTodos = prevState.todos,isNewTodo = true;
      prevTodos.map((t,pId)=>{
        if(pId === id){
          isNewTodo = false;
        }
      });
      if(isNewTodo){
        prevTodos.push({id,note:c,state:'todo'});
        return {...prevState,todos:prevTodos}
      };
      prevTodos[id] = {...prevTodos[id],note:c};
      return {...prevState,todos:[...prevTodos]}
    })
  }

  handleAddedTodo(e){
    this.setState((prev)=>{
      let prevTodos = prev.todos;
      if(prevTodos.indexOf(e) === -1){
        return {...prev,todos:[...prevTodos,e]}
      };
    },function(){console.log('new todos',this.state.todos)})
  }

  handleRemovedTodo(newTodosArray){
    this.setState({todos:newTodosArray});
  }

  onFormSubmit(e){
    this.setState({loading:true});
    let fields = [], newE = {};
    // update record - reset field names
    if(this.state.id){
      for(var k in e){
        newE[k.split('-')[1]] = e[k];
      };
      e = {...newE};
    }
    // shallow copy todosState from state
    let todosState = [...this.state.todos];
    // push field names to an object to be submitted
    for(var key in e){
      fields.push({name: key,value:key === 'todos'? todosState : e[key]})
    }
    fields.push({name:'tags',value:this.state.tags});
    if(this.state.id){
      updateARecord('Notes',this.state.id,fields)
        .then((res)=>{
          console.log('update success',res);
          this.setState({isEdit:false,urgency:res.attributes.urgency})
        })
        .catch( e => console.log('notes update failed',e))
        .finally(()=> this.setState({loading:false}));
      return;
    }
    saveData('Notes',fields)
      .then((res)=>{
        let n = handleDataResults([res],['createdAt','updatedAt'])[0];
        this.setState({urgency:n.urgency,todos:n.todos,created:n.createdAt,id:n.id,isNew:false,content:n.notes},function(){
          // this.renderRecord();
          this.props.addNewRecord(n);
          this.resetForm();
        })
      })
      .catch( e => console.log('save notes failed',e))
      .finally(()=> this.setState({loading:false}));
  }

  componentDidMount(){
    if(this.state.id && this.state.isEdit){
      this.renderRecord();
    }
  }

  componentDidUpdate(){
    if(this.state.id && this.state.isEdit){
      this.renderRecord();
    }
  }

  renderRecord(){
    const f = this.form.current;
    let o ={},
        k = this.state.id + '-todos',
        u = this.state.id + '-urgency',
        c = this.state.id + '-notes';
    o[k] = this.state.todos.map((t)=>{
      return t.note;
    });
    o[u] = this.state.urgency;
    o[c] = this.state.content;
    f.setFieldsValue({
      ...o
    })
  }

  resetForm(){
    const f = this.form.current;
    f.setFieldsValue({
      urgency:0,
      notes:'',
      todos:[]
    });
    this.setState({content:'',todos:[],tagInput:'',tags:[],urgency:0,isNew:true,createdAt:undefined,id:null})
  }

  turnToEditMode(){
    this.setState({isEdit:true});
  }

  render(){
    const {id,isEdit} = this.state;
    let {tags,content,urgency,todos,loading} = this.state;

    return (
      <Card hoverable className="note theme-comfort-boxShadow theme-comfort-noteCard-border" style={{cursor:'default'}}>
        { isEdit?
          (<Form onFinish={this.onFormSubmit} ref={this.form} >
          <Form.Item name={id? id+"-urgency":"urgency"} >
            <Rate character="!" style={{fontSize:20,fontWeight:800}}  className="theme-comfort-icon" onChange={this.onUrgencyChange}/>
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
            <TextArea onChange={this.onNotesChange} autoSize={{minRows:6,maxRows:8}} style={{resize:'none'}} className="note_contentInp"/> 
          </Form.Item>
          <DynamicTodo 
            handleAddedTodo={this.handleAddedTodo} 
            handleTodoState={this.handleTodoState} 
            handleRemovedTodo={this.handleRemovedTodo} 
            handleTodoNote={this.handleTodoNote}
            recordId={id} recordTodos={todos}
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" className="theme-comfort-button" loading={loading}>
              Add
            </Button>
          </Form.Item>
        </Form>) :
          (
            <div >
              <div className="note_editBtn theme-comfort-helpText" onClick={this.turnToEditMode}>Edit</div>
              <Form.Item >
                <Rate character="!" style={{fontSize:20,fontWeight:800}}  className="theme-comfort-icon" disabled defaultValue={urgency}/>
              </Form.Item>
              {tags.length>0? 
                tags.map((t)=>{
                  let k = 'notes-'+t;
                  return <Tag className="note_tagItem theme-comfort-noteTag" key={k}>{t}</Tag>;
                })
              : null}
              <Form.Item style={{marginTop:'1em'}}>
                <div className="note_contentInp" style={{minHeight:160,overflowY:'auto',textAlign:'left'}}>{content}</div>
              </Form.Item>
              <div>
                {todos.map((t,idx)=>(
                  <Form.Item key={'todo-'+idx}>
                    <TodoState handleTodoState={()=>{}} todoId={idx} state={t.state}/>
                    <div style={{display:'inline-block',width:'75%',textAlign:'left'}}>{t.note}</div>
                  </Form.Item>
                ))}
              </div>
            </div>
          )
        }
        
      </Card>
    )
  }
}

export default Note;