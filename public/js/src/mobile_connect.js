var socket, serverId, color, canClickTimeout, canClick = true;

function mobileInit() {
    /**
     * Initialize the socket connection to the server
     * @type {io.Socket}
     */
    socket = io.connect('http://'+settings.url+':'+settings.port+'/');

    /**
     * Event for a socket error/malfunction
     */
    socket.on('error', function  () {
        console.error("Connection error!");

        TweenMax.to(document.querySelector("#error"), 1, {
            opacity: 1,
            display: 'block'
        });
    });

    /**
     * Event when another socket connects to the server
     */
    socket.on('entrance', function  (data) {
        console.log(data.message);
    });

    /**
     * Event when another socket disconnects from the server
     */
    socket.on('exit', function  (data) {
        console.log(data.message);
    });

    /**
     * Event when the server closes the connection
     */
    socket.on('server_update', function  (data) {
        console.log(data);

        if(data.id == serverId){
            if(data.type == "disconnect"){
                serverId = "";
                color = "";

                document.querySelector("#mobile_connect h3").innerText = "The server closed the connection!";

                TweenMax.to(document.querySelector("#trigger_remote_click"), 0.5, {
                    opacity: 0,
                    display: 'none'
                });
            }
        }
    });

    /**
     * Event triggered when the server has verified the playID returns: OK, no_session, full_session
     */
    socket.on('check_session', function (data) {
        console.log(data);

        if(data.session) {
            color = data.color;

            document.querySelector("#trigger_remote_click").dataset.id = data.id;
            document.querySelector("#trigger_remote_click").dataset.color = data.color;
            document.querySelector("#trigger_remote_click").classList.add(data.color);

            TweenMax.to(document.querySelector("#mobile_connect"), 2, {
                opacity: 1,
                display: 'block'
            });

            TweenMax.to(document.querySelector("#trigger_remote_click"), 2, {
                opacity: 1,
                display: 'block'
            });
        }else{
            if(data.reason == "no_session") {
                serverId = "";
                color = "";

                document.querySelector("#mobile_connect h3").innerText = "Session not found!";
            }

            if(data.reason == "full_session") {
                serverId = "";
                color = "";

                document.querySelector("#mobile_connect h3").innerText = "This session is already full!";
            }

            TweenMax.to(document.querySelector("#mobile_connect"), 2, {
                opacity: 1,
                display: 'block'
            });
        }
    });

    serverId = getParameterByName("id");

    /**
     * Request a session check for the playID the user entered
     */
    socket.emit('check_session', {id: serverId});

    /**
     * Event listener when the user clicks the "HIT" button
     */
    document.querySelector("#trigger_remote_click").addEventListener("click", function () {
        if(canClick) {
            socket.emit('client_movement', {id: serverId, color: color});

            document.querySelector("#trigger_remote_click").classList.remove(color);
            document.querySelector("#trigger_remote_click").classList.add("grey");
            canClick = false;

            canClickTimeout = setTimeout(function () {
                document.querySelector("#trigger_remote_click").classList.remove("grey");
                document.querySelector("#trigger_remote_click").classList.add(color);
                canClick = true;
            }, 1000);
        }
    });
}
