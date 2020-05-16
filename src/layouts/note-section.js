import React, {useState, useEffect} from 'react';
import Note from '../parts/note';
import {fetchAllRecords,handleDataResults,deleteRecord} from '../data-service/data-handling';

export default function NoteSection(){
  let [records,setRecords] = useState([]);
  const addNewRecord = (newRecord) => {
    setRecords([...records,newRecord]);
  }

  const deleteRecord = (id) => {
    let temp = records.filter(r => r.id !== id);
    setRecords(temp);
  }

  useEffect(()=>{
    fetchAllRecords('Notes').then((res)=>{
      setRecords([...handleDataResults(res,['createdAt','updatedAt'])]);
    }).catch((e)=>console.log('fetch all records error',e));
  },[records.length])

  return (
    <div style={{textAlign:'left',display:'flex',flexFlow:'row nowrap',overflow:'auto'}}>
    {
      records.map((r)=>{
        return <Note data={r} key={r.id} addNewRecord={addNewRecord} deleteRecord={deleteRecord}/>
      })
    }
      <Note  addNewRecord={addNewRecord} key="add-note"/>
    </div>
  )
}