import React from "react";
import ReactDOM from "react-dom";
// import Map from "google-maps-react";

/* Components */
import PokeInfoWindow from "./PokeInfoWindow";
import LoadingOverlay from "./LoadingOverlay";

/* Utils */
import {determineLocation, getLocation} from "../utils/LocationService";

export default class PokeMap extends React.Component {
    constructor(props) {
        super(props);

        this._map = null;
        this._markers = {};             // arrays of markers keyed by sighting.pokemonId
        this._infowindows = [];         // popup windows that are displayed when marker is clicked
        this._sightings = [];           // used to workout if nearbysightings from explore have changed
        this._activeMarkerId = null;    // used to deactivate active marker

        this.state = {
            location: null,
            mapHeight: 0,
            error: false,
            locationSearchError: false
        };

        this.handleLocationSearch = this.handleLocationSearch.bind(this);
    }

    componentDidMount() {
        this.setState({
            mapHeight: this.refs.mapContainer.offsetHeight
        });

        determineLocation()
            .then(locationData => {
                this.setState({
                    location: {
                        lat: locationData.lat,
                        lng: locationData.lng
                    }
                }, () => {
                    this.createMap();
                    this.props.onLocationDetermination(locationData);
                });
            })
            .catch(err => {
                // Unable to determine location based on navigation API
                // Or Google API
                // Ask user to input manually
                this.props.onMapError(true);
                console.log("Error determining location", err);
            });
    }

    componentDidUpdate() {
        if (this.shouldMarkersUpdate()) {
            this.createMarkers();
        }
    }

    shouldMarkersUpdate() {
        return this.props.nearbyPokemon.length !== this._sightings.length ||
            this.props.nearbyPokemon
                .filter(sighting => this._sightings.indexOf(sighting.id) === -1)
                .length > 0;
    }

    createMarkers() {
        this.clearMarkers();
        if (this.props.nearbyPokemon.length > 0) {
            const clusteredSightings = this.createClusteredSightings(this.props.nearbyPokemon);

            // Initialize the markers object with all pokemon ids
            clusteredSightings.forEach((sighting) => {
                this._markers[sighting.pokemonId] = [];
            });

            if (this._map) {
                this.renderMarkers(clusteredSightings);
            } else {
                setTimeout(() => {
                    this.renderMarkers(clusteredSightings);
                    // FIXME: Remove this artifical wait
                }, 2000);
            }
        }
    }

    renderMarkers(clusteredSightings) {
        clusteredSightings.forEach((sighting) => {
            // Create the infowindow for each marker
            var infowindow = new this.props.googleMaps.InfoWindow({
                content: " "
            });
            var containerDiv = document.createElement("div");
            infowindow.setContent(containerDiv);
            ReactDOM.render(<PokeInfoWindow {...sighting} />, containerDiv);
            this._infowindows.push(infowindow);

            const marker = new this.props.googleMaps.Marker({
                position: {
                    lat: sighting.lat,
                    lng: sighting.lng
                },
                map: this._map,
                animation: this.props.googleMaps.Animation.DROP,
                title: sighting.name,
                icon: {
                    url: `http://localhost:2998/${sighting.pokemonId}.png`,
                    scaledSize: new this.props.googleMaps.Size(50, 50),
                    origin: new this.props.googleMaps.Point(0, 0),
                    anchor: new this.props.googleMaps.Point(0, 0)
                }
            });

            this.props.googleMaps.event.addListener(marker, "click", () => {
                // Close any open infowindows
                this._infowindows.forEach((anyOpenInfowindow) => {
                    anyOpenInfowindow.close();
                });
                // Open infowindow for this marker
                infowindow.open(this._map, marker);

                // Let Explore know which pokemon id the marker clicked relates to
                this.props.onMarkerClick(sighting.pokemonId);
            });

            this._markers[sighting.pokemonId].push(marker);
            this._sightings = this._sightings.concat(sighting.id, sighting.clusteredSightings);
        });
    }

    createClusteredSightings(sightings) {
        /*
            sightings -> Map to see which sightings are within cluster distance
            mappedSightings -> Sort by the number of sightings that can be clustered
            sortedMappedSightings -> iterate through the sorted list and create clusters
            clusteredSightings -> return map of clusteredSightings
        */
        let addedSightingIds = [];
        return sightings.map((sighting) => {
            sighting.clusteredSightings = [];

            sightings.forEach((potentialClusterSighting) => {
                if (sighting.id !== potentialClusterSighting.id &&
                    sighting.pokemonId === potentialClusterSighting.pokemonId &&
                    this._withinClusteringDistance(sighting, potentialClusterSighting)) {
                    sighting.clusteredSightings.push(potentialClusterSighting.id);
                }
            });
            return sighting;
        }).sort((a, b) => {
            if (a.clusteredSightings.length > b.clusteredSightings.length) {
                return -1;
            } else if (a.clusteredSightings.length > b.clusteredSightings.length) {
                return 1;
            } else {
                return 0;
            }
        }).reduce((reducedSightings, clusteredSighting) => {
            if (addedSightingIds.indexOf(clusteredSighting.id) === -1) {
                reducedSightings.push(clusteredSighting);
                addedSightingIds.push(clusteredSighting.id);
                addedSightingIds = addedSightingIds.concat(clusteredSighting.clusteredSightings);
            }
            return reducedSightings;
        }, []);
    }

