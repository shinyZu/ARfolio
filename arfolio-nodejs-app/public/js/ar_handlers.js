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

// AFRAME.registerComponent('linkedin-handler', {
//     init: function() {
//         const container = document.querySelector("#linkedinContainer"); // Ensure we are targeting the correct element
//         const imgLinkedin = document.querySelector("#img-linkedin"); // Ensure we are targeting the correct element

//         imgLinkedin.addEventListener('click', (ev,target) => {
//             console.log(ev)
//             console.log("target:", target)

//             // const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;
//             //     console.log("intersectedElement:", intersectedElement);

//             // if (imgLinkedin && intersectedElement === imgLinkedin) {
//             //     console.log("Clicked");
//             //     window.location.href = "https://www.linkedin.com/in/shinysirichandra99/";
//             // }

//             // // Confirm the click is directly on the imgLinkedin plane
//             // if (ev.target === imgLinkedin) {
//             //     console.log("LinkedIn plane was clicked!");
//             //     window.location.href = "https://www.linkedin.com/in/shinysirichandra99/";
//             // }
//         });
//     }
// });

