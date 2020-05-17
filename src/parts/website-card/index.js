import React,{useEffect, useState} from 'react';
import './style.css';

import {appendHttp} from '../../utils/strings';
import {ico_placeholder} from '../../utils/constants';

import { Card, Typography, Avatar, Tooltip } from 'antd';
import Tag,{TagWithTooltip} from '../../components/tag';

function Favicon(props){
  let [url,setUrl] = useState('')
  const handleNonExistingIcon = () => {
    setUrl(ico_placeholder);
  }
  useEffect(()=>{
    if(props.icon){setUrl(props.icon);return;}
    let tempUrl = props.url.slice(-1) === '/'? props.url + 'favicon.ico' : props.url + '/favicon.ico';
    tempUrl = appendHttp(tempUrl);
    setUrl(tempUrl);
  },[props]);

  return (
    <Avatar src={url} size={50} style={props.style} onError={handleNonExistingIcon}/> 
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
      id:null,
      domain:'',
      url:'',
      title:'',
      category:'',
      tags:[],
      icon:null,
      key:undefined
    }
    this.keydownHandler = this.keydownHandler.bind(this);
  };

  componentWillReceiveProps(props){
    // fetch data and process
    let r = props.data;
    r.url = appendHttp(r.url);
    this.setState({...this.state,...r});
  }

  componentDidMount(){
    if(this.props.listenOnKeyboard){
      document.addEventListener('keydown',this.keydownHandler)
    }
  }

  componentDidUpdate(){
    if(!this.props.listenOnKeyboard){
      document.removeEventListener('keydown',this.keydownHandler);
    }else{
      document.addEventListener('keydown',this.keydownHandler);
    }
  }

  keydownHandler(k){
    if(this.state.key && k.key === this.state.key){
      window && window.open(this.state.url,'_blank')
    }
  }

  render(){
    let hasUrl = this.state.url.length? true : false;
    let {domain,url,icon,key,tags} = this.state;
    return (
      <Card 
        hoverable
        className="websiteCard theme-comfort-websiteCard-background theme-comfort-websiteCard-fontColor"
        style={{display:'inline-block',marginRight:'1em',marginBottom:'1em',textAlign:'center',float:'left'}}
      >
        <div className="websiteCard-body">
        { key && key.length? <div className="websiteCard-body_inner_key">&lt;{key}&gt;</div> : null}
          <a  href={hasUrl? url : 'javascript:void(0);'} target={hasUrl ? "_blank" : ""}>
            <div className="websiteCard-body_inner abso_center">
              <Favicon url={domain.length>0? domain : url} icon={icon} style={{marginBottom:'0.5em'}} /> 
              <Typography.Title level={3} style={inlineStyle.font}>{this.state.title}</Typography.Title>
              <div>
                {tags.length? 
                  tags.map((t)=>{
                    return (
                      TagWithTooltip(t.color? t.color:'#ddd',t.name)
                    )
                  }):null
                }
                <Typography.Title level={4} style={{...inlineStyle.font,display:'inline-block',verticalAlign:'middle'}}>{this.state.category}</Typography.Title>
              </div>
            </div>
          </a>
        </div>
      </Card>
    )
  }
}