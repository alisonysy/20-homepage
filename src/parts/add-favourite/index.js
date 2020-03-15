import React from 'react';
// import './style.css';

import { Modal, Button, Form, Input } from 'antd';

import {saveData} from './data-handling';

/* domain, url, title, category, tags[], key(keyborad), icon-url */ 
function AddFavouriteForm(props){

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
      <Form.Item label="Tags" name="tags" rules={[validation(false,'')]} {...formItemLayout}>
        <Input placeholder="Use ',' to separate different tags" />
      </Form.Item>
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
          footer={[
            <Button key="back" onClick={this.onFormCancel}>
              Return
            </Button>,
          ]}
        >
          <AddFavouriteForm />
        </Modal>
      </div>
    )
  }
}