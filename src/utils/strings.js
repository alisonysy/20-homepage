export const appendHttp = (url,notSecure) => {
  let regExp = /^http[s*]:\/\//g;
  if(!url.match(regExp)){
    url = notSecure? ('http://'+url) : ('https://'+url) ;
  };
  return url;
}

export const wrapToStart = (max,idx) => {
  return idx%max;
}