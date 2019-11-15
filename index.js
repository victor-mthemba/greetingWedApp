const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const GreetingsWebApp = require('./greetings-webapp');
const flash = require('express-flash');
const session = require('express-session');


const app = express();
const pg = require("pg");
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
const connectionString = process.env.DATABASE_URL || 'postgresql://victor:victor123@localhost:5432/greetings';
const pool = new Pool({
    connectionString,
    ssl: useSSL
});
const greetingswebapp = GreetingsWebApp(pool)

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});


app.engine('handlebars', handlebarSetup);


// initialise session middleware - flash-express depends on it
app.use(session({
    secret: 'this is My long String that is used for sessions in http',
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.get('/',async function (req, res)  {
    res.render('index', {
        // username:  await greetingswebapp.greetNameEntered(),
        counter: await greetingswebapp.getCounter(),
        people:  await greetingswebapp.getAllNames(),

    });
});

app.post('/',async function (req, res) {
    let {name, radioType} = req.body;
    if (name === "" || radioType === undefined ) {
        req.flash('error', 'Please enter a name or select a language');

    } 

    res.render('index', {
        username:  await greetingswebapp.greetNameEntered(req.body.name, req.body.radioType),
        counter: await greetingswebapp.getCounter(),
        people:  await greetingswebapp.getAllNames(),
        //currentUser: await greetingswebapp.greetNameEntered(req.body.name),

    });
});

app.get('/greeted',async function (req, res) {
    res.render('greeted', {
        people: await greetingswebapp.getAllNames(),
    });
});

app.get('/counter/:username',async function (req, res) {
    let myname = req.params.username;
    res.render('user', {
        currentUser: myname,
        counter: await greetingswebapp.counterFor(myname)
    });
});

app.post('/reset', async function (req, res) {
    await greetingswebapp.reset();
    res.redirect('/')
});




const PORT = process.env.PORT || 3500;

app.listen(PORT, function () {
    console.log("App started at port: ", PORT)
});