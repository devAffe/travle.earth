//REFERENCES
const body = document.getElementById('body');
const stateMap = document.getElementById('state-map');
const stateNameWhileHovering = document.getElementById('state-name-while-hovering');
const stateNamePrompt = document.getElementById('state-name-prompt');
const guessInput = document.getElementById('guess-input-field');
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
const GameMode = Object.freeze({
  FIND_THE_STATE: 'findTheState',
  FROM_A_TO_B: 'fromAToB',
});

//SESSION STORAGE
let TRIES_STORAGE_currentMap;
let currentMapUrl = sessionStorage.getItem('currentMapUrl') ?? '../res/germany.svg';
let currentGameMode = sessionStorage.getItem('currentGameMode') ?? GameMode.FIND_THE_STATE;

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
  currentGameMode = sessionStorage.getItem('currentGameMode');
  console.log(currentGameMode);

  switch (currentGameMode) {
    case GameMode.FIND_THE_STATE:
      //find the state
      console.log('switch find the');
      break;
    case GameMode.FROM_A_TO_B:
      //from a to b
      console.log('switch a to b');
      console.log(guessInput);
      guessInput.style.display = 'block';

      break;
  }
};

stateMap.onload = function () {
  const svgDocument = stateMap.contentDocument;
  if (svgDocument) {
    statesSVG = svgDocument.querySelectorAll('.sm_state');
    currentMapId = svgDocument.firstElementChild.id;
    TRIES_STORAGE_currentMap = `${TRIES_STORAGE}_${currentMapId}`; //findthestate

    country.states = [];

    statesSVG.forEach((stateHTML) => {
      state = new State(stateHTML);

      console.log(state); //---------------------------------------------------

      //CREATING LIST OF ALL STATES
      country.addState(state);

      //SETUP EACH STATE
      let triesForCurrentState;
      // console.log('1', triesForCurrentState);
      switch (currentGameMode) {
        case GameMode.FIND_THE_STATE:
          console.log('gm find the');
          // console.log('2', triesForCurrentState);
          triesForCurrentState = JSON.parse(sessionStorage.getItem(TRIES_STORAGE_currentMap) ?? '{}')[state.id] ?? [0]; //findthestate
          // console.log('3', triesForCurrentState);

          // console.log('4  ', triesForCurrentState);
          let averageTries = triesForCurrentState.reduce((a, b) => a + b) / triesForCurrentState.length; //findthestate

          let appliedStateColor; //findthestate
          if (averageTries < 1) appliedStateColor = stateColor; //findthestate
          else if (averageTries == 1) appliedStateColor = stateColor_t1; //findthestate
          else if (averageTries <= 2) appliedStateColor = stateColor_t2; //findthestate
          else if (averageTries <= 3) appliedStateColor = stateColor_t3; //findthestate
          if (averageTries > 3) appliedStateColor = stateColor_t4; //findthestate

          stateHTML.setAttribute('fill', appliedStateColor); //findthestate

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

          break;
        case GameMode.FROM_A_TO_B:
          console.log('gm a to b');
          // for now do nothing
          break;
      }
    }); //findthestate

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
  reloadPage();
}

function reloadPage() {
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

function loadGameMode(kind) {
  // currentGameMode = kind;
  console.log(kind);
  sessionStorage.setItem('currentGameMode', kind);
  reloadPage();
}
