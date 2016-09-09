
console.log(-122.24950651083986 < -122.26667264853518);


inBounds(37.554326, -122.28256,
    37.55475785716652, -122.27697233115236, 37.54213460839179, -122.29413846884768);

function inBounds(pointLat, pointLong, boundsNELat, boundsNELong, boundsSWLat, boundsSWLong) {

    console.log("************************************************************");
    console.log(`${pointLat}, ${pointLong}`);
    console.log(`${boundsNELat}, ${boundsNELong}, ${boundsSWLat}, ${boundsSWLong}`);



    var eastBound = pointLong < boundsNELong;
    var westBound = pointLong > boundsSWLong;
    var inLong;

    console.log("Eastbound: ", eastBound);
    console.log("Westbound: ", westBound);
    console.log("boundsNELong: ", boundsNELong);
    console.log("boundsSWLong: ", boundsSWLong);

    if (boundsNELong < boundsSWLong) {
        inLong = eastBound || westBound;
        console.log("first");
    } else {
        console.log("second");
        inLong = eastBound && westBound;
    }


    console.log("inLong: ", inLong);


    var inLat = pointLat > boundsSWLat && pointLat < boundsNELat;


    console.log(pointLat > boundsSWLat);
    console.log(pointLat < boundsNELat);
    console.log(inLat);
    console.log(inLat && inLong);
    console.log("************************************************************");

    return inLat && inLong;
}
