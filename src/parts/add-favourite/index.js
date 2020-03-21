import React, {useRef,useEffect, useState} from 'react';
import './style.css';

import { Modal, Button, Form, Input, Tag, Row, Col } from 'antd';

import {saveData} from '../../data-service/data-handling';
import {generateRandomColor} from '../../utils/color';

function TagField({rules,layout,outputTags}){

  const addTags = (e) => {
    console.log('----add tags submit',e);
  };

  const onTagInputChange = (e) => {
    if(e.target.value.indexOf(',') !== -1){
      let tag = e.target.value.slice(0,-1);
      outputTags(tag);
    }
  };

  return (
      <Form.Item label="Tags" {...layout} className="addFavouriteForm--tags">
        <Input.Group compact>
          <Form.Item name="tags" rules={rules} className="addFavouriteForm--tags_input">
            <Input onChange={onTagInputChange} placeholder="A tag will be generated once there is ','." />
          </Form.Item>
          <Button type="primary" htmlType="button" shape="round" onClick={addTags} style={{marginLeft:'.5em'}}>
            +
          </Button>
        </Input.Group>
      </Form.Item>
  )
}

/* domain, url, title, category, tags[], key(keyborad), icon-url */ 
function AddFavouriteForm(props){
  const [form] = Form.useForm();
  let [tagsArr,setTagsArr] = useState([]);
  let [loading,setLoading] = useState(false);

  let validation = (isRequired,msg) => {
    return {
      required: isRequired? true : false,
      message: msg
    }
  };

  const formSubmit = (values) => {
    setLoading(true);
    console.log('form submitted',values);
    let fields=[];
    for(var key in values){
      fields.push({name:key,value: key === 'tags'? tagsArr : values[key]});
    }
    saveData('Favourites',fields).then((res)=>{
      console.log(res);
      props.closeModal();
    }).catch((e)=>{console.log(e)})
      .finally(()=> setLoading(false));
  };

  const outputTags = (tag) => {
    console.log(tag);
    // #notes: cannot use tagsArr.push(tag) because Array.prototype.push() returns the number of the modified array
    setTagsArr((prev) =>{ 
      return [...prev,tag]
    });
    form.setFieldsValue({tags:''});
  }

  let [tagColor,setTagColor] = useState(undefined);
  const changeTagColor = (e) => {
    e.persist();
    setTagColor(generateRandomColor());
  }
  const closingTag = (t) => {
    t.persist();
    let tagToRemove = t.target.parentElement.parentElement.textContent;
    setTagsArr((prev)=>{
      let ts = prev.splice(prev.indexOf(tagToRemove),1);
      return [...prev]
    });
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
      form={form}
      className="addFavouriteForm"
    >
      <Form.Item label="Title" name="title" rules={[validation(true,'Give me a name!')]} {...formItemLayout}>
        <Input />
      </Form.Item>
      <Form.Item label="Website" {...formItemLayout}>
        <Input.Group compact>
          <Form.Item name={['url']} rules={[validation(true,'Give me a url!')]} style={{marginBottom:0}}>
            <Input placeholder="Website's full url"/>
          </Form.Item>
          <Form.Item name={['domain']} rules={[validation(false,'')]} style={{marginLeft:'0.5em',marginBottom:0}}>
            <Input placeholder="Website's domain" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label="Icon" name="icon" rules={[validation(false,'')]} {...formItemLayout}>
        <Input placeholder="Image url"/>
      </Form.Item>
      <Form.Item label="Category" name="category" rules={[validation(false,'')]} {...formItemLayout}>
        <Input />
      </Form.Item>
      <Form.Item label="Key" name="key" rules={[validation(false,'')]} {...formItemLayout}>
        <Input placeholder="A single alphanumeric to press"/>
      </Form.Item>
      <TagField rules={[validation(false,'')]} layout={formItemLayout} outputTags={outputTags}/>
      {tagsArr.length>0? (<Row className="addFavouriteForm--tagsBoard">
        <Col span={formItemLayout.labelCol.span}></Col>
        {tagsArr.map((t)=>{
          return (
            <Tag key={ "tag-"+ t} onClick={changeTagColor} color={tagColor} closable={true} onClose={closingTag}>{t}</Tag>
          );
        })}
      </Row>) : null}
      <Form.Item {...formItemTailLayout}>
        <Button type="primary" htmlType="submit" loading={loading}>
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
          <AddFavouriteForm closeModal={this.onFormCancel}/>
        </Modal>
      </div>
    )
  }
}