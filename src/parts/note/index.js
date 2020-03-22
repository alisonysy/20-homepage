import React from 'react';

import {Card, Button, Rate} from 'antd';
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
      urgency:0
    }
    this.handleUrgencyChange = this.handleUrgencyChange.bind(this);
  }

  handleUrgencyChange(e){
    console.log('----rate changes',e);
    this.setState({...this.state,urgency:e});
  }

  render(){
    return (
      <Card hoverable className="note" >
        <Rate character="!" style={{fontSize:20,fontWeight:800,color:'#629bec'}} onChange={this.handleUrgencyChange} value={this.state.urgency}/>
      </Card>
    )
  }
}