import { makeObservable, observable } from "mobx";

export default class CounterStore {
  title = "Counter store";
  count = 42;

  constructor() {
    makeObservable(this, {
      title: observable,
      count: observable,
    });
  }

  increment = (amount: number = 1) => {
    this.count += amount;
  };

  decrement = (amount: number = 1) => {
    this.count -= amount;
  };
}
