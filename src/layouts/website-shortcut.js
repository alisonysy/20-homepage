import React, {useState, useEffect} from 'react';
import WebsiteCard from '../parts/website-card';
import AddFavourite from '../parts/add-favourite';
import {fetchAllRecords,handleDataResults} from '../data-service/data-handling';

export default function WebsiteShortcut(props){
  let [records,setRecords] = useState([]);
  let [allTags,setAllTags] = useState([]);
  let [listenOnKeyboard,setListenOnKeyboard] = useState(true);

  useEffect(()=>{
    fetchAllRecords('Favourites').then((res)=>{
      setRecords([...handleDataResults(res)]);
    }).catch((e)=>console.log('fetch all records error',e));
  },[records.length])

  useEffect(()=>{
    fetchAllRecords('Tags').then((tags)=>{
      setAllTags([...handleDataResults(tags)]);
    }).catch((e)=>console.log('fetch all tags error',e));
  },[allTags.length])

  useEffect(()=>{
    document.addEventListener('keydown',function(k){
      if(k.code === 'ShiftLeft'){
        if(listenOnKeyboard){
          setListenOnKeyboard(false);
          props.handleListenerDisplay(false);
        }else{
          setListenOnKeyboard(true);
          props.handleListenerDisplay(true);
        }
      };
    })
  },[listenOnKeyboard])

  return (
    <div style={{textAlign:'left'}}>
    {
      records.map((r)=>{
        let tags = r.tags;
        for(let t=0;t<allTags.length;t++){
          for(let i=0;i<tags.length;i++){
            if(allTags[t].name === tags[i].name){
              tags[i].color = allTags[t].color;
            }
          }
        };
        return <WebsiteCard data={r} key={r.id} listenOnKeyboard={listenOnKeyboard} />
      })
    }
    <AddFavourite handleListenOnKeyboard={() => setListenOnKeyboard(false)} handleAddedRecord={()=>{setRecords([])}}/>
    </div>
  )
}