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

app.get('/:id(\\d+)', async(req, res) => {
    console.log("req.params.id: " + req.params.id);
    // res.render('index', { userId: req.params.id });
    const url = `http://localhost:4001/arfolio/api/v1/users/image/${req.params.id}`;
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
        res.sendFile(__dirname + '/public/index.html');
    } catch (error) {
        console.log("===========9============")
        console.error('Error fetching image:', error);
        res.status(500).send('Error downloading the image');
    }
    
});

// app.get('/', (req, res) => {
//     console.log("req.query.id: " + req.query.id);
//     res.render('arfolioo', { userId:  req.query.id });
// });

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
