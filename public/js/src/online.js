function onlineInit() {
    // Init global vars
    var anim, isHitting = true, socket, id, clients = 0, gameRunning = false;

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
     * Event when a client connects/disconnects from the server
     */
    socket.on('client_update', function  (data) {
        console.log(data);

        if (data.id == id && data.type == "connect") {
            clients++;
            document.querySelector("#clients").innerText = ""+clients;
        }

        if (data.id == id && data.type == "disconnect") {
            clients--;
            document.querySelector("#clients").innerText = ""+clients;
        }

        if (clients == 2) {
            gameRunning = true;

            TweenMax.to(document.querySelector("#bm_animation_online_menu"), 1, {
                opacity: 0,
                display: 'none'
            });

            TweenMax.to(document.querySelector("#bm_animation_online"), 1, {
                opacity: 1,
                display: 'block',
                onComplete: function () {
                    initBodymovin();
                }
            });
        }else{
            if(!gameRunning){
                return;
            }

            gameRunning = false;

            TweenMax.to(document.querySelector("#bm_animation_online"), 1, {
                opacity: 0,
                display: 'none',
                onComplete: function () {
                    killBodymovin();
                    TweenMax.to(document.querySelector("#bm_animation_online_menu"), 1, {
                        opacity: 1,
                        display: 'block'
                    });
                }
            });
        }
    });

    /**
     * Event when a client hits the "HIT" button
     */
    socket.on('client_movement', function (data) {
        if(data.id == id){
            if(data.color == "red"){
                hitRight();
            }

            if(data.color == "blue"){
                hitLeft();
            }

            console.log(data);
        }
    });

    /**
     * Function triggered when the server returns a new QR/Session code
     */
    socket.on('qr', function  (data) {
        console.log(data);
        id = data.id;

        var port = settings.httpPort == "" ? "" : ":"+settings.httpPort;

        new QRCode(
            document.querySelector("#qr_code"), {
                text: 'http://'+settings.url+port+'/?id='+id,
                colorLight : "#000000",
                colorDark : "#ffffff"
            }
        );

        TweenMax.to(document.querySelector("#bm_animation_online_menu"), 1, {
            opacity: 1,
            display: 'block'
        });
    });

    /**
     * Asks the server for a QR/Session code
     */
    socket.emit('qr');

    /**
     * Creates the bodymovin animation and triggers the intro function
     */
    function initBodymovin() {
        var container = document.getElementById('bm_animation_online');
        var animData = {
            container: container,
            renderer: 'svg',
            loop: true,
            prerender: false,
            autoplay: true,
            autoloadSegments: false,
            path: 'data/fight.json'
        };

        anim = bodymovin.loadAnimation(animData);
        startAnimation();
    }

    /**
     * Function used to destroy the animation when a client disconnects
     */
    function killBodymovin() {
        anim.destroy();
    }

    /**
     * Function triggered when the hit animation is done
     */
    function hitComplete() {
        isHitting = false;
        anim.removeEventListener('loopComplete', hitComplete);
    }

    /**
     * Function triggered when someone hits the left player
     */
    function hitRight() {
        if (isHitting) {
            return;
        }

        isHitting = true;
        anim.playSegments([[75, 95], [65, 75]], true);
        anim.addEventListener('loopComplete', hitComplete);
    }

    /**
     * Function triggered when someone hits the right player
     */
    function hitLeft() {
        if (isHitting) {
            return;
        }

        isHitting = true;
        anim.playSegments([[95, 115], [65, 75]], true);
        anim.addEventListener('loopComplete', hitComplete);
    }

    /**
     * Function used to play the intro animation
     */
    function startAnimation() {
        anim.playSegments([[0, 65], [65, 75]], true);
        anim.addEventListener('loopComplete', introComplete);
    }

    /**
     * Function used to release the isHitting so players can start using the game
     */
    function introComplete() {
        isHitting = false;
        anim.removeEventListener('loopComplete', introComplete);
    }
}
