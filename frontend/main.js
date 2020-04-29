const url = 'ws://localhost:8080';
const connection = new WebSocket(url);

connection.onopen = () => {
  connection.send('{ "started" : 0}') ;
};

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
};

connection.onmessage = (e) => {
  console.log(JSON.parse(e.data));
};

const playButton = document.getElementById("play-button");
const stopButton = document.getElementById("stop-button");
const closeButton = document.getElementById("close-button");

playButton.onclick = function() {
  connection.send(JSON.stringify({ command: "play", parameters: "" }));
};

stopButton.onclick = function() {
  connection.send(JSON.stringify({ command: "stop", parameters: "" }));
};

closeButton.onclick = function() {
  connection.send(JSON.stringify({ command: "close", parameters: "" }));
};
