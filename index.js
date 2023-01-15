const app = require('./app');
const { port } = require('./config/default.json');
const db = require('./config/connectDB');

async function main() {

    //CONNECT DATABASE
    db;

    //PORT
    const PORT = process.env.PORT || port;
//     const PORT = 8000;

    //CONNECT EXPRESS
    await app.listen(PORT, () => console.log('Server Running on:', PORT));
}

main();
