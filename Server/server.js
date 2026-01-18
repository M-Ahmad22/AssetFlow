const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend Server is running on port ${PORT}`);
});

// const app = require("./app"); // your Express app
// module.exports = app;
