const url = 'ws://localhost:8080';
const connection = new WebSocket(url);
let jsonStr;
let stateObj;
let groupName;
let currentLength = 0;
let activeNotes = [];
let activateSel = 0;

connection.onopen = () => {
  // if (groups) {
  connection.send(JSON.stringify({ command: "addSong", parameters: ["default"] }));
  connection.send(JSON.stringify({ command: "addSynth", parameters: [""] }));
  connection.send(JSON.stringify({ command: "addGroup", parameters: ["normal"] }));
  connection.send(JSON.stringify({ command: "addPhrase", parameters: ["Phrase1"] }));
  connection.send(JSON.stringify({ command: "setLength", parameters: ["384"] }));
  connection.send(JSON.stringify({ command: "setActiveGroup", parameters: ["normal"] }));
  // }
};



connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
};

connection.onmessage = (e) => {
  stateObj = JSON.parse(e.data);
  console.log(stateObj);
  phrases = stateObj.song.phrases;
  groups = stateObj.song.groups;
  synths = stateObj.song.synths;
  if (activateSel == 0) {
	updateSelectors(phrases, groups, synths);
	activateSel++;
  }
};

if (jsonStr != undefined) {

}

const modulationSelector = document.getElementById("modulation-mode-selector");
const oscillator1Selector = document.getElementById("osc1-mode-selector");
const oscillator2Selector = document.getElementById("osc2-mode-selector");

const noteSizeSelector = document.getElementById("note-size-selector");
const timeSignatureSelector = document.getElementById("time-signature-selector");


const bpmSlider = document.getElementById("bpm-slider-range");
const attackSlider = document.getElementById("attack-slider-range");
const sustainSlider = document.getElementById("sustain-slider-range");
const decaySlider = document.getElementById("decay-slider-range");
const releaseSlider = document.getElementById("release-slider-range");
const offsetSlider = document.getElementById("offset-slider-range");

const playButton = document.getElementById("play-button");
const stopButton = document.getElementById("stop-button");
const closeButton = document.getElementById("close-button");

const increaseMeasureButton = document.getElementById("increase-measure-button");

const updateButton = document.getElementById("update-button");

// const setGroupButton = document.getElementById("set-group-button");
const phraseButton = document.getElementById("phrase-button");
const synthButton = document.getElementById("synth-button");
const songButton = document.getElementById("song-button");

playButton.onclick = () => {
  connection.send(JSON.stringify({ command: "play", parameters: [""] }));
  // myMove();
};
stopButton.onclick = () => {
  connection.send(JSON.stringify({ command: "stop", parameters: [""] }));
};
closeButton.onclick = () => {
  connection.send(JSON.stringify({ command: "close", parameters: [""] }));
};

increaseMeasureButton.onclick = () => {
  // currentLength += 32;
  // connection.send(JSON.stringify({ command: "setActiveGroup", parameters: [groups[0].value0] }));
};

updateButton.onclick = () => {
  // currentLength = stateObj.song.current_length;
  connection.send(JSON.stringify({ command: "playNote", parameters: ["60", "100"] }));
  connection.send(JSON.stringify({ command: "setLength", parameters: ["384"] }));
  updateElements(192);
  // connection.send(JSON.stringify({ command: "setActiveSynth", parameters: [groupName] }));
  // connection.send(JSON.stringify({ command: "setActiveGroup", parameters: [groups[0].value0] }));
  // console.log("update" + currentLength);
  // if (currentLength != 0)
};


noteSizeSelector.addEventListener('change', (event) => {
  connection.send(JSON.stringify({ command: "setLength", parameters: ["384"] }));
  updateElements(192);
});

timeSignatureSelector.addEventListener('change', (event) => {
  connection.send(JSON.stringify({ command: "setLength", parameters: ["384"] }));
  updateElements(192);
});

modulationSelector.addEventListener('change', (event) => {
  connection.send(JSON.stringify({ command: "setModulationMode", parameters: [event.target.value.toString()] }));
});

oscillator1Selector.addEventListener('change', (event) => {
  connection.send(JSON.stringify({ command: "setOSC1Mode", parameters: [event.target.value.toString()] }));
});

oscillator2Selector.addEventListener('change', (event) => {
  connection.send(JSON.stringify({ command: "setOSC2Mode", parameters: [event.target.value.toString()] }));
});

modulationSelector.addEventListener('change', (event) => {
  connection.send(JSON.stringify({ command: "setModulationMode", parameters: [event.target.value.toString()] }));
});

