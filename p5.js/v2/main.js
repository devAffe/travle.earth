//REFERENCES
const body = document.getElementById('body');
const stateMap = document.getElementById('state-map');
const stateNameWhileHovering = document.getElementById('state-name-while-hovering');
const stateNamePrompt = document.getElementById('state-name-prompt');
let currentMapId;

//COLORS
const startStateColor = '#126207';
const goalStateColor = '#A3260B';
const stateColor = '#88a4bc';
const stateColor_t1 = '#03AA00'; //darkish green
const stateColor_t2 = '#A3D123'; //darkish yellow
const stateColor_t3 = '#D36300'; //orange
const stateColor_t4 = '#CE1301'; //darkish red
// const goalStateColor_selected = ;
// const startStateColor_selected = ;
const stateColor_selected = '#3b729f';
const stateColod_found = '#173669';

//CONSTANTS
const TRIES_STORAGE = 'tries';

//SESSION STORAGE
let TRIES_STORAGE_currentMap;
let currentMapUrl = sessionStorage.getItem('currentMapUrl') ?? '../res/germany.svg';

//VARIABLES
let country = new Country();
let state;
let possibleStartStates = [];
let possibleGoalStates = [];
let startState;
let goalState;
let promptState;

let triesTillFoundCorrectState = {};
let tryCounter;

body.onload = function () {
  stateMap.setAttribute('data', currentMapUrl);
};

stateMap.onload = function () {
  const svgDocument = stateMap.contentDocument;
  if (svgDocument) {
    statesSVG = svgDocument.querySelectorAll('.sm_state');
    currentMapId = svgDocument.firstElementChild.id;
    TRIES_STORAGE_currentMap = `${TRIES_STORAGE}_${currentMapId}`;

    country.states = [];

    statesSVG.forEach((stateHTML) => {
      state = new State(stateHTML);

      console.log(state); //---------------------------------------------------

      //CREATING LIST OF ALL STATES
      country.addState(state);

      //SETUP EACH STATE
      let triesForCurrentState = JSON.parse(sessionStorage.getItem(TRIES_STORAGE_currentMap) ?? '{}')[state.id] ?? [0];

      let averageTries = triesForCurrentState.reduce((a, b) => a + b) / triesForCurrentState.length;

      let appliedStateColor;
      if (averageTries < 1) appliedStateColor = stateColor;
      else if (averageTries == 1) appliedStateColor = stateColor_t1;
      else if (averageTries <= 2) appliedStateColor = stateColor_t2;
      else if (averageTries <= 3) appliedStateColor = stateColor_t3;
      else if (averageTries > 3) appliedStateColor = stateColor_t4;

      stateHTML.setAttribute('fill', appliedStateColor);

      // stateHTML.addEventListener("mouseover", function () {
      //   this.setAttribute("fill", stateColor_selected);
      //   stateNameWhileHovering.innerText = this.attributes.name.value;
      //   stateNameWhileHovering.style.display = "block";
      // });

      // stateHTML.addEventListener("mouseleave", function () {
      //   this.setAttribute("fill", stateColor);
      //   stateNameWhileHovering.style.display = "none";
      // });

      stateHTML.addEventListener('click', function () {
        tryCounter++;

        if (this.id == promptState.id) {
          foundCorrectState(this, promptState);
        }
      });
    });

    country.states.forEach((state) => {
      state.populateNeighbors(country);
    });
  } else {
    console.log('no svgDocument'); //---------------------------------------------------
  }

  possibleStartStates = [...country.states];
  possibleGoalStates = [...country.states];
  setNewPromptState();
};

//FUNCTIONS
function addTryCounterToStorage(promptState, tryCounter) {
  console.log('storing tries');

  if (sessionStorage.getItem(TRIES_STORAGE_currentMap) == null) {
    sessionStorage.setItem(TRIES_STORAGE_currentMap, '{}');
  }

  let tries = JSON.parse(sessionStorage.getItem(TRIES_STORAGE_currentMap));

  let lastTenTries = tries[promptState.id] ?? [];

  lastTenTries.push(tryCounter);
  if (lastTenTries.length > 5) {
    lastTenTries.shift();
  }
  tries[promptState.id] = lastTenTries;

  sessionStorage.setItem(TRIES_STORAGE_currentMap, JSON.stringify(tries));
}

function foundCorrectState(stateHTML, state) {
  addTryCounterToStorage(state, tryCounter);

  stateHTML.setAttribute('fill', stateColod_found);

  removeValue(state, possibleStartStates);

  if (possibleStartStates.length > 0) {
    setNewPromptState();
  } else {
    allStatesFound();
  }
}

function allStatesFound() {
  stateNamePrompt.innerText = 'all states found';
  window.location.reload();
}

function setNewPromptState() {
  promptState = getRandomStateFrom(possibleStartStates);
  stateNamePrompt.innerText = promptState.name;

  tryCounter = 0;
}
function getRandomStateFrom(states) {
  return states[rng(states.length)];
}

function resetScore() {
  sessionStorage.clear();
  window.location.reload();
}

function selectMap(kind) {
  currentMapUrl = `../res/${kind}.svg`;
  stateMap.setAttribute('data', currentMapUrl);
  sessionStorage.setItem('currentMapUrl', currentMapUrl);
}
