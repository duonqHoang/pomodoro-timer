import "./App.css";
import { useState, useRef } from "react";
import { useTimer } from "react-use-precision-timer";
import clockAlarm from "./clock-alarm.mp3";

const initialState = {
  sessionLength: 25,
  breakLength: 5,
  minutesLeft: 25,
  secondsLeft: 0,
  isBreak: false,
  isRunning: false,
};

const ITEMS = {
  sessionLength: "sessionLength",
  breakLength: "breakLength",
};

const ACTIONS = {
  up: "up",
  down: "down",
};

function formatNumber(number) {
  if (number < 10) return "0".concat(number.toString());
  return number.toString();
}

function App() {
  let [state, setState] = useState(initialState);
  const alarmSound = useRef(null);
  const alarm = alarmSound.current;

  const timer = useTimer({
    delay: 1000,
    callback: () => {
      timerRunning();
    },
  });

  const changeLength = function (itemName, action) {
    if (state.isRunning) return;
    if (state[itemName] === 60 && action === ACTIONS.up) return;
    if (state[itemName] === 1 && action === ACTIONS.down) return;
    if (
      (state.isBreak && itemName === ITEMS.breakLength) ||
      (!state.isBreak && itemName === ITEMS.sessionLength)
    ) {
      let newLength = state[itemName] + (action === ACTIONS.up ? 1 : -1);
      return setState({
        ...state,
        [itemName]: newLength,
        minutesLeft: newLength,
        secondsLeft: 0,
      });
    }
    return setState({
      ...state,
      [itemName]: state[itemName] + (action === ACTIONS.up ? 1 : -1),
    });
  };

  const reset = function () {
    if (!alarm.paused) alarm.pause();
    alarm.currentTime = 0;
    timer.stop();
    setState(initialState);
  };

  const timerToggle = function () {
    if (state.isRunning) {
      timer.stop();
      setState({ ...state, isRunning: false });
    } else {
      timer.start();
      setState({ ...state, isRunning: true });
    }
  };

  function timerRunning() {
    if (state.minutesLeft === 0 && state.secondsLeft === 0) {
      setState({
        ...state,
        minutesLeft: state.isBreak ? state.sessionLength : state.breakLength,
        isBreak: !state.isBreak,
      });
      return;
    }
    if (state.secondsLeft === 0) {
      setState({
        ...state,
        minutesLeft: state.minutesLeft - 1,
        secondsLeft: 59,
      });
      return;
    }
    if (state.minutesLeft === 0 && state.secondsLeft === 1) {
      alarm.play();
      setState({
        ...state,
        minutesLeft: state.minutesLeft,
        secondsLeft: state.secondsLeft - 1,
      });
      return;
    }
    setState({
      ...state,
      minutesLeft: state.minutesLeft,
      secondsLeft: state.secondsLeft - 1,
    });
  }

  return (
    <div className="pomodoro">
      <div className="bell">
        <div className="black-line"></div>
        <div className="black-circle"></div>
      </div>
      <h2 className="title">Custom Pomodoro Timer</h2>
      <div className="settings">
        <div className="break ">
          <div id="break-label" class="label">
            Break Length
          </div>
          <div className="controller">
            <button
              id="break-decrement"
              onClick={() => changeLength(ITEMS.breakLength, ACTIONS.down)}
            >
              <i className="fa-solid fa-caret-down"></i>
            </button>
            <div id="break-length">{state.breakLength}</div>
            <button
              id="break-increment"
              onClick={() => changeLength(ITEMS.breakLength, ACTIONS.up)}
            >
              <i className="fa-solid fa-caret-up"></i>
            </button>
          </div>
        </div>
        <div className="divider"></div>
        <div className="session">
          <div id="session-label" class="label">
            Session Length
          </div>
          <div className="controller">
            <button
              id="session-decrement"
              onClick={() => changeLength(ITEMS.sessionLength, ACTIONS.down)}
            >
              <i className="fa-solid fa-caret-down"></i>
            </button>
            <div id="session-length">{state.sessionLength}</div>
            <button
              id="session-increment"
              onClick={() => changeLength(ITEMS.sessionLength, ACTIONS.up)}
            >
              <i className="fa-solid fa-caret-up"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="timer">
        <div id="timer-label">
          {state.isBreak ? "Break Time!" : "Productive Time!"}
        </div>
        <div id="time-left">
          {formatNumber(state.minutesLeft)}:{formatNumber(state.secondsLeft)}
        </div>
        <div className="timer-controller">
          <button
            id="start_stop"
            onClick={() => timerToggle()}
            title="Start/Stop"
          >
            <i className="fa-solid fa-play"></i>
            <i className="fa-solid fa-pause"></i>
          </button>
          <button id="reset" onClick={() => reset()} title="Reset">
            <i className="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
      </div>
      <audio
        id="beep"
        ref={alarmSound}
        src={clockAlarm}
        type="audio/mpeg"
        preload="auto"
      />
      <div class="stand left"></div>
      <div class="stand right"></div>
    </div>
  );
}

export default App;
