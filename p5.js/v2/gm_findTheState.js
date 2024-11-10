function gm_findTheState() {
  stateMap.onload = function () {
    const svgDocument = stateMap.contentDocument;
    if (svgDocument) {
      statesSVG = svgDocument.querySelectorAll('.sm_state');
      currentMapId = svgDocument.firstElementChild.id;
      TRIES_STORAGE_currentMap = `${TRIES_STORAGE}_${currentMapId}`; //findthestate

      country.states = [];

      statesSVG.forEach((stateHTML) => {
        state = new State(stateHTML);

        // console.log(state); //---------------------------------------------------

        //CREATING LIST OF ALL STATES
        country.addState(state);

        //SETUP EACH STATE
        let triesForCurrentState;
        // console.log('1', triesForCurrentState);

        console.log('gm find the state');
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
