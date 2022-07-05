import React from 'react';
import ReactDOM from 'react-dom/client';
import {useState,useEffect,useRef} from 'react';

export function Outer() {
    const [val,setVal] = useState(0);
    const outerRenderCount = useRef(0)
  
    useEffect(() => {
      outerRenderCount.current += 1;
    })
  
    
    console.log("Outer re-render");
    return (
    <>
      <h1>Outer Comp:</h1>
      <h3>Outer Render Count: {outerRenderCount.current}</h3>
      <input 
        type="number"  
        value={val}
        onChange={(e) => {setVal(parseInt(e.target.value))}}
      />
      <Inner />
    </>
    )
  }
  
  function Inner() {
    const [x,setX] = useState(0);
    const innerRenderCount = useRef(0)
  
    useEffect(() => {
      innerRenderCount.current +=1;
    })
  
    console.log("Inner re-render");
  
    return (
      <>
        <h3>Inner Comp</h3>
        <h3>Inner Render Count: {innerRenderCount.current}</h3>
        <input 
        type="number"  
        value={x}
        onChange={(e) => {setX(parseInt(e.target.value))}}
      />
      </>
    )
  }
  
  const out = <Outer />