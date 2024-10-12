function gm_findTheState() {
  stateMap.onload = function () {
    const svgDocument = stateMap.contentDocument;
    if (svgDocument) {
      statesSVG = svgDocument.querySelectorAll('.sm_state');
      currentMapId = svgDocument.firstElementChild.id;
      TRIES_STORAGE_currentMap = `${TRIES_STORAGE}_${currentMapId}`;

      country.states = [];

      statesSVG.forEach((stateHTML) => {
        state = new State(stateHTML);

        //CREATING LIST OF ALL STATES
        country.addState(state);

        //SETUP EACH STATE
        let triesForCurrentState;

        switch (currentGameMode) {
          case GameMode.FIND_THE_STATE:
            console.log('gm find the state');
            triesForCurrentState = JSON.parse(sessionStorage.getItem(TRIES_STORAGE_currentMap) ?? '{}')[state.id] ?? [0];

            let averageTries = triesForCurrentState.reduce((a, b) => a + b) / triesForCurrentState.length;

            let appliedStateColor;
            if (averageTries < 1) appliedStateColor = stateColor;
            else if (averageTries == 1) appliedStateColor = stateColor_t1;
            else if (averageTries <= 2) appliedStateColor = stateColor_t2;
            else if (averageTries <= 3) appliedStateColor = stateColor_t3;
            if (averageTries > 3) appliedStateColor = stateColor_t4;

            stateHTML.setAttribute('fill', appliedStateColor);

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
}

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

function setNewPromptState() {
  promptState = getRandomStateFrom(possibleStartStates);
  stateNamePrompt.innerText = promptState.name;

  tryCounter = 0;
}
function getRandomStateFrom(states) {
  return states[rng(states.length)];
}
