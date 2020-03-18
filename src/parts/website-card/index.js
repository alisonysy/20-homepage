import React from 'react';
import './style.css';

import { Card, Typography, Avatar } from 'antd';
import Tag from '../../components/tag';

function Favicon(props){
  let url = props.url.slice(-1,0) === '/'? props.url + 'favicon.ico' : props.url + '/favicon.ico';
  return (
    <Avatar src={url} size={60} style={props.style}/> 
  )
}

const inlineStyle = {
  font:{
    color:'#fff'
  }
}

export default class WebsiteCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      domain:'https://www.bilibili.com',
      url:'',
      title:'title',
      category:'category',
      tags:[],
      icon:null,
      key:undefined
    }
  };

  componentWillReceiveProps(props){
    // fetch data and process
    console.log('----card',props);
    const r = props.data;
    this.setState({...this.state,...r});

  }


  render(){
    let hasUrl = this.state.url.length? true : false;
    console.log(this.state)
    return (
      <Card 
        hoverable
        className="websiteCard"
      >
        <div className="websiteCard-body">
          <a  href={hasUrl? this.state.url : 'javascript:void(0);'} target={hasUrl ? "_blank" : ""}>
            <div className="websiteCard-body_inner abso_center">
              {this.state.domain.length ? <Favicon url={this.state.domain} style={{marginBottom:'0.5em'}} /> : null}  
              <Typography.Title level={2} style={inlineStyle.font}>{this.state.title}</Typography.Title>
              <div>
                <Tag color="#ddd" />
                <Typography.Title level={4} style={{...inlineStyle.font,display:'inline-block',verticalAlign:'middle'}}>{this.state.category}</Typography.Title>
              </div>
            </div>
          </a>
        </div>
      </Card>
    )
  }
}