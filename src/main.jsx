import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
//Test imports:
import { Calc } from "./Calc.js";
import { globalTest } from "./test.js";

Calc.initClass();
globalTest();
const setSize = () => {
  let winSize = Math.min(window.innerWidth, window.innerHeight);
  let fontSize = Math.floor(winSize / 65);
  document.documentElement.style.setProperty("--fontSize", `${fontSize}px`);
};
setSize();
window.onresize = setSize;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//Test stuff
// console.log("Test: Comibation loop");
// let count = 0;
// for (let comb = Calc.firstCombination(4); comb.length > 0; Calc.nextCombination(comb, 7)) {
//   console.log(comb);
//   count++;
// }
// console.log(count);
