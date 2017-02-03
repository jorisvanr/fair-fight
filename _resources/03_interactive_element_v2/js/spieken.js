    var container = document.getElementById('bm_animation');
    var animData = {
        container: container,
        renderer: 'svg',
        loop: true,
        prerender: false,
        autoplay: true,
        autoloadSegments: false,
        path: 'js/data.json'
    };

    var anim;
    var isHitting = false;


    anim = bodymovin.loadAnimation(animData);
    anim.addEventListener('DOMLoaded',startAnimation);
    click_r.onclick = hitRight;
    click_l.onclick = hitLeft;

    function hitComplete(){
        isHitting = false;
        anim.removeEventListener('loopComplete',hitComplete);
    }

    function hitRight(){
        if(isHitting){
            return;
        }
        isHitting = true;
        anim.playSegments([[75,95],[65,75]],true);
        anim.addEventListener('loopComplete',hitComplete);
    }


    function hitLeft(){
        if(isHitting){
            return;
        }
        isHitting = true;
        anim.playSegments([[95,115],[65,75]],true);
        anim.addEventListener('loopComplete',hitComplete);
    }



    function startAnimation(){
        anim.playSegments([[0,65],[65,75]],true);
    }
    






