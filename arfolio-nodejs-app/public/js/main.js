document.addEventListener('DOMContentLoaded', function () {
    // Get the user ID from the URL's pathname
    var userId = window.location.pathname.substring(1); // Remove the first slash
    console.log("UserID from URL Path:", userId);

    // Get the <a-marker> element
    var marker = document.getElementById('barcode-marker');

    // Check if marker exists before trying to set an attribute
    if (marker) {
        // Set the 'value' attribute of the marker to the userId
        marker.setAttribute('value', userId);
        console.log("Marker after setting value:", marker);
    } else {
        console.log("Marker element not found.");
    }
});

function getUserIDFromURL() {
    const pathArray1 = window.location.pathname.split('/');
    console.log(pathArray1)
    // return pathArray[pathArray.length - 1]; // Gets the last segment of the URL
    var pathArray2 = window.location.pathname.substring(1);
    console.log(pathArray2)
    return pathArray2;
}

//---------------Render Profile Image-----------------------------

function displayProfileImage(userId) {
    console.log(userId)
    const imgElement = document.getElementById('profile-img');
    // imgElement.crossOrigin = "anonymous";
    // const imagePath = "../images/profile_image.jpg"
    const imagePath = "../images/profile_image_"+userId+".jpg";
    // const imagePath = "../images/profile.jpg";
    console.log("imagePath: ",imagePath)
    
    if (imgElement) {
        imgElement.src = imagePath; // Update the image source
        console.log(imgElement)
        // Also update the texture for the a-plane in A-Frame, if needed
        const profilePlane = document.querySelector('a-plane[material="src: #profile-img"]');
        if (profilePlane) {
            profilePlane.setAttribute('material', 'src', imagePath);
        }
    } else {
        console.error('Profile image element not found');
    }
}

//---------------Render Profile Video-----------------------------

function displayProfileVideo(userId) {
    console.log(userId + " is being displayed");
    const videoPath = "../videos/profile_video_"+userId+".mp4";
    console.log("videoPath: ", videoPath);

    // Update the A-Frame video source
    const aframeVideoAsset = document.getElementById('profile-vid');
    if (aframeVideoAsset) {
        console.log(aframeVideoAsset)
        aframeVideoAsset.setAttribute('src', videoPath);
        aframeVideoAsset.load();  // Ensure the A-Frame asset video reloads the new source
        aframeVideoAsset.play();  
        console.log('Updated A-Frame video asset:', aframeVideoAsset);
    } else {
        console.error('A-Frame video asset not found');
    }   
}

//---------------Render Experiences-----------------------------

function displayUserData(data) {
    console.log(data);

    // Assuming data is the object with the experience details
    const user_name = document.getElementById('user_name');

    if (user_name) {
        user_name.setAttribute('value', `${data.title} ${data.first_name} ${data.last_name}`);
        user_name.setAttribute('color', '#0D47A1');
    } else {
        console.error('One or more A-Frame text elements not found.');
    }
   
}

//---------------Render Experiences-----------------------------

function displayExperiences(experiences) {
    const container = document.getElementById('experiencesContainer');
    if (!container) {
        console.error('Experiences container not found');
        return;
    }

    // Clear existing entries if any (to avoid duplication)
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    const title = document.createElement('a-text');
    title.setAttribute('value', 'Work Experience');
    title.setAttribute('color', '#1A237E');
    title.setAttribute('position', `-2 5.8 -5`);
    title.setAttribute('scale', '1.8 1.8 1');
    title.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

    container.appendChild(title);

    // Generate a new set of entries
    experiences.forEach((exp, index) => {
        console.log(exp)
        // const yOffset = -0.3 * index; // Adjust y offset for each new text entity, Vertical spacing
        const yOffset = 2.5 * index;
        console.log(yOffset)
        
        const jobTitle = document.createElement('a-text');
        jobTitle.setAttribute('value', exp.job_title || 'Loading...');
        jobTitle.setAttribute('color', 'black');
        jobTitle.setAttribute('position', `-2 ${yOffset} -5`);
        jobTitle.setAttribute('scale', '1.6 1.6 1');
        jobTitle.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        const employer = document.createElement('a-text');
        employer.setAttribute('value', exp.employer || 'Loading...');
        employer.setAttribute('color', 'black');
        employer.setAttribute('position', `-2 ${yOffset - 0.5} -5`);
        employer.setAttribute('scale', '1.2 1.2 1');
        employer.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        const linkPath = "../images/links/link_icon.png";
        console.log("linkPath: ",linkPath)

        const linkIcon = document.createElement('a-plane');
        linkIcon.setAttribute('material', `src: ${linkPath}; transparent: true;`);
        linkIcon.setAttribute('position', `-2.2 ${yOffset - 0.5} -5`); 
        linkIcon.setAttribute('scale', '0.5 0.5 1');
        linkIcon.setAttribute('href', exp.employer_link);
        linkIcon.setAttribute('target', '_blank');

        const dates = document.createElement('a-text');
        
        let dateString = `${exp.start_month}/${exp.start_year}`; // Start date part
        if (exp.end_month && exp.end_year) {
            dateString += ` - ${exp.end_month}/${exp.end_year}`; // End date part if available
        } else {
            dateString += ' - Present'; // Use 'Present' if end month/year are not specified
        }
        
        dates.setAttribute('value', `${dateString}`);
        
        dates.setAttribute('color', 'black');
        dates.setAttribute('position', `-2 ${yOffset - 1.0} -5`);
        dates.setAttribute('scale', '1.2 1.2 1');
        dates.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        const location = document.createElement('a-text');
        location.setAttribute('value', `${exp.city}, ${exp.country}`);
        location.setAttribute('color', 'black');
        location.setAttribute('position', `-2 ${yOffset - 1.5} -5`);
        location.setAttribute('scale', '1.2 1.2 1');
        location.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        // Append to the container
        container.appendChild(jobTitle);
        container.appendChild(employer);
        container.appendChild(linkIcon);
        container.appendChild(dates);
        container.appendChild(location);
    });
}

