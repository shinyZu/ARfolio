AFRAME.registerComponent('video-vidhandler-biography', {
    init: function() {
        console.log('video init entered');
        this.toggle = false;
        this.vid = document.querySelector("#profile-vid");
        this.vid.pause();
    },
    tick: function() {
        if (this.el.object3D.visible == true) {
            if (!this.toggle) {
                this.toggle = true;
                this.vid.play();
            }
        } else {
            this.toggle = false;
            this.vid.pause();
        }
    }
});
