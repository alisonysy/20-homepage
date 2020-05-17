import React from 'react';
import { Tag, Tooltip } from 'antd';

export const TagWithTooltip = function(color,name){
  return (
    <Tooltip title={name} key={'TagWithTooltip-'+name}>
      <Tag color={color} style={{height:'1.1em',width:'1.1em',borderRadius:'50%',padding:0}}></Tag>
    </Tooltip>
  )
}

export default function(props){
  return (
    <Tag color={props.color} style={{height:'1.1em',width:'1.1em',borderRadius:'50%',padding:0}}></Tag>
  )
}