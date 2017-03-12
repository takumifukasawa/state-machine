
import _ from 'lodash';
import eventemitter from 'eventemitter3';

export default class StateMachine extends eventemitter {
  constructor({ init = undefined, events }) {
    super();
    
    this._state = init;
    this._events = events;
    
    _.forEach(this._events, event => {
      const eventName = event.eventName;
      const fromState = event.fromState;
      const toState = event.toState;

      // set event
      this.on(eventName, () => {
        this.fireEvent(eventName, fromState, toState);
      });

      // イベントが開始されるとき用のlistener
      if(event.onBeforeEvent) {
        this.on(`onBefore${eventName}`, event.onBeforeEvent);
      }

      // stateを離れる時用のlistener
      if(event.onLeaveState) {
        this.on(`onLeave${fromState}`, event.onLeaveState);
      }

      // stateが切り替わる直前のlistener
      if(event.onEnterState) {
        this.on(`onEnter${toState}`, event.onEnterState);
      }

      // event終了時のlistener
      if(event.onAfterEvent) {
        this.on(`onAfter${eventName}`, event.onAfterEvent);
      }
    });
  }

  setState(state) {
    this._state = state;
  }

  getState() {
    return this._state;
  }

  checkState(state) {
    return state === this._state;
  }

  isCorrectFromState(fromState) {
    if(_.isArray(fromState)) {
      const hasState = _.find(fromState, state => {
        return this.checkState(state);
      });
      return hasState;
    } else {
      return this.checkState(fromState);
    }
  }

  fireEvent(eventName, fromState, toState) {
    const hasState = this.isCorrectFromState(fromState);

    if(!hasState){
      throw 'fromState is incorrect.';
    }
    
    // fire before event listener
    const onBeforeEvent = `onBefore${eventName}`;
    if(this.listeners(onBeforeEvent, true)) {
      this.emit(onBeforeEvent);
    }

    // fire leave state listener
    const onLeaveState = `onLeave${fromState}`;
    if(this.listeners(onLeaveState, true)) {
      this.emit(onLeaveState);
    }

    // fire enter state listener
    const onEnterState = `onEnter${toState}`;
    if(this.listeners(onEnterState, true)) {
      this.emit(onEnterState);
    }

    // set new state
    const beforeState = this.getState();
    console.log(`change state ${beforeState} -> ${toState}`);
    
    this.setState(toState);

    // fire after event listener
    const onAfterEvent = `onAfter${eventName}`;
    if(this.listeners(onAfterEvent, true)) {
      this.emit(onAfterEvent);
    }
  }
}
