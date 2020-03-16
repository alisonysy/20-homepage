import React, {useRef,useEffect, useState} from 'react';
// import './style.css';

import { Modal, Button, Form, Input, Tag } from 'antd';

import {saveData} from './data-handling';

function TagField({rules,layout,outputTags}){

  const addTags = (e) => {
    console.log('----add tags submit',e);
  };

  const onTagInputChange = (e) => {
    console.log('tag input',e.target.value);
    if(e.target.value.indexOf(',') !== -1){
      let tag = e.target.value.slice(0,-1);
      console.log(tag);
      outputTags(tag);
    }
  }
  return (
      <Form.Item label="Tags" {...layout} >
        <Input.Group compact>
          <Form.Item name="tags" rules={rules} >
            <Input onChange={onTagInputChange} />
          </Form.Item>
          <Button type="primary" htmlType="button" shape="round" onClick={addTags}>
            +
          </Button>
        </Input.Group>
      </Form.Item>
  )
}

/* domain, url, title, category, tags[], key(keyborad), icon-url */ 
function AddFavouriteForm(props){
  let [tags,setTags] = useState([]);

  let validation = (isRequired,msg) => {
    return {
      required: isRequired? true : false,
      message: msg
    }
  };

  const formSubmit = (values) => {
    console.log('form submitted',values);
    let fields=[];
    for(var key in values){
      fields.push({name:key,value:values[key]});
    }
    saveData('Favourites',fields).then((res)=>{
      console.log(res);
    }).catch((e)=>{console.log(e)})
  };

  const outputTags = (tag) => {
    console.log(tag);
    setTags(tags.push(tag));
  }

  const formItemLayout = {
    labelCol:{span:4},
    wrapperCol:{span:18}
  }

  const formItemTailLayout = {
    wrapperCol:{offset:formItemLayout.labelCol.span,span:6}
  }

  return (
    <Form 
      onFinish={formSubmit}
    >
      <Form.Item label="Title" name="title" rules={[validation(true,'Give me a name!')]} {...formItemLayout}>
        <Input />
      </Form.Item>
      <Form.Item label="Website" {...formItemLayout}>
        <Input.Group compact>
          <Form.Item name={['domain']} rules={[validation(false,'')]}>
            <Input placeholder="Website's domain" />
          </Form.Item>
          <Form.Item name={['url']} rules={[validation(true,'Give me a url!')]} style={{marginLeft:'0.5em'}}>
            <Input placeholder="Website's full url"/>
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label="Icon" name="icon" rules={[validation(false,'')]} {...formItemLayout}>
        <Input placeholder="Image url"/>
      </Form.Item>
      <Form.Item label="Category" name="category" rules={[validation(false,'')]}>
        <Input />
      </Form.Item>
      <Form.Item label="Key" name="key" rules={[validation(false,'')]} {...formItemLayout}>
        <Input placeholder="A single alphanumeric to press"/>
      </Form.Item>
      {/* <Form.Item label="Tags" name="tags" rules={[validation(false,'')]} {...formItemLayout}>
        <Input placeholder="Use ',' to separate different tags" />
      </Form.Item> */}
      <TagField rules={[validation(false,'')]} layout={formItemLayout} outputTags={outputTags}/>
      {tags.length>0? (<div>
        {tags.map((t)=>{
          return (
            <Tag>{t}</Tag>
          );
        })}
      </div>) : null}
      <Form.Item {...formItemTailLayout}>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  )
}

export default class AddFavourite extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading:false,
      visible:false
    }
    this.openForm = this.openForm.bind(this);
    this.onFormCancel = this.onFormCancel.bind(this);
  }

  openForm(){
    this.setState({visible:true});
  }

  onFormCancel(e){
    this.setState({ visible: false });
    console.log('cancel',e);
  }

  render(){
    const {visible,loading} = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.openForm}>
          Open Modal with customized footer
        </Button>
        <Modal
          visible={visible}
          centered={true}
          title="Add a favourite"

          style={{borderRadius:'5%'}}
          onCancel={this.onFormCancel}
          footer={null}
        >
          <AddFavouriteForm />
        </Modal>
      </div>
    )
  }
}