const net = require('net');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

function socketAdd(myStr, ws) {
  const client = net.createConnection({ port: 8198 }, () => {
	console.log('connected to server!');
	client.write(myStr);
  });

  client.on('data', (data) => {
	console.log("From Server");
	console.log(data.toString());
	ws.send(data.toString());
	// client.end();
  });

  client.on('end', () => {
	console.log("Disconnected from Socket.");
  });
}

wss.on('connection', ws => {
  ws.on('message', message => {
	let jsonMessage = JSON.parse(message);
	// if (jsonMessage.command == "play") {
	//   socketAdd(message, ws);
	// } else if (jsonMessage.command == "stop") {
	//   socketAdd(message, ws);
	// }
	if (jsonMessage.command == "close") {
	  socketAdd(message, ws);
	  wss.close();
	} else {
	  console.log(message);
	  socketAdd(message, ws);
	}
  });
});

wss.on('close', function() {
  console.log("Websocket Closed");
});
