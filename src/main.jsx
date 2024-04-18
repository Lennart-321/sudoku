import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
//Test imports:
import { Calc } from "./Calc.js";
import { globalTest } from "./test.js";

Calc.initClass();
//globalTest();
const setSize = () => {
  //console.log("W/H", window.innerWidth, window.innerHeight + 40);
  let winSize = Math.min(window.innerWidth, window.innerHeight);
  let fontSize = Math.floor(winSize / 66);
  document.documentElement.style.setProperty("--fontSize", `${fontSize}px`);
};
setSize();
window.onresize = setSize;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
