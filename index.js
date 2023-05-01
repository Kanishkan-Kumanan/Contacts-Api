const express = require('express');
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');

const app = express();

const dotenv = require('dotenv').config()

const port = process.env.PORT || 5000

dbConnect();
express.json();
app.use(bodyParser.json());

app.use("/api/contacts",require("./routes/ContactRoute"))
app.use("/api/users",require("./routes/userRoute"));


app.listen(port,()=>{
    console.log("App is running on 5000");
})