//REFERENCES
const stateMap = document.getElementById("state-map");
const stateNameWhileHovering = document.getElementById("state-name-while-hovering");

//COLORS
const startStateColor = "#126207";
const goalStateColor = "#A3260B";
const stateColor = "#88a4bc";
// const goalStateColor_selected = ;
// const startStateColor_selected = ;
const stateColor_selected = "#3b729f";

//VARIABLES
let country = new Country();
let state;

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
      stateHTML.addEventListener("mouseover", function () {
        this.setAttribute("fill", stateColor_selected);
        stateNameWhileHovering.innerText = this.attributes.name.value;
        stateNameWhileHovering.style.display = "block";
      });

      stateHTML.addEventListener("mouseleave", function () {
        this.setAttribute("fill", stateColor);
        stateNameWhileHovering.style.display = "none";
      });
    });

    country.states.forEach((state) => {
      state.populateNeighbors(country);
    });
  } else {
    console.log("no svgDocument"); //---------------------------------------------------
  }
};
