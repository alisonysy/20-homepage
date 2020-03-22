import React, {useState, useEffect} from 'react';
import WebsiteCard from '../parts/website-card';
import {fetchAllRecords,handleDataResults} from '../data-service/data-handling';

export default function WebsiteShortcut(){
  let [records,setRecords] = useState([]);
  let [allTags,setAllTags] = useState([]);

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

  return (
    records.map((r)=>{
      let tags = r.tags, tagsRecord=[];
      for(let t=0;t<allTags.length;t++){
        for(let i=0;i<tags.length;i++){
          if(allTags[t].name === tags[i].name){
            tags[i].color = allTags[t].color;
          }
        }
      };
      return <WebsiteCard data={r} key={r.id} />
    })
  )
}