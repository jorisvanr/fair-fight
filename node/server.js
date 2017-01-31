var io = require('socket.io'),
    connect = require('connect');

var app = connect().use(connect.static('public')).listen(3000);
var fightIO = io.listen(app, { log: false });

var servers = [];
var clients = [];
var server_id_playID = [];

/**
 * Creates a random string used for a QR/Session code
 *
 * @return {string}
 */
function makeServerID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 25; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Main socket function used when a new socket connects
 *
 * @param socket
 */
fightIO.sockets.on('connection', function (socket) {
    /**
     * Functions for client/server disconnects
     */
    socket.on('disconnect', function  () {
        //Check if a client disconnects
        if(typeof clients[socket.id] !== "undefined"){
            console.log("Client disconnect!!!!!!");
            var currentServer = servers[clients[socket.id]];
            currentServer.clients--;
            currentServer.blue == socket.id ? currentServer.blue = "" : currentServer.red = "";

            fightIO.sockets.emit('client_update', {id: clients[socket.id], type: "disconnect"});

            delete clients[socket.id];

            console.log(servers);
            console.log(clients);
            console.log(server_id_playID);
        }

        //Check if a server disconnects
        if(typeof server_id_playID[socket.id] !== "undefined"){
            console.log("Server disconnect!!!!!!");
            var currentPlayID = server_id_playID[socket.id];
            var serverBluePlayer = servers[currentPlayID].blue;
            var serverRedPlayer = servers[currentPlayID].red;

            fightIO.sockets.emit('server_update', {id: currentPlayID, type: "disconnect"});

            delete clients[serverBluePlayer];
            delete clients[serverRedPlayer];

            delete servers[currentPlayID];

            delete server_id_playID[socket.id];

            console.log(servers);
            console.log(clients);
            console.log(server_id_playID);
        }

        fightIO.sockets.emit('exit', {message: '[SYSTEM] A user has disconnected.'});
        console.log("\x1b[31m"+"[SYSTEM] Client: "+socket.id+" has disconnected."+"\x1b[0m");
    });

    /**
     * Functions for the mobile/controller page
     */
    socket.on('check_session', function  (data) {
        if(typeof servers[data.id] !== "undefined") {
            if(servers[data.id].clients < 2) {
                if(servers[data.id].blue == ""){
                    socket.emit('check_session', {session: true, id: data.id, color: "blue"});
                    fightIO.sockets.emit('client_update', {id: data.id, type: "connect", color: "blue"});

                    servers[data.id].blue = socket.id;
                    clients[socket.id] = data.id;
                }else{
                    socket.emit('check_session', {session: true, id: data.id, color: "red"});
                    fightIO.sockets.emit('client_update', {id: data.id, type: "connect", color: "red"});

                    servers[data.id].red = socket.id;
                    clients[socket.id] = data.id;
                }

                servers[data.id].clients++;

                console.log(servers);
                console.log(server_id_playID);
            }else{
                socket.emit('check_session', {session: false, reason: "full_session"});
            }
        }else{
            socket.emit('check_session', {session: false, reason: "no_session"});
        }
        console.log("\x1b[31m"+"[SYSTEM] Client: "+socket.id+" asked for a session check!"+"\x1b[0m");
    });

    socket.on('client_movement', function  (data) {
        fightIO.sockets.emit('client_movement', {id: data.id, color: data.color});
        console.log("\x1b[31m"+"[SYSTEM] Client: "+socket.id+" send a player movement!"+"\x1b[0m");
    });

    /**
     * Functions for the server/desktop page
     */
    socket.on('qr', function  () {
        var id = makeServerID();

        servers[id] = {};
        servers[id].realID = socket.id;
        servers[id].clients = 0;
        servers[id].blue = "";
        servers[id].red = "";

        server_id_playID[socket.id] = id;

        console.log(servers);

        socket.emit('qr', {id: id});
        console.log("\x1b[31m"+"[SYSTEM] Client: "+socket.id+" asked a new QR code!"+"\x1b[0m");
    });

    console.log("\x1b[32m"+"[SYSTEM] A new user is connected with id: " + socket.id +"\x1b[0m");
    socket.emit('entrance', {message: '[SYSTEM] Welcome to the fightIO socket server!'});
});

console.log("\x1b[32m"+"[SYSTEM] SocketIO started successfully !!"+"\x1b[0m");
