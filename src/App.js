import React from 'react';
import './App.css';

import 'antd/dist/antd.css';
import WebsiteShortcut from './layouts/website-shortcut';
import NoteSection from './layouts/note-section';


function App() {
  return (
    <div className="App" style={{display:'flex',flexFlow:'row nowrap'}}>
      <div style={{width:'50%',padding:'1.5em',borderRight:'1px dotted #ffc98b'}}>
        <WebsiteShortcut />
      </div>
      <div style={{width:'50%',height:'100vh',padding:'1.5em'}}>
        <NoteSection />
      </div>
    </div>
  );
}

export default App;
