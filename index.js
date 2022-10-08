const express = require("express");
const app = express();
//var router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = 8080;
const HOST = "127.0.0.1";
const MONGODB_COMPASS =
  "mongodb+srv://gangwar0145:xxGTyguBt2EnatV5@cluster0.mmynjns.mongodb.net/?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(MONGODB_COMPASS, { useNewUrlParser: true });

var conn = mongoose.connection;

conn.on("connected", function () {
  console.log("database is connected successfully");
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
  Picture.find()
    .then((pics) => {
      if (pics.length == 0) {
        return res.send("No Images Founded");
      }
      res.send(pics);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

app.post("/images", (req, res, next) => {
  let newPicture = {
    id: req.body.id,
    name: req.body.name,
    url: req.body.url,
    size: req.body.size,
  };

  new Picture(newPicture)
    .save()
    .then((result) => {
      res.send(201, result);
    })
    .catch((err) => console.log("Error:", err));
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://${HOST}:${PORT}`);
  console.log(`Endpoints: http://${HOST}/images method: GET, POST`);
});
