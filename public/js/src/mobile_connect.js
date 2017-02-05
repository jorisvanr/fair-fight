function mobileInit() {
    // Init global vars
    var socket, anim, serverId, color, canClickTimeout, canClick = true;

    /**
     * Initialize the socket connection to the server
     * @type {io.Socket}
     */
    socket = io.connect('http://'+settings.url+':'+settings.socketPort+'/');

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

                TweenMax.to(document.querySelector("#mobile_connect svg"), 0.5, {
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

            document.querySelector("#mobile_connect").dataset.id = data.id;
            document.querySelector("#mobile_connect").dataset.color = data.color;
            document.querySelector("#button").classList.add(data.color);

            document.querySelector("#mobile_connect h3").innerText = "";

            TweenMax.to(document.querySelector("#mobile_connect"), 2, {
                opacity: 1,
                display: 'block'
            });

            startAnimation();

            TweenMax.to(document.querySelector("#mobile_connect svg"), 2, {
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
     * Init bodymovin
     * @type {Element}
     */
    var container = document.getElementById('mobile_connect');
    var animData = {
        container: container,
        renderer: 'svg',
        loop: true,
        prerender: false,
        autoplay: false,
        autoloadSegments: false,
        path: 'data/mobile_button.json'
    };
    anim = bodymovin.loadAnimation(animData);

    /**
     * Bodymovin button stuff
     */
    function startAnimation(){
        anim.playSegments([[0,25],[25,250]],true);

        /**
         * Event listener when the user clicks the "HIT" button
         */
        document.querySelector("#button").addEventListener("click", function () {
            if(canClick) {
                container.classList.add("flash");

                socket.emit('client_movement', {id: serverId, color: color});

                canClick = false;

                canClickTimeout = setTimeout(function () {
                    container.classList.remove("flash");
                    canClick = true;
                }, 1000);
            }
        });
    }

    /**
     * Function used to destroy the animation when a client disconnects
     */
    function killBodymovin() {
        anim.destroy();
    }
}
