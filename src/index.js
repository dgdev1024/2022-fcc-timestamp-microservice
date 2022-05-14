/**
 * @file index.js
 */

const path = require("path");
const express = require("express");

// Initialize app...
const app = express();

// Serve public folder...
app.use("/public", express.static(path.join(__dirname, "public")));

// GET /
//
// Serves the index.html page.
app.get("/", (_, res) =>
  res.status(200).sendFile(path.join(__dirname, "pages", "index.html"))
);

// GET /api/:date
//
// Parses the date string given by the :date URL parameter and returns that date's
// UTC and UNIX timestamp representations.
app.get("/api/:date?", (req, res) => {
  // Regular expression for matching strings containing only numbers.
  const numberRegex = /^\d+$/;

  // Get the date string from the route parameter. If one is present, and it passes
  // the regular expression test above, then parse it as an integer.
  let { date } = req.params;
  if (date && numberRegex.test(date) === true) {
    date = parseInt(date);
  }

  // Parse the date string/integer into a Date object, if one was provided. If parsing
  // fails, then return an error.
  const parsedDate = date ? new Date(date) : new Date();
  if (parsedDate.toString() === "Invalid Date") {
    return res.status(400).json({ error: "Invalid Date" });
  }

  // Return the UTC and UNIX timestamp representations of the parsed date.
  return res.status(200).json({
    unix: parsedDate.getTime(),
    utc: parsedDate.toUTCString(),
  });
});

// Listen on port 3000 or port specified by environment variable.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
