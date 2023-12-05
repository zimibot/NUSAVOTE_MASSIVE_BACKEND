const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const RouteUser = require("./routes/RouteUser")
const RouteRegister = require("./routes/RouteRegister")
const RouteCategory = require("./routes/Admin/RoutesCategory")
const RouteStage = require("./routes/Admin/RoutesStage")
const RouteQuestions = require("./routes/Admin/RoutesQuestions")
const RouteUserAnsware = require("./routes/Users/RoutesUserAnsware")
const mongoURL = 'mongodb://0.0.0.0:27017/web-daerah';
var cors = require('cors')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, MongoDB!');
});

const swaggerOptions = {
    swaggerDefinition: {
        components: {
            securitySchemes: {
                ApiKeyAuth: { // Nama skema keamanan kustom
                    type: 'apiKey',
                    in: 'header',
                    name: 'auth' // Nama header kustom untuk token
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        openapi: '3.0.0',
        info: {
            title: 'API Dokumentasi',
            version: '1.0.0',
            description: 'Dokumentasi API dengan Swagger',
            contact: {
                name: 'Nama Anda'
            },
            servers: [{ url: 'http://localhost:3000' }]
        }
    },
    apis: ['./routes/*.js', './routes/Admin/*.js', './routes/Users/*.js'] // path ke file routes Anda
};


app.use('/users', RouteUser);
app.use('/register', RouteRegister);
app.use('/admin/category', RouteCategory);
app.use('/admin/stage', RouteStage);
app.use('/admin/questions', RouteQuestions);

app.use('/users/answare', RouteUserAnsware);
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
