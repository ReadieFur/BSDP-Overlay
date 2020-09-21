//Get all elements to change
var times;
var scores;
var accuracies;
var combos;

var preBSRs;
var beatmapImages;
var BSRs;
var mappers;
var artists;
var songNames;

var ModifiersShort = [];
var healthBars;

window.addEventListener("load", () =>
{
    times = document.querySelectorAll(".time");
    scores = document.querySelectorAll(".score");
    accuracies = document.querySelectorAll(".accuracy");
    combos = document.querySelectorAll(".combo");

    preBSRs = document.querySelectorAll(".preBSR");
    beatmapImages = document.querySelectorAll(".beatmapImage");
    BSRs = document.querySelectorAll(".bsr");
    mappers = document.querySelectorAll(".mapper");
    artists = document.querySelectorAll(".artist");
    songNames = document.querySelectorAll(".song");
    
    ModifiersShort["instaFail"] = document.querySelectorAll(".IF");
    ModifiersShort["batteryEnergy"] = document.querySelectorAll(".BE");
    ModifiersShort["disappearingArrows"] = document.querySelectorAll(".DA");
    ModifiersShort["ghostNotes"] = document.querySelectorAll(".GN");
    ModifiersShort["fasterSong"] = document.querySelectorAll(".FS");
    ModifiersShort["noFail"] = document.querySelectorAll(".NF");
    ModifiersShort["noObstacles"] = document.querySelectorAll(".NO");
    ModifiersShort["noBombs"] = document.querySelectorAll(".NB");
    ModifiersShort["slowerSong"] = document.querySelectorAll(".SS");
    ModifiersShort["noArrows"] = document.querySelectorAll(".NA");
    
    healthBars = document.querySelectorAll(".health");
})