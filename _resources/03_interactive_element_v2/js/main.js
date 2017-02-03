    var container = document.getElementById('container');
    var animData = {
        container: container,
        renderer: 'svg',
        loop: true,
        prerender: false,
        autoplay: true,
        autoloadSegments: false,
        path: 'js/mobile_button_03.json'
    };

    var hittable = true;

    var anim;
    var i=1;
    var level = i;

    anim = bodymovin.loadAnimation(animData);
    anim.addEventListener('DOMLoaded',startAnimation);


    function hitted(){
        
        if (hittable) {
            showHitBg();
            hittable = false;
            console.log("HIT ME BITCH");
            setTimeout(function(){
                hideHitBg();
                hittable = true;
            }, 200);  
        }
        
    }

    function showHitBg() {            
        container.className ="flash";
    }
    
    function hideHitBg() {
        container.className ="";
    }

    function startAnimation(){
        anim.playSegments([[0,25],[25,250]],true);
        var button = document.getElementById('button');
        button.onclick = hitted;
    }
    





  switch(level) {
    case "1":
          console.log("eerste");
      break;
    case "2":
           console.log("tweede");         
      break;
    case "3":
          console.log("derde");
      break;
  }

