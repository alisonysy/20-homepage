import React from 'react';
// import './style.css';

import { Modal, Button } from 'antd';

export default class AddFavourite extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading:false,
      visible:false
    }
    this.openForm = this.openForm.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormCancel = this.onFormCancel.bind(this);
  }

  openForm(){
    this.setState({visible:true});
  }

  onFormSubmit(e){
    this.setState({ loading: true });
    console.log('submit',e);
    setTimeout(()=>{
      this.setState({loading:false,visible:false})
    },2000);
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
          onOk={this.onFormSubmit}
          onCancel={this.onFormCancel}
          footer={[
            <Button key="back" onClick={this.onFormCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.onFormSubmit}>
              Submit
            </Button>,
          ]}
        >
          <p>Some contents...</p>
        </Modal>
      </div>
    )
  }
}