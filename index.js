require('dotenv').config();
const app = require('./app');
const db = require('./config/connectDB');

async function main() {
    // Connect to the database
    db.connect((err) => {
        if (err) {
            console.error('Database connection failed:', err.stack);
            process.exit(1); // exit app if db fails
        }
        console.log('Database connected');
        
        // Start Express server
        const PORT = process.env.PORT || 7000;
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    });
}

main();

// const app = require('./app');
// const { port } = require('./config/default.json');
// const db = require('./config/connectDB');

// async function main() {

//     //CONNECT DATABASE
//     db;

//     //PORT
//     const PORT = process.env.PORT || port;
// //     const PORT = 8000;

//     //CONNECT EXPRESS
//     await app.listen(PORT, () => console.log('Server Running on:', PORT));
// }

// main();
