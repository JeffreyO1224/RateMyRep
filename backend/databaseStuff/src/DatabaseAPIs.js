const bodyParser = require("body-parser");
const client = require('./index.js');
const express = require('express');
const app = express();

app.listen(3300, () => {
console.log("Server is now listening at port 3000");
})

client.connect();