bpmSlider.addEventListener('input', () => {
  connection.send(JSON.stringify({ command: "setLength", parameters: [bpmSlider.value.toString()]}));
}, false);

attackSlider.addEventListener('input', () => {
  connection.send(JSON.stringify({ command: "setAttack", parameters: [attackSlider.value.toString()]}));
}, false);

decaySlider.addEventListener('input', () => {
  connection.send(JSON.stringify({ command: "setDecay", parameters: [attackSlider.value.toString()]}));
}, false);

releaseSlider.addEventListener('input', () => {
  connection.send(JSON.stringify({ command: "setRelease", parameters: [attackSlider.value.toString()]}));
}, false);

sustainSlider.addEventListener('input', () => {
  connection.send(JSON.stringify({ command: "setSustain", parameters: [attackSlider.value.toString()]}));
}, false);

offsetSlider.addEventListener('input', () => {
  connection.send(JSON.stringify({ command: "setOSC2Offset", parameters: [attackSlider.value.toString()]}));
}, false);

synthButton.onclick = () => {
  connection.send(JSON.stringify({ command: "addSynth", parameters: [""] }));
};

const groupModal = document.getElementById("group-modal");
const groupButton = document.getElementById("group-button");
const span = document.getElementById("close0");
const groupForm = document.getElementById('group-form');

groupButton.onclick = () => {
  groupModal.style.display = "block";
};

span.onclick = () => {
  groupModal.style.display = "none";
};

window.onclick = (e) => {
  if (event.target == groupModal) {
	groupModal.style.display = "none";
  }
};

groupForm.addEventListener('submit', e => {

  const groupInput = document.getElementById("group-name");

  groupName = groupInput.value;
  connection.send(JSON.stringify({ command: "addGroup", parameters: [groupInput.value] }));
  connection.send(JSON.stringify({ command: "setActiveGroup", parameters: [groupInput.value] }));
  e.preventDefault();
  groupModal.style.display = "none";
});

const songModal = document.getElementById("song-modal");
const span1 = document.getElementById("close1");
const songForm = document.getElementById('song-form');

songButton.onclick = () => {
  songModal.style.display = "block";
};

span1.onclick = () => {
  songModal.style.display = "none";
};

window.onclick = (e) => {
  if (event.target == songModal) {
	songModal.style.display = "none";
  }
};

songForm.addEventListener('submit', e => {
  const songInput = document.getElementById('song-name');
  connection.send(JSON.stringify({ command: "addSong", parameters: [songInput.value] }));
  e.preventDefault();
  songModal.style.display = "none";
});

const phraseModal = document.getElementById("phrase-modal");
const span2 = document.getElementById("close2");
const phraseForm = document.getElementById('phrase-form');

phraseButton.onclick = () => {
  phraseModal.style.display = "block";
};

span2.onclick = () => {
  phraseModal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target == phraseModal) {
	phraseModal.style.display = "none";
  }
};

phraseForm.addEventListener('submit', e => {
  const phraseInput = document.getElementById('phrase-name');
  connection.send(JSON.stringify({ command: "addPhrase", parameters: [phraseInput.value] }));
  e.preventDefault();
  phraseModal.style.display = "none";
});

var notes = {C8: 108, B7: 107, As7: 106, A7: 105, Gs7: 104, G7: 103, Fs7: 102, F7: 101,
			 E7: 100, Ds7: 99, D7: 98, Cs7: 97, C7: 96, B6: 95, As6: 94, A6: 93, Gs6: 92,
			 G6: 91, Fs6: 90, F6: 89, E6: 88, Ds6: 87, D6: 86, Cs6: 85, C6: 84, B5: 83,
			 As5: 82, A5: 81, Gs5: 80, G5: 79, Fs5: 78, F5: 77, E5: 76, Ds5: 75, D5: 74,
			 Cs5: 73, C5: 72, B4: 71, As4: 70, A4: 69, Gs4: 68, G4: 67, Fs4: 66, F4: 65, E4: 64,
			 Ds4: 63, D4: 62, Cs4: 61, C4: 60, B3: 59, As3: 58, A3: 57, Gs3: 56, G3: 55, Fs3: 54,
			 F3: 53, E3: 52, Ds3: 51, D3: 50, Cs3: 49, C3: 48, B2: 47, As2: 46, A2: 45, Gs2: 44, G2: 43,
			 Fs2: 42, F2: 41, E2: 40, Ds2: 39, D2: 38, Cs2: 37, C2: 36, B1: 35, As1: 34, A1: 33,
			 Gs1: 32, G1: 31, Fs1: 30, F1: 29, E1: 28, Ds1: 27, D1: 26, Cs1: 25, C1: 24, B0: 23, As0: 22, A0: 21};

