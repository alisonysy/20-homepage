import React, {useState, useEffect} from 'react';
import Note from '../parts/note';
import {fetchAllRecords,handleDataResults} from '../data-service/data-handling';

export default function NoteSection(){
  let [records,setRecords] = useState([]);
  const addNewRecord = (newRecord) => {
    setRecords([...records,newRecord]);
  }

  useEffect(()=>{
    fetchAllRecords('Notes').then((res)=>{
      setRecords([...handleDataResults(res,['createdAt','updatedAt'])]);
    }).catch((e)=>console.log('fetch all records error',e));
  },[records.length])

  return (
    <div>
    {
      records.map((r)=>{
        return <Note data={r} key={r.id} addNewRecord={addNewRecord}/>
      })
    }
      <Note  addNewRecord={addNewRecord}/>
    </div>
  )
}