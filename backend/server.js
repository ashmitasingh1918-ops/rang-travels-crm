// Load environment variables
require("dotenv").config();

// Import Express app
const app = require("./app");

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});