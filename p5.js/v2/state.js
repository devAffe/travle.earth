class State {
  id;
  class;

  internalCode;
  name;
  parentArea;
  neighborsInternalCodes = [];
  neighbors = [];

  constructor(stateHTML) {
    this.id = stateHTML.id;
    this.class = stateHTML.attributes.class.value;

    this.internalCode = stateHTML.attributes.internal_code.value;
    this.name = stateHTML.attributes.name.value;
    this.parentArea = stateHTML.attributes.parent_area?.value ?? "N/A";
    this.neighborsInternalCodes = stateHTML.attributes.neighbors_internal_codes.value.split(" ");
  }

  populateNeighbors(country) {
    this.neighborsInternalCodes.forEach((nbghCode) => {
      this.neighbors.push(country.getStateByCode(nbghCode));
    });
  }
}
