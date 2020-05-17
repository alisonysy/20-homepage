import React,{useState} from 'react';
import './App.css';

import 'antd/dist/antd.css';
import WebsiteShortcut from './layouts/website-shortcut';
import NoteSection from './layouts/note-section';


function App() {
  let [isListening,setIsListening] = useState(true);

  return (
    <div className="App" style={{display:'flex',flexFlow:'row nowrap',position:'relative'}}>
      <div style={{position:'absolute',top:0,width:'100%',height:'1.5em',background:'#e79796',color:'#fff'}}>Listening on keyboard - {isListening? 'On' : 'Off'}</div>
      <div style={{width:'50%',padding:'2.5em 1.5em',borderRight:'1px dotted #ffc98b'}}>
        <WebsiteShortcut handleListenerDisplay={(val)=>setIsListening(val)}/>
      </div>
      <div style={{width:'50%',height:'100vh',padding:'2.5em 1.5em'}}>
        <NoteSection />
      </div>
    </div>
  );
}

export default App;
