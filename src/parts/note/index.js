import React from 'react';

import {Card, Button, Rate, Input, Tag, Form, Row} from 'antd';
import './style.css';


// This should be in the note list, which is outside of this .js file
function AddNote(){
  return (
    <Button shape="circle" size="large">+</Button>
  )
}

export default class Note extends React.Component{
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
  }

  

  handleUrgencyChange(e){
    console.log('----rate changes',e);
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

  onFormSubmit(){

  }

  render(){
    let {tags} = this.state;
    return (
      <Card hoverable className="note" >
        <Form onFinish={this.onFormSubmit} >
          <Form.Item name="urgency" >
            <Rate character="!" style={{fontSize:20,fontWeight:800,color:'#629bec'}} />
            {/* onChange={this.handleUrgencyChange} value={this.state.urgency} */}
          </Form.Item>
          {/* <Form.Item name="tags" label="Tags" normalize={this.handleTagInput}>
            <Input onChange={this.onTagInpChange} placeholder="A tag will be generated once there is ','." allowClear={true}/>
          </Form.Item> */}
          <Row>
            <label for="tags">Tags:</label>
            <input onChange={this.onTagInpChange} value={this.state.tagInput} id="tags"/>
          </Row>
          {tags.length>0? 
            tags.map((t)=>{
              let k = 'notes-'+t;
              return <Tag closable={true} onClose={this.onTagClosed} color='#ea45b8' key={k}>{t}</Tag>;
            })
          : null}
        </Form>
      </Card>
    )
  }
}