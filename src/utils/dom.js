export const findParentEl = (t,targetClass) => {
  let p = t;
  while(typeof p.className !== 'string'){
    p = p.parentElement;
  }
  while(p.className.indexOf(targetClass) === -1){
    p = p.parentElement;
  }
  return p;
}