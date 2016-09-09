// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var cors        = require('cors');
var bodyParser  = require('body-parser');
var uuid        = require('node-uuid');

var sightings = require('./sightings.js');
var pokemon   = require('./pokemonlist.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
    origin: "http://localhost:2999"
}));

var port = process.env.PORT || 2998;        // set our port

// var sightings = sightings.mockSightings("home");
var sightings = sightings.mockSightings("work");

app.use(express.static('assets/pokemon/sprites/'));

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/sightings', function(req, res) {
    if (req.query.password === "#ThIs1is2t0p3#s3cRet!!") {
        res.json(sightings);
    } else {
        res.json([]);
    }
});

router.post("/sighting", function(req, res) {
    var sighting = Object.assign({}, req.body, {
        id: uuid.v4()
    });
    sightings.push(sighting);
    res.json({status: 200});
});

router.get("/sightingsInBounds", function(req, res) {
    var neLat = parseFloat(req.query.nelat),
        neLng = parseFloat(req.query.nelng),
        swLat = parseFloat(req.query.swlat),
        swLng = parseFloat(req.query.swlng);

    res.json(sightings.filter(function(sighting) {
        return inBounds(sighting.lat, sighting.lng,
            neLat, neLng, swLat, swLng, sighting.name);
    }));
});

router.get("/pokemonlist", function(req, res) {
    res.json(pokemon.getPokemonList());
});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

// http://stackoverflow.com/questions/10939408/determine-if-lat-lng-in-bounds
function inBounds(pointLat, pointLong, boundsNELat, boundsNELong, boundsSWLat, boundsSWLong, name) {
    var eastBound = pointLong < boundsNELong;
    var westBound = pointLong > boundsSWLong;
    var inLong;

    if (boundsNELong < boundsSWLong) {
        inLong = eastBound || westBound;
    } else {
        inLong = eastBound && westBound;
    }

    var inLat = pointLat > boundsSWLat && pointLat < boundsNELat;

    return inLat && inLong;
}