function updateElements(fullLength) {
  let myNotes = document.getElementById("my-notes");
  myNotes.innerHTML = '';
  let velocity = document.getElementById("velocity-slider-range").value;
  let noteSize = document.getElementById("note-size-selector-select").value;
  let timeSig = document.getElementById("time-signature-selector-select").value;

  if (myNotes.innerHTML == '') {
	for (let i in notes) {
	  let noteRow = document.createElement("div");
	  noteRow.style.border = "0";
	  noteRow.style.display = "flex";
	  noteRow.style.flexDirection = "row";

	  noteRow.style.color= "#fff";
	  noteRow.onmouseover = () => {
		noteRow.style.color= "#323652";
	  };

	  noteRow.onmouseleave = () => {
		  noteRow.style.color= "#e7e7e7";
	  };
	  myNotes.append(noteRow);
	  let noteRowNote = document.createElement("div");
	  noteRowNote.innerHTML = i;
	  noteRowNote.style.marginTop = "200px";
	  noteRowNote.style.border = "0px";
	  noteRowNote.style.width = "30px";
	  noteRowNote.style.height = "20px";
	  noteRowNote.style.padding = "0px";
	  noteRowNote.style.margin = "0px";


	  noteRowNote.style.backgroundColor = "#191B28";
	  // noteRowNote.style.border = "thin solid #6A6F8D";
	  noteRow.append(noteRowNote);
	  let singleNote = 0;
	  for (let j = 0; j < fullLength/8; ++j) {
		let noteSections = document.createElement("div");
		noteSections.style.width = "64px";
		noteSections.style.height = "20px";
		noteSections.id = i + "-" + j;

		noteSections.style.display = "flex";
		noteSections.style.flexDirection = "row";
		if ((j + 1) % timeSig == 0) {
		  // noteSections.style.border = "thin solid #6A6F8D";
		  noteSections.style.borderRight = "thick solid #6A6F8D";
		} else {
		  noteSections.style.borderRight = "thin solid #6A6F8D";
		}

		if (activeNotes.includes(i + "-" + j)) {
		  noteSections.style.background = "rgba(41, 45, 63, 1)";
		} else {
		  noteSections.style.background = "rgba(66, 72, 98, 0.9)";
		}
		singleNote += 8;

		noteRow.append(noteSections);

		if (noteSize == 16) {
		  noteSections.addEventListener('click', (evt) => {
			if (noteSections.style.backgroundColor != "rgba(66, 72, 98, 0.9)") {
			  noteSections.style.background = "rgba(66, 72, 98, 0.9)";
			  connection.send(JSON.stringify({ command: "removeNote", parameters: [notes[i].toString(), j * noteSize + ""] }));
			  activeNotes = activeNotes.filter(e => {
				return e != (i + "-" + j);
			  });
			} else {
			  noteSections.style.background = "rgba(41, 45, 63, 1)";
			  connection.send(JSON.stringify({ command: "addNote", parameters: [notes[i].toString(), velocity, j * 16 + "", noteSize] }));
			  connection.send(JSON.stringify({ command: "setActiveGroup", parameters: [groups[0].value0] }));
			  connection.send(JSON.stringify({ command: "setLength", parameters: ["384"] }));
			  activeNotes.push(i + "-" + j);
			}
			connection.send(JSON.stringify({ command: "playNote", parameters: [notes[i].toString(), velocity] }));
		  });
		}


		for (let k = 0; k < 2; ++k) {
		  let note8 = document.createElement("div");
		  note8.style.display = "flex";
		  note8.style.flexDirection = "row";
		  note8.style.width = "32px";
		  note8.style.height = "20px";
		  note8.id = i + "-" + j + "-" + k;
		  noteSections.append(note8);

		  if (activeNotes.includes(i + "-" + j + "-" + k)) {
			note8.style.background = "rgba(41, 45, 63, 1)";
		  } else {
			note8.style.background = "rgba(66, 72, 98, 0)";
		  }
		  if (noteSize == 8) {
			note8.addEventListener('click', (evt) => {
			  // if (note8.style.backgroundColor != "rgb(66, 72, 98)" && noteSections.style.backgroundColor != "rgb(66, 72, 98)") {
			  if (note8.style.backgroundColor != "rgba(66, 72, 98, 0)") {
				note8.style.background = "rgba(66, 72, 98, 0)";
				connection.send(JSON.stringify({ command: "removeNote", parameters: [notes[i].toString(), j *  16 + k * 8 + ""] }));
				activeNotes = activeNotes.filter(e => {
				  return e != (i + "-" + j + "-" + k);
				});
			  } else {
				// if (noteSections.style.backgroundColor == "rgb(66, 72, 98)") {
				//   noteSections.style.background = "#292D3F";
				//   connection.send(JSON.stringify({ command: "removeNote", parameters: [notes[i].toString(), j * noteSize + ""] }));
				// }

				note8.style.background = "rgba(41, 45, 63, 1)";
				connection.send(JSON.stringify({ command: "addNote", parameters: [notes[i].toString(), velocity, j * 16 + k * 8 + "", noteSize] }));
				connection.send(JSON.stringify({ command: "setActiveGroup", parameters: [groups[0].value0] }));
				connection.send(JSON.stringify({ command: "setLength", parameters: ["384"] }));
				activeNotes.push(i + "-" + j + "-" + k);
			  }
			  connection.send(JSON.stringify({ command: "playNote", parameters: [notes[i].toString(), velocity] }));
			});
		  }

		  for (let m = 0; m < 2; ++m) {
			let note16 = document.createElement("div");
			note16.style.display = "flex";
			note16.style.flexDirection = "row";
			note16.style.width = "16px";
			note16.style.height = "20px";
			note8.append(note16);
			note16.id = i + "-" + j + "-" + k + "-" + m;

			if (activeNotes.includes(i + "-" + j + "-" + k + "-" + m )) {
			  note16.style.background = "rgba(41, 45, 63, 1)";
			} else {
			  note16.style.background = "rgba(66, 72, 98, 0)";
			}

			if (noteSize == 4) {
			  note16.addEventListener('click', (evt) => {
				// if (note16.style.backgroundColor != "rgb(66, 72, 98)" && noteSections.style.backgroundColor != "rgb(66, 72, 98)" && note8.style.backgroundColor != "rgb(66, 72, 98)") {
				if (note16.style.backgroundColor != "rgba(66, 72, 98, 0)") {
				  note16.style.background = "rgba(66, 72, 98, 0)";
				  connection.send(JSON.stringify({ command: "removeNote", parameters: [notes[i].toString(), j * 16 + k * 8 + m * 4 + ""] }));
				  activeNotes = activeNotes.filter(e => {
					return e != (i + "-" + j + "-" + k + "-" + m);
				  });
				} else {
				  // if (noteSections.style.backgroundColor == "rgb(66, 72, 98)" || note8.style.backgroundColor == "rgb(66, 72, 98)") {
				  //	noteSections.style.background = "#292D3F";
				  //	note8.style.background = "#292D3F";
				  //	note8.style.opacity = "0";
				  //	connection.send(JSON.stringify({ command: "removeNote", parameters: [notes[i].toString(), j * noteSize + ""] }));
				  // }
				  note16.style.background = "rgba(41, 45, 63, 1)";
				  connection.send(JSON.stringify({ command: "addNote", parameters: [notes[i].toString(), velocity, j * 16 + k * 8 + m * 4 + "", noteSize] }));
				  connection.send(JSON.stringify({ command: "setActiveGroup", parameters: [groups[0].value0] }));
				  connection.send(JSON.stringify({ command: "setLength", parameters: ["384"] }));
				  activeNotes.push(i + "-" + j + "-" + k + "-" + m );
				  }
				connection.send(JSON.stringify({ command: "playNote", parameters: [notes[i].toString(), velocity] }));
			  });
			}

			for (let n = 0; n < 2; ++n) {
			  let note32 = document.createElement("div");
			  note32.style.display = "flex";
			  note32.style.flexDirection = "row";
			  note32.style.width = "8px";
			  note32.style.height = "20px";
			  note32.id = i + "-" + j + "-" + k + "-" + m + "-" + n;
			  note16.append(note32);

			  if (activeNotes.includes(i + "-" + j + "-" + k + "-" + m + "-" + n )) {
				note32.style.background = "rgba(41, 45, 63, 1)";
			  } else {
				note32.style.background = "rgba(66, 72, 98, 0)";
			  }

			  if (noteSize == 2) {
				note32.addEventListener('click', (evt) => {
				  if (note32.style.backgroundColor != "rgba(66, 72, 98, 0)") {
				  // if (note32.style.backgroundColor != "rgb(66, 72, 98)" && noteSections.style.backgroundColor != "rgb(66, 72, 98)" && note16.style.backgroundColor != "rgb(66, 72, 98)" && note8.style.backgroundColor != "rgb(66, 72, 98)") {
					note32.style.background = "rgba(66, 72, 98, 0)";
					connection.send(JSON.stringify({ command: "addNote", parameters: [notes[i].toString(), velocity, j * 16 + k * 8 + m * 4 + n * 2 + "", noteSize] }));
					connection.send(JSON.stringify({ command: "setActiveGroup", parameters: [groups[0].value0] }));
					connection.send(JSON.stringify({ command: "setLength", parameters: ["384"] }));
					activeNotes = activeNotes.filter(e => {
					  return e != (i + "-" + j + "-" + k + "-" + m + "-" + n);
					});
				  } else {
					// if (noteSections.style.backgroundColor == "rgb(66, 72, 98)" || note8.style.backgroundColor == "rgb(66, 72, 98)" || note16.style.backgroundColor == "rgb(66, 72, 98)") {
					//   noteSections.style.background = "#292D3F";
					//   note8.style.background = "#292D3F";
					//   note16.style.background = "#292D3F";
					//   connection.send(JSON.stringify({ command: "removeNote", parameters: [notes[i].toString(), j * noteSize + ""] }));
					// }
					note32.style.background = "rgba(41, 45, 63, 1)";
					connection.send(JSON.stringify({ command: "removeNote", parameters: [notes[i].toString(), j * 16 + k * 8 + m * 4 + n * 2 + ""] }));
					console.log(j * noteSize);
					console.log(activeNotes);
					activeNotes.includes(i + "-" + j + "-" + k + "-" + m + "-" + n );
				  }
				  connection.send(JSON.stringify({ command: "playNote", parameters: [notes[i].toString(), velocity] }));
				});
			  }
			}
		  }
		}
	  }
	}
  }
}

