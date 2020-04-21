const net = require('net');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

function socketAdd(myStr) {
  const client = net.createConnection({ port: 8198 }, () => {
	console.log('connected to server!');
	client.write(myStr);
  });

  client.on('data', (data) => {
	console.log(data.toString());
	client.end();
  });

  client.on('end', () => {
	console.log("Disconnected from Socket.");
  });
}

wss.on('connection', ws => {
  ws.on('message', message => {
	if (message == "play") {
	  socketAdd("play");
	} else if (message == "stop") {
	  socketAdd("stop");
	} else if (message == "close") {
	  wss.close();
	} else {
	  console.log(message);
	}
  });

  // TODO Should send state structure
  ws.send('Worked!');
});

wss.on('close', function() {
  console.log("Websocket Closed");
  socketAdd("close");
});
