import { useState } from "react";
import { Sudoku } from "./Sudoku";
import { Settings } from "./Settings";
import { Calc } from "./Calc";
import "./Menu.css";
import { TimeDisplay } from "./TimeDisplay";

export function Menu({ refresh }) {
  const [updateMenuCount, setUpdateMenuCount] = useState(0);
  Sudoku.updateMenu = function () {
    setUpdateMenuCount(c => c + 1);
  };

  const newGame = function (level = 0) {
    if (!level) level = Math.floor(Math.random() * 12);
    Sudoku.createNewGame(Math.floor(level));
    refresh();
  };

  // prettier-ignore
  const onOffMenuItem = function (text, setting, settingsMethod) {
    return (
      <a className="menu-alt" onClick={() => { settingsMethod(); refresh(); console.log(Settings.showHelpSymbols, Settings.showAllHelp, Settings.showOnlyEditedHelp); }}>
        <span className={setting ? "setting-on" : "setting-off"}></span>
        {/* <span>&nbsp;</span> */}
        {text}
      </a>
    );
  };

  const solveGame = function () {
    Calc.solveGame(Sudoku.currentGame);
    refresh();
  };

  // prettier-ignore
  return (
    <header className="header">
      <nav className="menu">
        <div className="dropdown">
          <button className="dropbtn" onClick={() => newGame()}>
            Game
          </button>
          <div className="dropdown-content">
            <a className="menu-alt" onClick={() => newGame(1)}>
              New Easy
            </a>
            <a className="menu-alt" onClick={() => newGame(2)}>
              New Medium
            </a>
            <a className="menu-alt" onClick={() => newGame(100)}>
              New Hard
            </a>
            <a className="menu-alt" onClick={() => newGame()}>
              New Random
            </a>
            <a className="menu-alt" onClick={() => newGame(-1)}>
              {Sudoku.isDefineGameState ? "Ready - Start my Game" : "Define Game"}
            </a>
            <a className="menu-alt" onClick={() => newGame(-2)}>
              Restart
            </a>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">
            Cheats
          </button>
          <div className="dropdown-content cheats">
            {onOffMenuItem( "Show focus buttons", Settings.showFocusButtons, Settings.toggleShowFocusButtons )}
            {onOffMenuItem( "Show support symbols", Settings.showHelpSymbols, Settings.toggleShowHelpSymbols )}
            {onOffMenuItem( "Show all support", Settings.showAllHelp, Settings.toggleShowAll )}
            {onOffMenuItem("Show edited only", Settings.showOnlyEditedHelp, Settings.toggleShowEditedOnly)}
            {onOffMenuItem("Auto-reduce", Settings.autoReduceHelpSymbols, Settings.toggleAutoReduceHelpSymbols)}
            <a className="menu-alt" onClick={() => { if (Sudoku.autoReduceOnce()) refresh(); }}>Auto-reduce once</a>
            <a className="menu-alt" onClick={() => solveGame()}>Solve game</a>
            {onOffMenuItem("Show errors", Settings.showErrors, Settings.toggleShowErrors)}
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">
            Info
          </button>
          <div className="dropdown-content settings">
            {onOffMenuItem( "Show time", Settings.showTime, Settings.toggleShowTime )}
            <a className="menu-alt" onClick={Sudoku.showSudokuInfo}>Info</a>
          </div>
        </div>
        </nav>
        <div className="head-info"><TimeDisplay /></div>
      </header>
  );
}
