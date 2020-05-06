const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('lotide> ');

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
	rl.prompt();
  });
}

function reversed(r){
  function rev(r, acc){
	if(r=="")
	  return acc;
	else
	  return rev(r.substr(1), r[0]+acc);
  }
  return rev(r, "");
}

function removeCommand(str){
  function rc(str, cmd){
	if(str == "" || str.substr(0,1) == " ")
	  return cmd;
	else
	  return rc(str.substr(1), str.substr(0,1)+cmd);
  }
  return reversed(rc(str, ""));
}

rl.on('line', function(line) {
  var cmd = removeCommand(line);
  switch(cmd) {
  case "play":
		socketAdd(JSON.stringify({ command: "play", parameters [""] }));
	done();
	break;
  case "stop":
		socketAdd(JSON.stringify({ command: "stop", parameters [""] }));
	done();
	break;
  case "close":
		socketAdd(JSON.stringify({ command: "close", parameters [""] }));

	done();
	break;
  default:
	done();
	break;
  }
});

function done() {
  rl.prompt();
}

console.log("Started LoTide CLI.\nEnter LoTide Commands.\nType \"help\" for a list of commands.\n");

done();
