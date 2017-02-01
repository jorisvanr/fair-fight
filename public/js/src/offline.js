function offlineInit() {
    // Init global vars
    var anim, isHitting = false;

    var container = document.getElementById('bm_animation_offline');
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

    document.querySelector("#click_r").addEventListener("click", hitRight);
    document.querySelector("#click_l").addEventListener("click", hitLeft);

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
    }
}
