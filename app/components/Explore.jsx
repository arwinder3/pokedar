import React from "react";

import PokeMap from "./PokeMap";
import NearbySightings from "./NearbySightings";
import ReportSighting from "./ReportSighting";

import {getNearbyPokemonInBounds, getPokemonList} from "../utils/PokeService";
// import {determineLocation} from "../utils/LocationService";

export default class Explore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            currentLocation: null,
            nearbyPokemon: [],
            activePokemonId: null,
            ready: false,
            error: false,
            mapError: false,
            showReportSighting: false,
            pokemonList: []
        };

        this.updateLocation = this.updateLocation.bind(this);
        this.handlePokeCardClick = this.handlePokeCardClick.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.handleMapError = this.handleMapError.bind(this);
        this.handleReportSightingToggle = this.handleReportSightingToggle.bind(this);
        this.handleLocationDetermination = this.handleLocationDetermination.bind(this);
    }

    componentWillMount() {
        getPokemonList()
            .then(pokemonList => {
                this.setState({
                    pokemonList: pokemonList
                });
            });
            // FIXME: Add error handling
    }

    /*
        Passed to children as onLocationChange
        Called whenever user pans/zooms as well as when map is initialized
    */
    updateLocation(location) {
        this.setState({
            ready: false
        }, () => {
            getNearbyPokemonInBounds(location)
                .then(data => {
                    this.setState({
                        nearbyPokemon: data,
                        ready: true
                    });
                })
                .catch(err => {
                    this.setState({
                        error: true
                    });
                    console.log("Error fetching pokemon", err);
                });
        });
    }

    handlePokeCardClick(id) {
        this.setState({
            activePokemonId: id
        });
    }

    handleMarkerClick(id) {
        this.setState({
            activePokemonId: id
        });
    }

    handleMapError(errorState) {
        this.setState({
            mapError: errorState
        });
    }

    handleAppRefresh() {
        document.location.reload();
    }

    handleReportSightingToggle() {
        this.setState({
            showReportSighting: !this.state.showReportSighting
        });
    }

    handleLocationDetermination(location) {
        this.setState({
            currentLocation: location
        });
    }

    render() {
        return (
            <div className="app-content-container">
                {
                    (this.state.showReportSighting) ?
                        <ReportSighting
                            onToggleReportSighting={this.handleReportSightingToggle}
                            location={this.state.currentLocation}
                            pokemonList={this.state.pokemonList}
                            googleMaps={window.google.maps}/> : null
                }
                {
                    (this.state.error) ?
                    <div style={{height: "100%"}}>
                        <div style={{padding: 20, textAlign: "center"}}>
                            <p><i className="fa fa-exclamation-circle" style={{fontSize: 60}}></i></p>
                            <p>Sorry! Looks like there was an error trying to find local sightings.</p>
                            <p>You can try to refresh PokeDar below.</p>
                            <button
                                className="pd-button"
                                onClick={this.handleAppRefresh}
                                style={{fontSize: 15}}><i className="fa fa-refresh" style={{paddingRight: 5}}></i> Refresh</button>
                        </div>
                    </div> :
                    <div style={{height: "100%"}}>
                        <div style={{height: "100%"}}>
                            <PokeMap
                                onLocationChange={this.updateLocation}
                                nearbyPokemon={this.state.nearbyPokemon}
                                googleMaps={window.google.maps}
                                activePokemonId={this.state.activePokemonId}
                                onMarkerClick={this.handleMarkerClick}
                                isExploreReady={this.state.ready}
                                onMapError={this.handleMapError}
                                onLocationDetermination={this.handleLocationDetermination}
                                onToggleReportSighting={this.handleReportSightingToggle}/>
                            <NearbySightings
                                nearbyPokemon={this.state.nearbyPokemon}
                                onPokeCardClick={this.handlePokeCardClick}
                                activePokemonId={this.state.activePokemonId}
                                isExploreReady={this.state.ready}
                                mapError={this.state.mapError}/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
