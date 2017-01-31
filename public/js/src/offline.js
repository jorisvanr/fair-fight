var anim, isHitting;

function offlineInit() {
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
    offlinestartAnimation();

    document.querySelector("#click_r").addEventListener("click", offlinehitRight);
    document.querySelector("#click_l").addEventListener("click", offlinehitLeft);
}

function offlinehitComplete() {
    isHitting = false;
    anim.removeEventListener('loopComplete', offlinehitComplete);
}

function offlinehitRight() {
    if (isHitting) {
        return;
    }

    isHitting = true;
    anim.playSegments([[75, 95], [65, 75]], true);
    anim.addEventListener('loopComplete', offlinehitComplete);
}

function offlinehitLeft() {
    if (isHitting) {
        return;
    }

    isHitting = true;
    anim.playSegments([[95, 115], [65, 75]], true);
    anim.addEventListener('loopComplete', offlinehitComplete);
}

function offlinestartAnimation() {
    anim.playSegments([[0, 65], [65, 75]], true);
}
