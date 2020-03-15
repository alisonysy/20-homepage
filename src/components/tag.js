import React from 'react';
import { Tag } from 'antd';

export default function(props){
  
  return (
    <Tag color={props.color} style={{height:'1.5em',width:'1.5em',borderRadius:'50%',padding:0}}></Tag>
  )
}