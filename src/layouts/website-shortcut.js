import React, {useState, useEffect} from 'react';
import WebsiteCard from '../parts/website-card';
import {fetchAllRecords,handleDataResults} from '../data-service/data-handling';

export default function WebsiteShortcut(){
  let [records,setRecords] = useState([]);

  useEffect(()=>{
    fetchAllRecords('Favourites').then((res)=>{
      console.log(res);
      setRecords([...handleDataResults(res)]);
      console.log(records);
    }).catch((e)=>console.log('fetch all records error',e));
  },[records.length])

  return (
    records.map((r)=>{
      return <WebsiteCard data={r} />
    })
  )
}