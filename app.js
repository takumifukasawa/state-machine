
import keymirror from 'keymirror';
import StateMachine from './StateMachine';

const STATES = keymirror({
  LOADING     : 0,
  SHOWING_PAGE: 0
});

const EVENTS = keymirror({
  LOAD_PAGE   : 0,
  LOADED_PAGE : 0
});

// init state machine
const stateMachine = new StateMachine({
  init: undefined,
  events: [
    {
      eventName     : EVENTS.LOAD_PAGE,
      fromState     : undefined,
      toState       : STATES.LOADING,
      onBeforeEvent : () => console.log('before page load event')
    }, {
      eventName     : EVENTS.LOADED_PAGE,
      fromState     : STATES.LOADING,
      toState       : STATES.SHOWING_PAGE,
      onAfterEvent  : () => console.log('after page loaded event')
    }
  ]
});


stateMachine.emit(EVENTS.LOAD_PAGE);

window.onload = () => {
  stateMachine.emit(EVENTS.LOADED_PAGE);
}

