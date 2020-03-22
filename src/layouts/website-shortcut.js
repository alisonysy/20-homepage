import React, {useState, useEffect} from 'react';
import WebsiteCard from '../parts/website-card';
import {fetchAllRecords,handleDataResults} from '../data-service/data-handling';

export default function WebsiteShortcut(){
  let [records,setRecords] = useState([]);
  let [allTags,setAllTags] = useState([]);

  useEffect(()=>{
    fetchAllRecords('Favourites').then((res)=>{
      setRecords([...handleDataResults(res)]);
      console.log(records);
    }).catch((e)=>console.log('fetch all records error',e));
  },[records.length])

  useEffect(()=>{
    fetchAllRecords('Tags').then((tags)=>{
      setAllTags([...handleDataResults(tags)]);
      console.log(allTags);
    }).catch((e)=>console.log('fetch all tags error',e));
  },[allTags.length])

  return (
    records.map((r)=>{
      return <WebsiteCard data={r} key={r.id} />
    })
  )
}