function updateSelectors(phrases, groups, synths) {
  let phraseSelector = document.getElementById("phrase-selector-select");
  let groupSelector = document.getElementById("group-selector-select");
  let synthSelector = document.getElementById("synth-selector-select");
  phraseSelector.innerHTML = "";
  groupSelector.innerHTML = "";
  synthSelector.innerHTML = "";

  if (phraseSelector.innerHTML == "") {
	for (phrase of phrases) {
	  let phraseOption = document.createElement("option");
	  phraseOption.innerHTML = phrase.name;
	  phraseOption.value = phrase.name;
	  phraseSelector.append(phraseOption);
	}
  }

  phraseSelector.addEventListener('change', (event) => {
	connection.send(JSON.stringify({ command: "setActivePhrase", parameters: [phrases.findIndex(e =>  e.name == event.target.value).toString()] }));
  });

  if (groupSelector.innerHTML == "") {
	for (group of groups) {
	  let groupOption = document.createElement("option");
	  groupOption.innerHTML = group.value0;
	  groupOption.value = group.value0;
	  groupSelector.append(groupOption);
	}
  }

  groupSelector.addEventListener('change', (event) => {
	connection.send(JSON.stringify({ command: "setActiveGroup", parameters: [event.target.value] }));
  });

  if (synthSelector.innerHTML == "") {
	for (let i = 0; i < synths.length; ++i) {
	  let synthOption = document.createElement("option");
	  synthOption.innerHTML = i;
	  synthOption.value = i;
	  synthSelector.append(synthOption);
	}
  }

  synthSelector.addEventListener('change', (event) => {
	connection.send(JSON.stringify({ command: "setActiveSynth", parameters: [event.target.value.toString()] }));
  });
}

// const playRow = document.getElementById("play-row");

// function playing () {
//   var counter = 0;
//   var i = setInterval(function(){
//	counter++;
//	if(counter === 10) {
//	  clearInterval(i);
//	}
//   }, 200);
// }
// let pos = 30;
// const elem = document.getElementById("animate");
// let id = setInterval(frame, 5);

// function myMove() {
//   function frame() {
//	if (currentLength) {
//	  if (pos == (8 * 64)) {
//		console.log(pos);
//		clearInterval(id);
//	  } else {
//		pos++;
//		console.log(pos);
//		elem.style.left = pos + 'px';
//	  }
//	}
//   }

// var elem = document.getElementById('animate');
// elem.onclick = toggleAnimation;
// elem.style.webkitAnimationPlayState = 'running';

// function toggleAnimation() {
//   var style;
//   style = elem.style;
//   if (style.webkitAnimationPlayState === 'running') {
//	style.webkitAnimationPlayState = 'paused';
//	document.body.className = 'paused';
//   } else {
//	style.webkitAnimationPlayState = 'running';
//	document.body.className = '';
//   }
// }
//   function myStop() {
//   }
// }
