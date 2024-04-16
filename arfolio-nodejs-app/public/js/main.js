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

function displayProfileImage() {
    const imgElement = document.getElementById('profile-img');
    // imgElement.crossOrigin = "anonymous";
    imagePath = "../images/profile_image.jpg"
    
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

//---------------Render Experiences-----------------------------

function displayUserData(data) {
    console.log(data);
    let experiences = data.Experiences[0];
    console.log(experiences);

    // Assuming data is the object with the experience details
    const jobTitle = document.getElementById('jobTitle');
    const employerName = document.getElementById('employerName');
    const employmentDates = document.getElementById('employmentDates');
    const location = document.getElementById('location');

    if (jobTitle && employerName && employmentDates && location) {
        jobTitle.setAttribute('value', experiences.job_title || 'N/A');
        employerName.setAttribute('value', experiences.employer || 'N/A');
        employmentDates.setAttribute('value', `${experiences.start_month}/${experiences.start_year} - ${experiences.end_month}/${experiences.end_year}`);
        location.setAttribute('value', `${experiences.city}, ${experiences.country}`);
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
        container.appendChild(dates);
        container.appendChild(location);
    });
}


