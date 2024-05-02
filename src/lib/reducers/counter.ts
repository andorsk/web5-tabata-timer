export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export const DECREMENT_COUNTER = "DECREMENT_COUNTER";
export const SET_COUNTER = "SET_COUNTER";

export interface IncrementAction {
  type: typeof INCREMENT_COUNTER;
}

export interface DecrementAction {
  type: typeof DECREMENT_COUNTER;
}

export interface SetAction {
  type: typeof SET_COUNTER;
  payload: number;
}

export type CounterActionTypes = IncrementAction | DecrementAction | SetAction;

export interface CounterState {
  counter: Counter;
}

class Counter {
  value: number;
  id: number;

  constructor(value: number) {
    this.value = value;
    this.id = Math.random();
  }

  increment() {
    this.value += 1;
  }

  decrement() {
    this.value -= 1;
  }

  set(value: number) {
    this.value = value;
  }
}

const initialState: CounterState = {
  counter: new Counter(0),
};

export const counterReducer = (
  state: CounterState = initialState,
  action: CounterActionTypes,
): CounterState => {
  switch (action.type) {
    case INCREMENT_COUNTER:
      state.counter.increment();
      return { ...state };
    case DECREMENT_COUNTER:
      state.counter.decrement();
      return { ...state };
    case SET_COUNTER:
      console.log("set counter action action");
      state.counter.set(action.payload);
      return { ...state };
    default:
      return state;
  }
};

export const incrementCounter = (): IncrementAction => ({
  type: INCREMENT_COUNTER,
});

export const decrementCounter = (): DecrementAction => ({
  type: DECREMENT_COUNTER,
});

export const setCounter = (i: number): SetAction => {
  console.log("setting counter");
  return {
    type: SET_COUNTER,
    payload: i,
  };
};
