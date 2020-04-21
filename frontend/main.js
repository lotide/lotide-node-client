const url = 'ws://localhost:8080';
const connection = new WebSocket(url);

connection.onopen = () => {
  connection.send('hey') ;
};

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
};

connection.onmessage = (e) => {
  console.log(e.data);
};

const playButton = document.getElementById("play-button");
const stopButton = document.getElementById("stop-button");
const closeButton = document.getElementById("close-button");

playButton.onclick = function() {
  connection.send("play");
};

stopButton.onclick = function() {
  connection.send("stop");
};

closeButton.onclick = function() {
  connection.send("close");
};
