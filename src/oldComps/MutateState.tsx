import React from 'react';
import memo from 'react';
import { useState, useEffect, useRef } from 'react';

//Following code demonstrates mutating state directly.
//The calls to JSON.stringify(obj) JSON.stringify(obj.x) etc return unmodified state.
//First button mutates state in obj (properties), however no rerender is triggered
//second button updates state by manually updating the 'manual' hook, this updates 'obj' with mutated data.


export function MutateState() {
    const [obj, setObj] = React.useState({x: 5, y: 30});
    const renderCount = useRef(0);
    const [manual,setManual] = useState(0);
    // Don't assign state to new (non-state) variables
    //const newCount = count;
    // Don't directly mutate state
    //const countPlusOne = count + 1;
  
    useEffect(() => {
      renderCount.current += 1;
    })
  
  
    return (
      <>
        <h1>Count: {JSON.stringify(obj,null,4)}</h1>
        <h1>Render Count: {renderCount.current}</h1> 
        <h1>manualRender count: {manual}</h1>
        <input 
          type="button"
          onClick={(e) => {
            console.log("Handler called: ");
            console.log("Before obj = ", JSON.stringify(obj,null,4));
            obj.x *=10;
            setObj(obj);
            console.log("After obj =", JSON.stringify(obj,null,4));
          }}
        />
        <h3>Value of x: {obj.x}</h3>
        <h3>Value of y: {obj.y}</h3>
        <label>
          Manually trigger a rerender:
          <input 
            type="button"
            onClick={() => {
              console.log("Manually triggering a render!!");
              setManual(manual+1);
            }}
          />
        </label>
      </>
    );
  }