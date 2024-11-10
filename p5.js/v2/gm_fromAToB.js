//REFERENCES
const guessInput = document.getElementById('guess-input-field');

//VARIABLES
let startState;
let goalState;
let guessedStates = [];

function gm_fromAToB() {
  stateMap.onload = function () {
    const svgDocument = stateMap.contentDocument;
    if (svgDocument) {
      statesSVG = svgDocument.querySelectorAll('.sm_state');
      currentMapId = svgDocument.firstElementChild.id;
      //          TRIES_STORAGE_currentMap = `${TRIES_STORAGE}_${currentMapId}`; //findthestate

      country.states = [];

      renderMap();
      // statesSVG.forEach((stateHTML) => {
      //   state = new State(stateHTML);

      //   // console.log(state); //---------------------------------------------------

      //   //CREATING LIST OF ALL STATES
      //   country.addState(state);

      //   let appliedStateColor;
      //   console.log('includes?', guessedStates.includes(state));
      //   if (guessedStates.includes(state)) {
      //     appliedStateColor = 'green';
      //   }
      //   stateHTML.setAttribute('fill', appliedStateColor);
      // });

      country.states.forEach((state) => {
        state.populateNeighbors(country);
      });
    } else {
      console.log('no svgDocument'); //---------------------------------------------------
    }

    possibleStartStates = [...country.states];
    startState = cutOutRandomStateFrom(possibleStartStates);

    possibleGoalStates = [...removeStateFromList(startState, country.states)];
    goalState = cutOutRandomStateFrom(possibleGoalStates);

    //find the best route i. e. asign every state a numeric value to determine how far off it is from the ideal line

    stateNamePrompt.innerHTML = `<div>Go from</div>
    <div style='color: green'>${startState.name}</div>
    <div>to</div>
    <div style='color: red'>${goalState.name}</div>`;

    startState;
  };
}

//FUNCTIONS
function handleSubmitGuess(event) {
  event.preventDefault();

  let inputValue = event.target.querySelector('#guess-input-field').value;
  console.log(inputValue);

  let state = country.states.find((element) => inputMatchesStateName(inputValue, element));

  if (state != undefined) {
    guessedStates.push(state);
  }
  console.log(guessedStates);

  guessInput.value = '';
  renderMap();
}

function renderMap() {
  statesSVG.forEach((stateHTML) => {
    state = new State(stateHTML);

    // console.log(state); //---------------------------------------------------

    //CREATING LIST OF ALL STATES
    country.addState(state);

    let appliedStateColor;
    // console.log('includes?', includesState(guessedStates, state));

    // console.log('guessed', guessedStates);
    // console.log('state', state);
    if (state.id == startState.id) {
      appliedStateColor = 'green';
    }
    if (includesState(guessedStates, state)) {
      appliedStateColor = 'green';
    }
    stateHTML.setAttribute('fill', appliedStateColor);
  });
}

function includesState(states, state) {
  let includes;
  states.forEach((element) => {
    // console.log(state.id);
    // console.log(stateToCheck.id);
    if (element.id === state.id) includes = true;
  });
  return includes;
}

function inputMatchesStateName(inputValue, state) {
  return inputValue == state.name;
}
