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
  console.log('cgm', currentGameMode);

  switch (currentGameMode) {
    case GameMode.FIND_THE_STATE:
      //find the state
      console.log('switch find the state');
      gm_findTheState();
      break;
    case GameMode.FROM_A_TO_B:
      //from a to b
      console.log('switch a to b');
      console.log(guessInput);
      guessInput.style.display = 'block';

      break;
  }
};

//FUNCTIONS
function reloadPage() {
  window.location.reload();
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
