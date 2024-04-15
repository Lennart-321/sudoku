import { CalcBoard } from "./CalcBoard";
import { Sudoku } from "./Sudoku";
import "./Menu.css";
import { Settings } from "./Settings";
import { Calc } from "./Calc";

export function Menu({ refresh }) {
  const newGame = function (level = 0) {
    if (!level) level = Math.floor(Math.random() * 12);
    Sudoku.createNewGame(Math.floor(level));
    refresh();
  };

  // prettier-ignore
  const onOffMenuItem = function (text, setting, settingsMethod) {
    return (
      <a className="menu-alt" onClick={() => { settingsMethod(); refresh(); }}>
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
        <div className="dropdown-content">
          {onOffMenuItem( "Show Help Symbols", Settings.showHelpSymbols, Settings.toggleShowHelpSymbols )}
          {onOffMenuItem("Auto-reduce help symbols", Settings.autoReduceHelpSymbols, Settings.toggleAutoReduceHelpSymbols)}
          {onOffMenuItem("Show Errors", Settings.showErrors, Settings.toggleShowErrors)}
          <a className="menu-alt" onClick={() => solveGame()}>Solve Game</a>
          {/* <a
            className="menu-alt"
            onClick={() => {
              Settings.toggleAutoReduceHelpSymbols();
              refresh();
            }}
          >
            <span className={Settings.autoReduceHelpSymbols ? "setting-on" : "setting-off"}>
              {Settings.autoReduceHelpSymbols ? "V" : " "}
            </span>
            <span>&nbsp;</span>
            Auto reduce help symbols
          </a>
          <a
            className="menu-alt"
            onClick={() => {
              Settings.toggleShowErrors();
              refresh();
            }}
          >
            <span className={Settings.showErrors ? "setting-on" : "setting-off"}>{Settings.showErrors ? "V" : ""}</span>
            <span>&nbsp;</span>
            Show Errors
          </a> */}
        </div>
      </div>
    </nav>
  );
}
