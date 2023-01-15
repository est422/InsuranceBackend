const { TOKEN_SECRET, origin, methods } = require('./config/default.json');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors({
    origin: origin,
    methods: methods,
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

//Import routes
const userAccountRoutes = require('./routes/userAccountRoutes');

//Route middleware
app.use('/api/user', userAccountRoutes);


module.exports = app;