//---------------Render Education-----------------------------

function displayEducation(education) {
    const container = document.getElementById('educaitonContainer');
    if (!container) {
        console.error('Education container not found');
        return;
    }

    // Clear existing entries if any (to avoid duplication)
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // yPos = 2 * 2 - 0.8 = 3.2
    // yPos = (2 * 2) - (0.8 * 0.4) = 1.28

    // let yPos = (2 * education.length) - (0.8 * education.length / 2)
    let yPos = 2 * education.length - 0.8; // Adding 1 or more units to ensure it is above all entries
    
    const title = document.createElement('a-text');
    title.setAttribute('value', 'Education');
    title.setAttribute('color', '#1A237E');
    title.setAttribute('position', `-2 3.5 -5`);
    // title.setAttribute('position', `-2 ${yPos} -5`);
    title.setAttribute('scale', '1.8 1.8 1');
    title.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

    container.appendChild(title);

    // Generate a new set of entries
    education.forEach((obj, index) => {
        console.log(obj)
        // const yOffset = -0.3 * index; // Adjust y offset for each new text entity, Vertical spacing
        const yOffset = 2.5 * index;
        console.log(yOffset)
        
        const degree = document.createElement('a-text');
        degree.setAttribute('value', obj.degree || 'Loading...');
        degree.setAttribute('color', 'black');
        degree.setAttribute('position', `-2 ${yOffset} -5`);
        degree.setAttribute('scale', '1.6 1.6 1');
        degree.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        const school = document.createElement('a-text');
        school.setAttribute('value', obj.school || 'Loading...');
        school.setAttribute('color', 'black');
        school.setAttribute('position', `-2 ${yOffset - 0.5} -5`);
        school.setAttribute('scale', '1.2 1.2 1');
        school.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        const dates = document.createElement('a-text');
        
        let dateString = `${obj.start_month}/${obj.start_year}`; // Start date part
        if (obj.end_month && obj.end_year) {
            dateString += ` - ${obj.end_month}/${obj.end_year}`; // End date part if available
        } else {
            dateString += ' - Present'; // Use 'Present' if end month/year are not specified
        }
        
        dates.setAttribute('value', `${dateString}`);
        
        
        dates.setAttribute('color', 'black');
        dates.setAttribute('position', `-2 ${yOffset - 1.0} -5`);
        dates.setAttribute('scale', '1.2 1.2 1');
        dates.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        const location = document.createElement('a-text');
        location.setAttribute('value', `${obj.city}, ${obj.country}`);
        location.setAttribute('color', 'black');
        location.setAttribute('position', `-2 ${yOffset - 1.5} -5`);
        location.setAttribute('scale', '1.2 1.2 1');
        location.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        // Append to the container
        container.appendChild(degree);
        container.appendChild(school);
        container.appendChild(dates);
        container.appendChild(location);
    });
}

//---------------Render Projects-----------------------------

