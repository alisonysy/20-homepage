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
    <div className="App">
      {/* <WebsiteShortcut /> */}
      {/* <WebsiteCard /> */}
      {/* <AddFavourite /> */}
      <Note />
      <NoteSection />
    </div>
  );
}

export default App;
