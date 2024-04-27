const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

const PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files from the public directory
app.use(express.static('public'));

// const main = require("./public/routes/main");
// app.use(`/`, main);

app.get('/:id(\\d+)', async(req, res) => {
    console.log("req.params.id: " + req.params.id);
    // res.render('index', { userId: req.params.id });

    const image_url = `http://localhost:4001/arfolio/api/v1/users/image/${req.params.id}`;
    const video_url = `http://localhost:4001/arfolio/api/v1/users/video/${req.params.id}`;

    downloadUserImage(req.params.id,image_url);
    downloadUserVideo(req.params.id,video_url);

    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});

async function downloadUserImage(user_id, url) {
    const directory = path.join(__dirname, 'public/images');

    try {
        // Regular expression to match files like "profile_image_123.jpg"
        const imageRegex = /^profile_image_\d+\.jpg$/;

        // Delete existing images matching the pattern
        fs.readdir(directory, (err, files) => {
            if (err) throw new Error('Error reading directory: ' + err.message);

            files.forEach(file => {
                if (imageRegex.test(file)) {
                    fs.unlink(path.join(directory, file), err => {
                        if (err) {
                            console.error(`Error removing old image ${file}:`, err);
                        } else {
                            console.log(`Successfully removed old image ${file}`);
                        }
                    });
                }
            });
        });

        // Fetch new image data
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.image_url) {
            const imagePath = path.join(directory, `profile_image_${user_id}.jpg`);
            console.log("Image path: ", imagePath);

            // Fetch and write new image
            const imageResponse = await fetch(data.image_url);
            const buffer = await imageResponse.buffer();
            fs.writeFile(imagePath, buffer, () => {
                console.log('New profile image downloaded and saved.');
            });
        } else {
            console.log('Failed to fetch image URL or bad response');
        }
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

async function downloadUserVideo(user_id, url) {
    const videoDirectory = path.join(__dirname, 'public/videos');

    try {
        // Regular expression to match files like "profile_video_123.mp4"
        const videoRegex = /^profile_video_\d+\.mp4$/;

        // Scan and delete existing videos matching the pattern
        fs.readdir(videoDirectory, (err, files) => {
            if (err) throw err;

            files.forEach(file => {
                if (videoRegex.test(file)) {
                    fs.unlink(path.join(videoDirectory, file), err => {
                        if (err) {
                            console.error(`Error removing old video ${file}:`, err);
                        } else {
                            console.log(`Successfully removed old video ${file}`);
                        }
                    });
                }
            });
        });

        // Fetch new video data
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.video_url) {
            const videoPath = path.join(videoDirectory, `profile_video_${user_id}.mp4`);
            console.log("Video path: ", videoPath);

            // Fetch and write new video
            const videoResponse = await fetch(data.video_url);
            const buffer = await videoResponse.buffer();
            fs.writeFile(videoPath, buffer, () => {
                console.log('New user video downloaded and saved.');
            });
        } else {
            console.log('Failed to fetch video URL or bad response');
        }
    } catch (error) {
        console.error('Error handling video download and cleanup:', error);
    }
}

async function downloadUserImageOld(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.image_url) {
            console.log("===========1============")
            console.log("__dirname ", __dirname);
            const imagePath = path.join(__dirname, 'public/images', 'profile_image.jpg');
            console.log("imagePath ", imagePath);

            // Delete existing image if it exists
            fs.unlink(imagePath, (err) => {
                console.log("===========2============")
                if (err && err.code === 'ENOENT') {
                    console.log("===========3============")
                    console.log("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.log("===========4============")
                    console.error('Error occurred while trying to remove file');
                } else {
                    console.log("===========5============")
                    console.log('Removed old profile image.');
                }
                
                // Fetch and write new image
                fetch(data.image_url)
                    .then(imageResponse => imageResponse.buffer())
                    .then(buffer => {
                        console.log("===========6============")
                        fs.writeFile(imagePath, buffer, () => {
                            console.log('New profile image downloaded and saved.');
                            // res.send('Profile image updated successfully.');
                        });
                    });
            });
        } else {
            console.log("===========7============")
            // throw new Error('Failed to fetch image URL or bad response');
            console.log('Failed to fetch image URL or bad response');
        }
        console.log("===========8============")
        
    } catch (error) {
        console.log("===========9============")
        console.error('Error fetching image:', error);
        res.status(500).send('Error downloading the image');
    }
}

async function downloadUserVideoOld(user_id,url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.video_url) {
            const videoPath = path.join(__dirname, 'public/videos', `profile_video_${user_id}.mp4`);
            console.log("videoPath ", videoPath);

            // Delete existing video if it exists
            fs.unlink(videoPath, async (err) => {
                if (err && err.code === 'ENOENT') {
                    console.log("Video file doesn't exist, won't remove it.");
                } else if (err) {
                    console.error('Error occurred while trying to remove video file');
                } else {
                    console.log('Removed old user video.');
                }

                // Fetch and write new video
                const videoResponse = await fetch(data.video_url);
                const buffer = await videoResponse.buffer();
                fs.writeFile(videoPath, buffer, () => {
                    console.log('New user video downloaded and saved.');
                });
            });
        } else {
            console.log('Failed to fetch video URL or bad response');
        }
    } catch (error) {
        console.error('Error fetching video:', error);
    }
}


