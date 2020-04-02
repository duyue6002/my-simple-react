import React from "./react";
import ReactDOM from "./reactdom";

// Notes: 为什么看上去没用到React还需要调用呢？
// JSX 语法糖会把“DOM标签”转化成虚拟DOM对象

function tick() {
  const element = (
    <div>
      <input type="checkbox" checked={false}></input>
      <h1>Hello World</h1>
      <h2>It is {new Date().toLocaleTimeString()}</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById("root"));
}

setInterval(tick, 1000);
