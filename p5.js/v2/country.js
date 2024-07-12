class Country {
  states = [];

  constructor() {}

  addState(state) {
    this.states.push(state);
  }

  getStateByCode(input) {
    return this.states.find((e) => e.internalCode == input);
  }
}
