import React from 'react';
import './App.css';

import 'antd/dist/antd.css';
import WebsiteCard from './parts/website-card';
import AddFavourite from './parts/add-favourite';

function App() {
  return (
    <div className="App">
      {/* <WebsiteCard /> */}
      <AddFavourite />
    </div>
  );
}

export default App;
