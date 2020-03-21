import React from 'react';
import { Tag } from 'antd';

export default function(props){
  
  return (
    <Tag color={props.color} style={{height:'1.1em',width:'1.1em',borderRadius:'50%',padding:0}}></Tag>
  )
}