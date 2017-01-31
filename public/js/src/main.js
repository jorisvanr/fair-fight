/**
 * Define settings for socket server
 * @type {{url: string, port: number}}
 */
var settings = {
    url: "prototype.dev",
    port: 3000
};

/**
 * After window load start the js
 */
window.onload = function () {
    console.log("App started!");

    var param = getParameterByName("id");

    // Check if the client comes from a QR code
    if(!param) {
        TweenMax.to(document.querySelector("#menu"), 2, {
            opacity: 1,
            display: 'block'
        });

        var menuItems = document.querySelectorAll("#menu span");

        menuItems[0].addEventListener("click", offline);
        menuItems[1].addEventListener("click", online);
    }else{
        mobileInit();
    }
};

/**
 * Function to init the offline version of the app
 */
function offline() {
    TweenMax.to(document.querySelector("#menu"), 1, {
        opacity: 0,
        display: 'none',
        onComplete: function () {
            offlineInit();

            TweenMax.to(document.querySelector("#bm_animation_offline"), 2, {
                opacity: 1,
                display: 'block'
            });
        }
    });
}

/**
 * Function to init the mobile connect/online version of the app
 */
function online() {
    TweenMax.to(document.querySelector("#menu"), 1, {
        opacity: 0,
        display: 'none',
        onComplete: function () {
            onlineInit();
        }
    });
}

/**
 * Get a parameter from a certain URL
 *
 * @param name
 * @param url
 * @return {*}
 */
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return false;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
