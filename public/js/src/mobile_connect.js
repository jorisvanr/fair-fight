var socket, serverId, color, canClickTimeout, canClick = true;

function mobileInit() {
    socket = io.connect('http://'+settings.url+':'+settings.port+'/');

    socket.on('error', function  () {
        console.error("Connection error!");

        TweenMax.to(document.querySelector("#error"), 1, {
            opacity: 1,
            display: 'block'
        });
    });

    socket.on('entrance', function  (data) {
        console.log(data.message);
    });

    socket.on('exit', function  (data) {
        console.log(data.message);
    });

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
    socket.emit('check_session', {id: serverId});

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
