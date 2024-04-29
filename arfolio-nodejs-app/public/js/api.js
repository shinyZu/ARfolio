function getSingleUserBtId() {
    const userId = getUserIDFromURL();
    const url = `http://localhost:4001/arfolio/api/v1/users/admin/${userId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            let resData = data.data[0];
            console.log('Success:', resData);
            // Here you can handle the data as needed, e.g., display it in the HTML
            displayUserData(resData);

            displayExperiences(resData.Experiences); 
            displayEducation(resData.Education); 
            displayProjects(resData.Projects); 
            displayLinks(resData.Links); 
            displayProfileImage(userId);
            displayProfileVideo(userId);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    getSingleUserBtId();
});