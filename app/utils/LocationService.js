const APIKEYS = {
    geoCoding: "AIzaSyDHEA7WpHcPjMCNpBvNf-sJKDxN5QIm0es",
    geoLocation: "AIzaSyDHEA7WpHcPjMCNpBvNf-sJKDxN5QIm0es"
};

/*
    Use: Convert lat/lng to location object
*/
function _geoCodingReverse(lat, lng) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${APIKEYS.geoCoding}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ZERO_RESULTS") {
                throw new Error("No results found!");
            }
            return {
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng,
                formatted: data.results[0].formatted_address
            };
        });
}

/*
    Use: Convert text input to location object
*/
function _geoCoding(newLocation) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${newLocation}&key=${APIKEYS.geoCoding}`)
        .then(response => response.json())
        .then(data => _geoCodingReverse(
            data.results[0].geometry.location.lat, data.results[0].geometry.location.lng)
        );
}

/*
    Use: Determine current location - if browser doesn't support navigator
*/
function _geoLocate() {
    return fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${APIKEYS.geoLocation}`, {
        method: "POST"
    })
        .then(response => response.json())
        .then(data => _geoCodingReverse(data.location.lat, data.location.lng));
}

/*
    Use: Location component uses this to determine the current location
*/
export function determineLocation() {
    if ("geolocation" in navigator) {
        const positionPromise = new Promise(
            (resolve) => {
                navigator.geolocation.getCurrentPosition(
                    position => resolve(_geoCodingReverse(position.coords.latitude, position.coords.longitude)),
                    err => {
                        console.log("Error using navigation API to determine location.", err);
                        return _geoLocate();
                    });
            });
        return positionPromise;
    } else {
        return _geoLocate();
    }
}

/*
    Use: Location component uses this to lookup a user entered location
*/
export function getLocation(newLocation) {
    return _geoCoding(newLocation);
}