    _withinClusteringDistance(sightingA, sightingB) {
        const MAX_DISTANCE = 0.3,
            R = 3961,
            phi1 = sightingA.lat * Math.PI / 180,
            phi2 = sightingB.lat * Math.PI / 180,
            delta1 = (sightingB.lat - sightingA.lat) * Math.PI / 180,
            delta2 = (sightingB.lng - sightingA.lng) * Math.PI / 180;

        const a = Math.sin(delta1 / 2) * Math.sin(delta1 / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(delta2 / 2) * Math.sin(delta2 / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return (R * c) <= MAX_DISTANCE;
    }

    _activateMarkersForId(id) {
        this._markers[id].forEach((marker) => {
            marker.setIcon({
                url: `http://localhost:2998/${id}.png`,
                scaledSize: new this.props.googleMaps.Size(80, 80),
                origin: new this.props.googleMaps.Point(0, 0),
                anchor: new this.props.googleMaps.Point(0, 0)
            });
        });
        this._activeMarkerId = id;
    }

    _deactivateMarkersForActiveId() {
        if (this._activeMarkerId) {
            this._markers[this._activeMarkerId].forEach((marker) => {
                marker.setIcon({
                    url: `http://localhost:2998/${this._activeMarkerId}.png`,
                    scaledSize: new this.props.googleMaps.Size(50, 50),
                    origin: new this.props.googleMaps.Point(0, 0),
                    anchor: new this.props.googleMaps.Point(0, 0)
                });
            });
        }
    }

    createMap() {
        this._map = new this.props.googleMaps.Map(this.refs.googleMap, {
            center: {lat: this.state.location.lat, lng: this.state.location.lng},
            scrollwheel: false,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControlOptions: {
                position: this.props.googleMaps.ControlPosition.TOP_LEFT
            }
        });

        this.props.googleMaps.event.addListener(this._map, "tilesloaded", () => {
            this.props.onLocationChange({
                northEast: this._map.getBounds().getNorthEast(),
                southWest: this._map.getBounds().getSouthWest()
            });
            this.props.googleMaps.event.clearListeners(this._map, "tilesloaded");
        });

        this.props.googleMaps.event.addListener(this._map, "dragend", () => {
            this.props.onLocationChange({
                northEast: this._map.getBounds().getNorthEast(),
                southWest: this._map.getBounds().getSouthWest()
            });
            this.props.onMarkerClick(null);
        });
        this.props.googleMaps.event.addListener(this._map, "zoom_changed", () => {
            this.props.onLocationChange({
                northEast: this._map.getBounds().getNorthEast(),
                southWest: this._map.getBounds().getSouthWest()
            });
            this.props.onMarkerClick(null);
        });
    }

    handleActivePokemonChange() {
        if (this.props.activePokemonId) {
            this._deactivateMarkersForActiveId();
            this._activateMarkersForId(this.props.activePokemonId);
        } else {
            this._activeMarkerId = null;
        }
    }

    clearMarkers() {
        for (let id in this._markers) {
            if (this._markers.hasOwnProperty(id)) {
                this._markers[id].forEach(marker => {
                    marker.setMap(null);
                });
            }
        }
        this._markers = {};
        this._sightings = [];
    }

    handleLocationSearch() {
        getLocation(this.refs.newLocationInput.value)
            .then(locationData => {
                this.props.onMapError(false);
                this.setState({
                    location: {
                        lat: locationData.lat,
                        lng: locationData.lng
                    },
                    error: false
                }, () => {
                    this.createMap();
                });
            })
            .catch(err => {
                this.setState({
                    locationSearchError: true
                });
                console.log("Error searching for manually entered location", err);
            });
    }

    render() {
        this.handleActivePokemonChange();

        return (
            <div className="pokemap-container" ref="mapContainer">
                <span className="report-sighting-button" onClick={this.props.onToggleReportSighting}>+</span>
                {
                    (this.state.error) ?
                        <div className="column-center-center" style={{padding: 20, textAlign: "center"}}>
                            <p><i className="fa fa-exclamation-circle" style={{fontSize: "60px"}}></i></p>
                            <p>Sorry! Looks like something went wrong whilst loading the map.</p>
                            <p>You can try to either refresh the application or search for your location below.</p>
                            <div className="row-center" style={{justifyContent: "space-around"}}>
                                <div style={{flexBasis: "80%"}}>
                                    <input
                                        className="pd-input"
                                        style={{width: "100%"}}
                                        placeholder="Address, Zip Code..."
                                        ref="newLocationInput"/>
                                </div>
                                <div style={{textAlign: "center"}}>
                                    <button className="pd-button"
                                        style={{
                                            padding: "0 15px",
                                            borderBottom: "1px solid #FAEEC4",
                                            fontSize: 15
                                        }}
                                        onClick={this.handleLocationSearch}><i className="fa fa-search"></i></button>
                                </div>
                            </div>
                            {
                                (this.state.locationSearchError) ?
                                    <p className="pd-error-text">Oops! Error searching address. Please try again.</p> : null
                            }
                        </div>
                        :
                        <div style={{height: "100%"}}>
                            {
                                (this.props.isExploreReady === true) ?
                                    null : <LoadingOverlay showSpinner={true} />
                            }
                            <div
                                className="pokemap"
                                style={{height: this.state.mapHeight}}
                                ref="googleMap">
                            </div>
                        </div>
                }
            </div>
        );
    }


}

PokeMap.propTypes = {
    onLocationChange: React.PropTypes.func,
    nearbyPokemon: React.PropTypes.array,
    googleMaps: React.PropTypes.object,
    activePokemonId: React.PropTypes.number,
    onMarkerClick: React.PropTypes.func,
    isExploreReady: React.PropTypes.bool,
    onMapError: React.PropTypes.func,
    onLocationDetermination: React.PropTypes.func,
    onToggleReportSighting: React.PropTypes.func
};
