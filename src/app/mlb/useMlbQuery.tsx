import { useEffect, useRef, useState } from 'react';

/** Keyed state avoids rendering data from an old season after a fast filter change. */
export function useMlbQuery<T>(key:string|null, load:()=>Promise<T>) {
  const loader=useRef(load);loader.current=load;
  const [retry,setRetry]=useState(0);
  const [state,setState]=useState<{key:string|null;data?:T;error?:string}>({key:null});
  useEffect(()=>{
    if(key===null)return;
    let active=true;setState({key});
    loader.current().then(data=>{if(active)setState({key,data});}).catch(error=>{if(active)setState({key,error:error instanceof Error?error.message:'Could not load MLB data.'});});
    return()=>{active=false;};
  },[key,retry]);
  const current=state.key===key?state:{key};
  return {...current,loading:key!==null&&!current.data&&!current.error,retry:()=>setRetry(n=>n+1)};
}
export function QueryStatus({error,retry,label='Loading MLB data…'}:{error?:string;retry:()=>void;label?:string}){
  return error?<div role="alert"><p>{error}</p><button onClick={retry}>Retry</button></div>:<p role="status">{label}</p>;
}
