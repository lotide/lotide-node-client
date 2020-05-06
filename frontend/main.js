const url = 'ws://localhost:8080';
const connection = new WebSocket(url);
let jsonStr;
var stateObj;
var currentLength = 0;

connection.onopen = () => {
  // connection.send('{ "started" : 0}') ;
};

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
};

connection.onmessage = (e) => {
  stateObj = JSON.parse(e.data);
  console.log(stateObj.song);
  currentLength = stateObj.song.current_length;
  console.log("update0" + currentLength);
  // updateElements(currentLength);
};

if (jsonStr != undefined) {

}

const playButton = document.getElementById("play-button");
const stopButton = document.getElementById("stop-button");
const closeButton = document.getElementById("close-button");


const increaseMeasureButton = document.getElementById("increase-measure-button");

const updateButton = document.getElementById("update-button");

const groupButton = document.getElementById("group-button");
const setGroupButton = document.getElementById("set-group-button");
const phraseButton = document.getElementById("phrase-button");
const synthButton = document.getElementById("synth-button");
const songButton = document.getElementById("song-button");

playButton.onclick = function() {
  connection.send(JSON.stringify({ command: "play", parameters: [""] }));
};
stopButton.onclick = function() {
  connection.send(JSON.stringify({ command: "stop", parameters: [""] }));
};
closeButton.onclick = function() {
  connection.send(JSON.stringify({ command: "close", parameters: [""] }));
};

increaseMeasureButton.onclick = function() {
  currentLength += 8;
  connection.send(JSON.stringify({ command: "setLength", parameters: [currentLength.toString()] }));
};

updateButton.onclick = function() {
  connection.send(JSON.stringify({ command: "playNote", parameters: ["60", "100"] }));
  console.log("update" + currentLength);
  if (currentLength != 0)
	updateElements(currentLength);
};


songButton.onclick = function() {
  connection.send(JSON.stringify({ command: "addSong", parameters: ["Song1"] }));
};

phraseButton.onclick = function() {
  connection.send(JSON.stringify({ command: "addPhrase", parameters: ["Phrase1"] }));
};

groupButton.onclick = function() {
  connection.send(JSON.stringify({ command: "addGroup", parameters: ["normal"] }));
};

setGroupButton.onclick = function() {
  connection.send(JSON.stringify({ command: "setActiveGroup", parameters: ["normal"] }));
};

synthButton.onclick = function() {
  connection.send(JSON.stringify({ command: "addSynth", parameters: [""] }));
};

var notes = { A0: 21,
			  As0: 22,
			  B0: 23,
			  C1: 24,
			  Cs1: 25,
			  D1: 26,
			  Ds1: 27,
			  E1: 28,
			  F1: 29,
			  Fs1: 30,
			  G1: 31,
			  Gs1: 32,
			  A1: 33,
			  As1: 34,
			  B1: 35,
			  C2: 36,
			  Cs2: 37,
			  D2: 38,
			  Ds2: 39,
			  E2: 40,
			  F2: 41,
			  Fs2: 42,
			  G2: 43,
			  Gs2: 44,
			  A2: 45,
			  As2: 46,
			  B2: 47,
			  C3: 48,
			  Cs3: 49,
			  D3: 50,
			  Ds3: 51,
			  E3: 52,
			  F3: 53,
			  Fs3: 54,
			  G3: 55,
			  Gs3: 56,
			  A3: 57,
			  As3: 58,
			  B3: 59,
			  C4: 60,
			  Cs4: 61,
			  D4: 62,
			  Ds4: 63,
			  E4: 64,
			  F4: 65,
			  Fs4: 66,
			  G4: 67,
			  Gs4: 68,
			  A4: 69,
			  As4: 70,
			  B4: 71,
			  C5: 72,
			  Cs5: 73,
			  D5: 74,
			  Ds5: 75,
			  E5: 76,
			  F5: 77,
			  Fs5: 78,
			  G5: 79,
			  Gs5: 80,
			  A5: 81,
			  As5: 82,
			  B5: 83,
			  C6: 84,
			  Cs6: 85,
			  D6: 86,
			  Ds6: 87,
			  E6: 88,
			  F6: 89,
			  Fs6: 90,
			  G6: 91,
			  Gs6: 92,
			  A6: 93,
			  As6: 94,
			  B6: 95,
			  C7: 96,
			  Cs7: 97,
			  D7: 98,
			  Ds7: 99,
			  E7: 100,
			  F7: 101,
			  Fs7: 102,
			  G7: 103,
			  Gs7: 104,
			  A7: 105,
			  As7: 106,
			  B7: 107,
			  C8: 108 };

function updateElements(measure) {
  let myNotes = document.getElementById("my-notes");
  myNotes.style.position = "absolute";
  myNotes.style.marginTop = "100px";

  for (let i in notes) {
	let noteRow = document.createElement("div");
	noteRow.style.border = "0";
	noteRow.style.display = "flex";
	noteRow.style.flexDirection = "row";
	noteRow.className = i;
	myNotes.append(noteRow);
	let noteRowNote = document.createElement("div");
	noteRowNote.innerHTML = i;
	noteRowNote.style.margin = 0;
	noteRowNote.style.border = "0px";
	noteRowNote.style.width = "30px";
	noteRowNote.style.height = "20px";
	noteRowNote.style.padding = "0px";
	noteRowNote.style.margin = "0px";
	noteRowNote.style.border = "thin solid #000";
	noteRow.append(noteRowNote);
	let singleNote = 0;
	for (let j = 0; j < measure; ++j) {
	  console.log("measure" + measure);
	  let noteSections = document.createElement("div");
	  noteSections.style.width = "50px";
	  noteSections.style.height = "20px";
	  if ((j + 1) % 8 == 0) {
		noteSections.style.border = "thin solid #000";
		noteSections.style.borderRight = "thick solid #000";
	  } else {
		noteSections.style.border = "thin solid #000";
	  }
	  noteSections.style.backgroundColor = "#292D3F";
	  noteSections.className = i + "-" + singleNote;
	  singleNote += 8;

	  noteRow.append(noteSections);

	  noteSections.addEventListener('click', function(evt) {
		if (noteSections.style.backgroundColor == "rgb(66, 72, 98)") {
		  noteSections.style.backgroundColor = "#292D3F";
		  connection.send(JSON.stringify({ command: "removeNote", parameters: [notes[i].toString(), j * 8 + ""] }));
		  console.log(measure * 8);
		} else {
		  noteSections.style.backgroundColor = "#424862";
		  console.log(noteSections.style.backgroundColor);
		  console.log(singleNote);
		  connection.send(JSON.stringify({ command: "addNote", parameters: [notes[i].toString(), "100", j * 8 + "", 8 + ""] }));
		}
		connection.send(JSON.stringify({ command: "playNote", parameters: [notes[i].toString(), "100"] }));
	  });
	}
  }
}
