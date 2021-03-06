const AV = require('leancloud-storage');

export const saveData = (name,fields) => { // save only one record at a time
  let Db = AV.Object.extend(name);
  let db_ins = new Db();
  if(Object.prototype.toString.call(fields) !== '[object Array]'){
    throw new Error('Must provide an array!')
  }
  if(!fields.length)return;
  for(let n = 0;n<fields.length;n++){
    db_ins.set(fields[n].name,fields[n].value);
  }
  return db_ins.save();
}

export const saveAll = (name,fieldsArr) => {// save multiple records at a time
  let allObjToSave = [];
  let Db = AV.Object.extend(name);
  if(!fieldsArr.length) return;
  for(let d=0;d<fieldsArr.length;d++){ // for tag records: should be an array of fields array
    let db_ins = new Db();
    for(let f=0;f<fieldsArr[d].length;f++){ // for each tag record: [{name:'name',value:'tag1'},{name:'color',value:'hex1'}]
      db_ins.set(fieldsArr[d][f].name,fieldsArr[d][f].value);
    };
    allObjToSave.push(db_ins);
  }
  return AV.Object.saveAll(allObjToSave);
}

export const fetchAllRecords = (name) => {
  let q = new AV.Query(name);
  return q.find();
}

export const updateARecord = (name,id,fields) => {
  let updateR = AV.Object.createWithoutData(name,id);
  if(Object.prototype.toString.call(fields) !== '[object Array]'){
    throw new Error('Must provide an array!')
  }
  if(!fields.length)return;
  for(let n = 0;n<fields.length;n++){
    updateR.set(fields[n].name,fields[n].value);
  }
  return updateR.save();
}


export const handleDataResults = (resultArr,addedFields) => {
  return resultArr.map((r)=>{
    let id = r.id, re={...r.attributes,id}, copyOfAddedFields = [];
    if(addedFields && addedFields.length){
      copyOfAddedFields = Array.prototype.slice.call(addedFields);
      copyOfAddedFields = copyOfAddedFields.map((f)=> {
        let o = {};
        o[f] = r[f];
        return o;
      });
      copyOfAddedFields.map((f)=>{
        re = {...re,...f}
      });
    }
    return re;
  })
}

export const deleteRecord = (name,id) => {
  const r = AV.Object.createWithoutData(name, id);
  return r.destroy(); 
}


// for one-time use
export const _uploadImg = (elId) => {
  let inp = document.getElementById(elId);
  inp.addEventListener('input',function(f){
    if(f.target.files.length){
      let localFile = f.target.files[0];
      let file = new AV.File('ico-placeholder.png',localFile);
      file.save().then((f)=>{console.log('success',f.id)}).catch((e)=>{console.log('save failure',e)})
    }
  })
}