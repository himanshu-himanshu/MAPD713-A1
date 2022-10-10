const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

var GET_COUNTER = 0;
var POST_COUNTER = 0;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_COMPASS_URL, { useNewUrlParser: true });

var conn = mongoose.connection;

conn.on("connected", function () {
  console.log("Database is connected successfully");
});
conn.on("disconnected", function () {
  console.log("database is disconnected successfully");
});
conn.on("error", console.error.bind(console, "connection error:"));

var picSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

const Picture = mongoose.model("Picture", picSchema);

app.get("/images", (req, res) => {
  GET_COUNTER++;
  console.log("> Images GET: recieved request");
  console.log("< Images GET: sending response");
  console.log(
    `Processed Request Count --> Get: ${GET_COUNTER} ,Post: ${POST_COUNTER}`
  );
  Picture.find()
    .then((pics) => {
      if (pics.length == 0) {
        return res.status(200).send("No Images Founded");
      }
      res.send(pics);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

app.post("/images", (req, res, next) => {
  POST_COUNTER++;
  console.log("> Images POST: recieved request");
  console.log("< Images POST: sending response");
  console.log(
    `Processed Request Count --> Get: ${GET_COUNTER} ,Post: ${POST_COUNTER}`
  );
  let newPicture = {
    id: req.body.id,
    name: req.body.name,
    url: req.body.url,
    size: req.body.size,
  };

  new Picture(newPicture)
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => console.log("Error:", err));
});

app.delete("/images", (req, res) => {
  console.log("> Images DELETE: recieved request");
  console.log("< Images DELETE: sending response");

  Picture.deleteMany({})
    .then((result) => {
      res.send("Deletion Completed!");
      return result;
    })
    .catch((err) => console.log("Error:", err));
});

app.listen(process.env.DEFAULT_PORT, () => {
  console.log(
    `Server is listening at http://${process.env.HOST}:${process.env.DEFAULT_PORT}`
  );
  console.log(
    `Endpoints: http://${process.env.HOST}/images \nMethods: GET, POST, DELETE`
  );
  console.log(
    `Processed Request Count --> Get: ${GET_COUNTER} ,Post: ${POST_COUNTER}`
  );
});
