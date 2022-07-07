const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors')

const app = express();

// Connect Database
connectDB();

// Init Middleware (included in express) in order to accept body data
app.use(express.json({ extended: false }));

// Define Routes
// if hit /api/users, will redirect to ./routes/users
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use(cors({ origin: '*' }))
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  // create route
  // resolve(look at the current directory, then look in ....)
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}
// get the env variable called PORT or customized development env
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
