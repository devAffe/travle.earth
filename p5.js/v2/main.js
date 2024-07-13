//REFERENCES
const stateMap = document.getElementById("state-map");
const stateNameWhileHovering = document.getElementById("state-name-while-hovering");
const stateNamePrompt = document.getElementById("state-name-prompt");

//COLORS
const startStateColor = "#126207";
const goalStateColor = "#A3260B";
const stateColor = "#88a4bc";
// const goalStateColor_selected = ;
// const startStateColor_selected = ;
const stateColor_selected = "#3b729f";
const stateColod_found = "#173669";

//VARIABLES
let country = new Country();
let state;
let possibleStartStates = [];
let possibleGoalStates = [];
let startState;
let goalState;

stateMap.onload = function () {
  const svgDocument = stateMap.contentDocument;
  if (svgDocument) {
    statesSVG = svgDocument.querySelectorAll(".sm_state");
    statesSVG.forEach((stateHTML) => {
      state = new State(stateHTML);

      console.log(state); //---------------------------------------------------

      //CREATING LIST OF ALL STATES
      country.addState(state);

      //SETUP EACH STATE
      // stateHTML.addEventListener("mouseover", function () {
      //   this.setAttribute("fill", stateColor_selected);
      //   stateNameWhileHovering.innerText = this.attributes.name.value;
      //   stateNameWhileHovering.style.display = "block";
      // });

      // stateHTML.addEventListener("mouseleave", function () {
      //   this.setAttribute("fill", stateColor);
      //   stateNameWhileHovering.style.display = "none";
      // });

      stateHTML.addEventListener("click", function () {
        if (this.id == startState.id) {
          this.setAttribute("fill", stateColod_found);

          removeValue(startState, country.states);

          startState = getRandomStateFrom(country.states);
          stateNamePrompt.innerText = startState.name;
        }
      });
    });

    country.states.forEach((state) => {
      state.populateNeighbors(country);
    });
  } else {
    console.log("no svgDocument"); //---------------------------------------------------
  }
};

setTimeout(function () {
  possibleStartStates = [...country.states];
  possibleGoalStates = [...country.states];

  startState = getRandomStateFrom(possibleStartStates);
  stateNamePrompt.innerText = startState.name;
}, 100);

function getRandomStateFrom(states) {
  return states[rng(states.length)];
}
