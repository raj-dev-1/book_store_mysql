const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
require("./models/index.js");
const { PORT } = require("./config/constant.js");
const app = express();
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", require("./routes/auth.routes.js"));
app.use("/book", require("./routes/book.routes.js"));

app.listen(PORT, () => {
  console.log(`Server listening on port`, PORT);
});
