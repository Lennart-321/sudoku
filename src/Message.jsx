import { useRef, useState } from "react";
import { Sudoku } from "./Sudoku";
import "./Message.css";

let currentMessageId = 0;
export function Message(/*{ removeMessage, jsxMessage, timeoutSec }*/) {
  const [messageInfo, setMessage] = useState([null, 0]);
  //const messageId = useRef(0);
  const timeOutId = useRef(0);
  const thisMessageId = ++currentMessageId;

  if (timeOutId.current != 0) {
    clearTimeout(timeOutId.current);
    timeOutId.current = 0;
  }

  Sudoku.importantMessage = function (message, color = "#080", timeoutSec = 4) {
    let jsx;
    if (Array.isArray(message)) {
      jsx = message.map((m, ix) => (
        <p key={ix} style={{ color: color }}>
          {m}
        </p>
      ));
    } else {
      jsx = <p style={{ color: color }}>{message}</p>;
    }
    setMessage([jsx, timeoutSec]);
  };
  const removeMessage = function (msgId) {
    if (msgId === currentMessageId) {
      setMessage([null, -1, 0]);
    }
  };

  if (messageInfo[0] && messageInfo[1] > 0) {
    timeOutId.current = setTimeout(() => {
      removeMessage(thisMessageId);
    }, messageInfo[1] * 1000);
  }

  return messageInfo[0] ? (
    <div id="message-modal-outer" onClick={() => removeMessage(thisMessageId)}>
      <div id="message-modal-inner">
        <span className="close-message">&times;</span>
        {messageInfo[0]}
      </div>
    </div>
  ) : (
    <></>
  );
}
