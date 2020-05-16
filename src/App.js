import React from 'react';
import './App.css';

import 'antd/dist/antd.css';
import WebsiteShortcut from './layouts/website-shortcut';
import NoteSection from './layouts/note-section';
import WebsiteCard from './parts/website-card';
import AddFavourite from './parts/add-favourite';
import Note from './parts/note';


function App() {
  return (
    <div className="App" style={{display:'flex',flexFlow:'row nowrap'}}>
      <div style={{width:'50%',padding:'1.5em'}}>
        <WebsiteShortcut />
      </div>
      <div style={{width:'50%',height:'100vh',padding:'1.5em'}}>
        <NoteSection />
      </div>
      {/* <WebsiteCard /> */}
      {/* <AddFavourite /> */}
    </div>
  );
}

export default App;
