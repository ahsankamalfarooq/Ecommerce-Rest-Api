const express = require ('express');
const morgan = require('morgan')
const app = express();
const bodyParser = require('body-parser')
const mongoose = require ('mongoose');

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users')


//mongodb connection

///the below opt will be false by default or to make it true
///we hav to write the below cmd with true, this opt will 
///make strictness in the schema we make for our need to 
///store in db
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://e-commerce-api:e-commerce-api@e-commerce-api.hb7fecx.mongodb.net/test"


//,
//{ 
    //in mongoose 5 we dont need to provide this opt as it 
    //is already set by default so remov it if geting err
    //useMongoClient : true

//}
);

//use to remove deprication warning but it is not working here
//mongoose.Promise = global.Promise;



//Body Parser for incomming request
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



//No Cors Error Occur
app.use((req, res, next) => {
    res.header('Access-Control_Allow-Origin', '*');
    res.header('Access-Control_Allow-Headers', 
    'Origin, X-Requested-WIth, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
})



//ROUTES WHICH SHPULD HANDLE REQUEST
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error ("Not Found")
    error.status(404);
    next(error)
})

app.use((error, req, res, next) => {

    res.status(error.status || 500);
    res.json ({
        error : {
            message : 'error.message'
        }
    })
})


module.exports = app;