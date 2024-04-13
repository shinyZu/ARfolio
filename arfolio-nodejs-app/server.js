const express = require('express');
const app = express();

const PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files from the public directory
app.use(express.static('public'));

app.get('/:id(\\d+)', (req, res) => {
    // res.sendFile(__dirname + '/public/arfolio.html');
    console.log("req.params.id: " + req.params.id);
    // res.render('index', { userId: req.params.id });
    res.sendFile(__dirname + '/public/index.html');
});

// app.get('/', (req, res) => {
//     console.log("req.query.id: " + req.query.id);
//     res.render('arfolioo', { userId:  req.query.id });
// });

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
