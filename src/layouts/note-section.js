import React, {useState, useEffect} from 'react';
import Note from '../parts/note';
import {fetchAllRecords,handleDataResults} from '../data-service/data-handling';

export default function NoteSection(){
  let [records,setRecords] = useState([]);
  const addNewRecord = (newRecord) => {
    console.log(newRecord)
  }

  useEffect(()=>{
    fetchAllRecords('Notes').then((res)=>{
      setRecords([...handleDataResults(res,['createdAt'])]);
    }).catch((e)=>console.log('fetch all records error',e));
  },[])

  return (
    <div>
      <Note  addNewRecord={addNewRecord}/>
    {
      records.map((r)=>{
        return <Note data={r} key={r.id} addNewRecord={addNewRecord}/>
      })
    }
    </div>
  )
}