import React,{useEffect, useState} from 'react';
import './style.css';

import { Card, Typography, Avatar } from 'antd';
import Tag from '../../components/tag';

function Favicon(props){
  console.log('executed')
  let [url,setUrl] = useState('')
  const handleNonExistingIcon = (e) => {
    console.log('image doesn\'t exist--');
    setUrl('https://www.iqiyi.com/favicon.ico')
  }
  useEffect(()=>{
    let tempUrl = props.url.slice(-1) === '/'? props.url + 'favicon.ico' : props.url + '/favicon.ico';
    let regExp = /^http[s*]:\/\//g;
    if(!tempUrl.match(regExp)){
      tempUrl = 'https://'+tempUrl;
    };
    setUrl(tempUrl);
  },[props]);

  return (
    <Avatar src={url} size={60} style={props.style} onError={handleNonExistingIcon}/> 
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
      domain:'',
      url:'',
      title:'',
      category:'',
      tags:[],
      icon:null,
      key:undefined
    }
  };

  componentWillReceiveProps(props){
    // fetch data and process
    console.log('----card',props);
    let r = props.data;
    this.setState({...this.state,...r});

  }

  render(){
    let hasUrl = this.state.url.length? true : false;
    let {domain,url} = this.state;
    console.log(this.state)
    return (
      <Card 
        hoverable
        className="websiteCard"
      >
        <div className="websiteCard-body">
          <a  href={hasUrl? this.state.url : 'javascript:void(0);'} target={hasUrl ? "_blank" : ""}>
            <div className="websiteCard-body_inner abso_center">
              <Favicon url={domain.length>0? domain : url} style={{marginBottom:'0.5em'}} /> 
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