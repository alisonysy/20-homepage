const AV = require('leancloud-storage');

export const saveData = (name,fields) => {
  let Db = AV.Object.extend(name);
  let db_ins = new Db();
  if(Object.prototype.toString.call(fields) !== '[object Array]'){
    throw new Error('Must provide an array!')
  }
  for(let n = 0;n<fields.length;n++){
    db_ins.set(fields[n].name,fields[n].value);
  }
  return db_ins.save();
}

export const fetchAllRecords = (name) => {
  let q = new AV.Query(name);
  return q.find();
}

export const handleDataResults = (resultArr) => {
  return resultArr.map((r)=>{
    let id = r.id;
    return {...r.attributes,id}
  })
}

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