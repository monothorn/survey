const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send({'hello': 'there'});
});

const PORT = process.env.PORT
app.listen(PORT);