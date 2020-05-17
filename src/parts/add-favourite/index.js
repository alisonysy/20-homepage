import React, {useRef,useEffect, useState} from 'react';
import './style.css';

import { Modal, Button, Form, Input, Tag, Row, Col, Popover, Radio } from 'antd';

import {saveData,saveAll,fetchAllRecords,handleDataResults} from '../../data-service/data-handling';
import {generateRandomColor} from '../../utils/color';
import { Relation } from 'leancloud-storage';

function TagField({rules,layout,outputTags}){

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
            <Input onChange={onTagInputChange} placeholder="A tag will be generated once there is ','." className="theme-comfort-input"/>
          </Form.Item>
        </Input.Group>
      </Form.Item>
  )
}

function WrappedTag(props){
  let {name,changeTagColor,closingTag,tagsRecord} = props;
  let [instanceColor,setInstanceColor] = useState(null);
  let [colorPopupVisible,setColorPopupVisible] = useState(false);
  let [toChangeTagColor,setToChangeTagColor] = useState(false);
  let [tagInDb,setTagInDb] = useState(null);

  const changeColor = () => {
    if(tagInDb){
      setColorPopupVisible(true);
    }
    if((!colorPopupVisible && !tagInDb)){
      let c =generateRandomColor();
      setInstanceColor(c);
      changeTagColor(name,c);
    }
  }

  const isTagColorChanged = (b) => {
    setToChangeTagColor(b);
    if(!b){
      setInstanceColor(tagInDb.color);
      changeTagColor(name,tagInDb.color);
    }
  }

  const handleColorChangeFromPopup = (c) => {
    setInstanceColor(c);
    changeTagColor(name,c);
  }

  useEffect(()=>{
    for(let t=0;t<tagsRecord.length;t++){
      if(tagsRecord[t].name===name){
        setTagInDb(tagsRecord[t]);
        setInstanceColor(tagsRecord[t].color)
      }
    }
  },[tagInDb])

  return (
    <Popover 
      content={<ChangeTagColorPopup 
        isTagColorChanged={isTagColorChanged} 
        handleColorChangeFromPopup={handleColorChangeFromPopup}
        setPopoverVisible={()=>setColorPopupVisible(false)}
        />} 
      trigger="click" 
      visible={colorPopupVisible}
      style={{position:'relative'}}
    >
      <Tag  onClick={changeColor} color={instanceColor} closable={true} onClose={closingTag}>{name}</Tag>
    </Popover>
  )
}

function ChangeTagColorPopup(props){
  let [isToChange,setIsToChange] = useState(false);
  const onSelectTagColorChange = (r) => {
    let ch = r.target.value === '1'? true : false;
    setIsToChange(ch);
    props.isTagColorChanged(ch);
  }

  const submitTagColorChange = () => {
    props.isTagColorChanged(isToChange);
  }

  let [color,setColor] = useState(null);
  const getRandomColor = () => {
    let c = generateRandomColor();
    setColor(c);
    props.handleColorChangeFromPopup(c);
  }

  return (
    <Row>
      This tag exists, do you want to change its color:
      <Radio.Group defaultValue="0" onChange={onSelectTagColorChange} buttonStyle="solid">
        <Radio.Button value="1" onClick={getRandomColor}>Give me some beautiful color</Radio.Button>
        <Radio.Button value="0">Stay on the original</Radio.Button>
      </Radio.Group>
      <div className="changeTagColorPopup-closing" onClick={() => props.setPopoverVisible()}>x</div>
    </Row>
  )
}