function displayProjects(projects) {
    const container = document.getElementById('projectsContainer');
    if (!container) {
        console.error('Projects container not found');
        return;
    }

    // Clear existing entries if any (to avoid duplication)
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    const title = document.createElement('a-text');
    title.setAttribute('value', 'Projects');
    title.setAttribute('color', '#1A237E');
    title.setAttribute('position', `-2 3.5 -5`);
    title.setAttribute('scale', '1.8 1.8 1');
    title.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

    container.appendChild(title);

    // Generate a new set of entries
    projects.forEach((obj, index) => {
        console.log(obj)
        // const yOffset = -0.3 * index; // Adjust y offset for each new text entity, Vertical spacing
        const yOffset = 2.5 * index;
        console.log(yOffset)
        
        const projectTitle = document.createElement('a-text');
        projectTitle.setAttribute('value', obj.project_title || 'Loading...');
        projectTitle.setAttribute('color', 'black');
        projectTitle.setAttribute('position', `-2 ${yOffset} -5`);
        projectTitle.setAttribute('scale', '1.6 1.6 1');
        projectTitle.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        const linkPath = "../images/links/link_icon.png";
        console.log("linkPath: ",linkPath)

        const linkIcon = document.createElement('a-plane');
        linkIcon.setAttribute('material', `src: ${linkPath}; transparent: true;`); // Set the source of the image and make the background transparent
        linkIcon.setAttribute('position', `-2.2 ${yOffset} -5`); // Position it next to the text
        linkIcon.setAttribute('scale', '0.5 0.5 1'); // Set the scale of the plane to be appropriately sized as an icon
        linkIcon.setAttribute('href', obj.project_link);
        linkIcon.setAttribute('target', '_blank');

        // const projectLink = document.createElement('a-text');
        // projectLink.setAttribute('value', obj.project_link || 'Loading...');
        // projectLink.setAttribute('color', 'black');
        // projectLink.setAttribute('position', `-2 ${yOffset - 0.5} -5`);
        // projectLink.setAttribute('scale', '1.2 1.2 1');
        // projectLink.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        const description = document.createElement('a-text');
        description.setAttribute('value', obj.description || 'Loading...');
        description.setAttribute('color', 'black');
        description.setAttribute('position', `-2 ${yOffset - 0.5} -5`);
        description.setAttribute('scale', '1.2 1.2 1');
        description.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        const dates = document.createElement('a-text');
        
        let dateString = `${obj.start_month}/${obj.start_year}`; // Start date part
        if (obj.end_month && obj.end_year) {
            dateString += ` - ${obj.end_month}/${obj.end_year}`; // End date part if available
        } else {
            dateString += ' - Present'; // Use 'Present' if end month/year are not specified
        }
        
        dates.setAttribute('value', `${dateString}`);
        
        dates.setAttribute('color', 'black');
        dates.setAttribute('position', `-2 ${yOffset - 1.0} -5`);
        dates.setAttribute('scale', '1.2 1.2 1');
        dates.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');

        // Append to the container
        container.appendChild(projectTitle);
        // container.appendChild(projectLink);
        container.appendChild(linkIcon);
        container.appendChild(description);
        container.appendChild(dates);
    });
}

//---------------Render Links-----------------------------

function displayLinks(links) {
    console.log(links)
    const linkedinContainer = document.getElementById('linkedinContainer');
    if (!linkedinContainer) {
        console.error('Linkedin container not found');
        return;
    }
    console.log( links[0].linkedin)
    // linkedinContainer.setAttribute('href',  'https://www.linkedin.com/in/shinysirichandra99/');
    linkedinContainer.setAttribute('href',  links[0].linkedin);
    linkedinContainer.setAttribute('target', '_blank');
    
    const websiteContainer = document.getElementById('websiteContainer');
    if (!websiteContainer) {
        console.error('Website container not found');
        return;
    }
    websiteContainer.setAttribute('href',  links[0].website);
    websiteContainer.setAttribute('target', '_blank');
    
    const githubContainer = document.getElementById('githubContainer');
    if (!githubContainer) {
        console.error('GitHub container not found');
        return;
    }
    githubContainer.setAttribute('href',  links[0].github);
    githubContainer.setAttribute('target', '_blank');
    
    const instagramContainer = document.getElementById('instagramContainer');
    if (!instagramContainer) {
        console.error('Instagram container not found');
        return;
    }
    instagramContainer.setAttribute('href',  links[0].instagram);
    instagramContainer.setAttribute('target', '_blank');
    
    const twitterContainer = document.getElementById('twitterContainer');
    if (!twitterContainer) {
        console.error('Twitter container not found');
        return;
    }
    twitterContainer.setAttribute('href',  links[0].twitter);
    twitterContainer.setAttribute('target', '_blank');
    
    const spotifyContainer = document.getElementById('spotifyContainer');
    if (!spotifyContainer) {
        console.error('Spotify container not found');
        return;
    }
    spotifyContainer.setAttribute('href',  links[0].spotify);
    spotifyContainer.setAttribute('target', '_blank');
    
    const facebookContainer = document.getElementById('facebookContainer');
    if (!facebookContainer) {
        console.error('Facebook container not found');
        return;
    }
    facebookContainer.setAttribute('href',  links[0].facebook);
    facebookContainer.setAttribute('target', '_blank');
}