/* domain, url, title, category, tags[], key(keyborad), icon-url */ 
function AddFavouriteForm(props){
  const [form] = Form.useForm();
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
    let fields=[],tags=[]; //[[{name:'name',value:'tag1'},{name:'color',value:'hex1'}],[]]
    for(var key in values){
      fields.push({name:key,value: key === 'tags'? tagsArr : values[key]});
      if(key==='tags'){ //[{name:'tag1',color:'hex1'},{}]
        for(let t=0;t<tagsArr.length;t++){
          tags.push([{name:'name',value:tagsArr[t].name},{name:'color',value:tagsArr[t].color}]);
        }
      }
    }
    Promise.all([saveData('Favourites',fields),saveAll('Tags',tags)])
      .then((res)=>{
        console.log('saved!----',res);
        props.closeModal();
        props.handleAddedRecord();
      }).catch((e)=>console.log(e))
      .finally(()=>setLoading(false))

  };

  // tags:[{name:'',color:''},...]
  let [tagsArr,setTagsArr] = useState([]);
  const outputTags = (tag) => {
    if(tag.trim().length===0){
      form.setFieldsValue({tags:''});
      return;
    }
    for(let n=0;n<tagsArr.length;n++){
      if(tagsArr[n].name === tag){
        form.setFieldsValue({tags:''});
        return;
      }
    }
    // #notes: cannot use tagsArr.push(tag) because Array.prototype.push() returns the number of the modified array
    setTagsArr((prev) =>{ 
      let n = {name:tag,color:null};
      return prev.length? [...prev,n] : [n];
    });
    form.setFieldsValue({tags:''});
  }

  let [tagsRecord,setTagsRecord]=useState([]);
  useEffect(()=>{
    fetchAllRecords('Tags').then((t)=>{
      setTagsRecord(handleDataResults(t));
      console.log('tags records',tagsRecord)
    }).catch((e)=>console.log(e))
  },[tagsArr]);

  const changeTagColor = (tagName,newColor) => {
    setTagsArr((prev)=>{
      let temp = [];
      for(let p=0;p<prev.length;p++){
        temp.push(prev[p].name===tagName?{name:tagName,color:newColor}:prev[p]);
      }
      return temp;
    });
  }
  const closingTag = (t) => {
    t.persist();
    let tagToRemove = t.target.parentElement.parentElement.textContent;
    for(let t=0;t<tagsArr.length;t++){
      console.log(tagsArr[t],tagToRemove);
      if(tagsArr[t].name===tagToRemove){
        let copiedTagsArr = tagsArr;
        copiedTagsArr.splice(t,1);
        console.log(tagsArr);
      }
    }
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
        <Input className="theme-comfort-input"/>
      </Form.Item>
      <Form.Item label="Website" {...formItemLayout}>
        <Input.Group compact>
          <Form.Item name={['url']} rules={[validation(true,'Give me a url!')]} style={{marginBottom:0}}>
            <Input placeholder="Website's full url" className="theme-comfort-input"/>
          </Form.Item>
          <Form.Item name={['domain']} rules={[validation(false,'')]} style={{marginLeft:'0.5em',marginBottom:0}}>
            <Input placeholder="Website's domain" className="theme-comfort-input"/>
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label="Icon" name="icon" rules={[validation(false,'')]} {...formItemLayout}>
        <Input placeholder="Image url" className="theme-comfort-input"/>
      </Form.Item>
      <Form.Item label="Category" name="category" rules={[validation(false,'')]} {...formItemLayout}>
        <Input className="theme-comfort-input"/>
      </Form.Item>
      <Form.Item label="Key" name="key" rules={[validation(false,'')]} {...formItemLayout}>
        <Input placeholder="A single alphanumeric to press" className="theme-comfort-input"/>
      </Form.Item>
      <TagField rules={[validation(false,'')]} layout={formItemLayout} outputTags={outputTags}/>
      {tagsArr.length>0? (<Row className="addFavouriteForm--tagsBoard">
        <Col span={formItemLayout.labelCol.span}></Col>
        {tagsArr.map((t)=>{
          console.log('---rendered',t)
          return (
            <WrappedTag key={ "tag-"+ t.name} name={t.name} changeTagColor={changeTagColor} closingTag={closingTag} tagsRecord={tagsRecord}/>
          );
        })}
      </Row>) : null}
      <Form.Item {...formItemTailLayout}>
        <Button type="primary" htmlType="submit" loading={loading} className="theme-comfort-button">
          Add
        </Button>
      </Form.Item>
    </Form>
  )
}

const addFavouriteWrapperStyle = {
  minWidth:150,
  maxWidth:200,
  width:'30%',
}
const addFavouriteButtonStyle = {
  position:'absolute',
  left:'50%',
  top:'50%',
  transform:'translate(-50%,-50%)',
  borderRadius:'50%',
  fontSize:'3em',
  width:'50%',
  height:'50%',
  background:'transparent',
  boxShadow:'none'
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
    this.props.handleListenOnKeyboard();
  }

  onFormCancel(e){
    this.setState({ visible: false });
  }
  
  render(){
    const {visible,loading} = this.state;
    return (
      <div style={{...addFavouriteWrapperStyle,display:'inline-block',float:'left'}}>
        <div style={{paddingTop:'100%',width:'100%',position:'relative'}}>
          <Button type="primary" onClick={this.openForm} style={addFavouriteButtonStyle} className="theme-comfort-websiteCard-border theme-comfort-helpText">
            +
          </Button>
        </div>
        <Modal
          visible={visible}
          centered={true}
          title="Add a favourite"
          className="addFavourite-modal"
          style={{borderRadius:'5%'}}
          onCancel={this.onFormCancel}
          footer={null}
        >
          <AddFavouriteForm closeModal={this.onFormCancel} handleAddedRecord={this.props.handleAddedRecord}/>
        </Modal>
      </div>
    )
  }
}