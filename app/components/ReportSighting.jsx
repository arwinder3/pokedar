import React from "react";

import {getLocation} from "../utils/LocationService";
import {reportSighting} from "../utils/PokeService";

export default class ReportSighting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            centerMarker: null,
            updatedLocation: null,
            selectedPokemon: null,
            noPokemonSelected: false
        };

        this.handleLocationSearch = this.handleLocationSearch.bind(this);
        this.handlePokemonSelection = this.handlePokemonSelection.bind(this);
        this.handleReportButton = this.handleReportButton.bind(this);
    }

    componentDidMount() {
        if (this.props.location && !this.state.map) {
            this.setState({
                map: new this.props.googleMaps.Map(this.refs.reportSightingMap, {
                    center: {lat: this.props.location.lat, lng: this.props.location.lng},
                    scrollwheel: false,
                    zoom: 14,
                    draggable: false,
                    mapTypeControl: false,
                    streetViewControl: false
                })
            }, () => {
                const location = this.state.updatedLocation || this.props.location;
                this.setState({
                    centerMarker: new this.props.googleMaps.Marker({
                        map: this.state.map,
                        position: location
                    })
                });
            });
        }
    }

    componentDidUpdate() {
        if (this.props.location && !this.state.map) {
            this.setState({
                map: new this.props.googleMaps.Map(this.refs.reportSightingMap, {
                    center: {lat: this.props.location.lat, lng: this.props.location.lng},
                    scrollwheel: false,
                    zoom: 14,
                    draggable: false,
                    mapTypeControl: false,
                    streetViewControl: false
                })
            }, () => {
                const location = this.state.updatedLocation || this.props.location;
                this.setState({
                    centerMarker: new this.props.googleMaps.Marker({
                        map: this.state.map,
                        position: location
                    })
                });
            });
        }
    }

    handleLocationSearch() {
        getLocation(this.refs.locationInput.value)
            .then(locationData => {
                this.state.map.setCenter(locationData);
                this.state.centerMarker.setPosition(locationData);
                this.setState({
                    updatedLocation: locationData
                });
            });
    }

    handlePokemonSelection(e) {
        this.setState({
            selectedPokemon: this.props.pokemonList[e.target.value],
            noPokemonSelected: false
        });
    }

    handleReportButton() {
        this.setState({
            noPokemonSelected: false
        });

        const location = this.state.updatedLocation || this.props.location;
        if (this.state.selectedPokemon) {
            reportSighting({
                pokemonId: this.state.selectedPokemon.id,
                name: this.state.selectedPokemon.identifier,
                lat: location.lat,
                lng: location.lng
            }).then(res => {
                if (res.status === 200) {
                    console.log("sighting reported successfully!");
                }
            });
            // FIXME: Handle posting sighting error
        } else {
            this.setState({
                noPokemonSelected: true
            });
        }
    }

    pokemonSelectClassNames() {
        let classNames = ["pd-input"];

        if (this.state.noPokemonSelected) {
            classNames.push("error");
        }

        return classNames.join(" ");
    }

    render() {
        return (
            <div className="reportsighting-wrapper">
                <div className="reportsighting-container">
                    <span
                        onClick={this.props.onToggleReportSighting}
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10
                        }}><i className="fa fa-times" style={{fontSize: 30}}></i>
                    </span>
                    <p className="dialog-heading">Report Sighting</p>

                    <div className="column-start-center">
                        { /* Location */}
                        <div className="column-start-center" style={{marginBottom: 15}}>
                            <div ref="reportSightingMap" style={{
                                borderRadius: "50%",
                                width: 150,
                                height: 150,
                                marginBottom: 5,
                                WebkitBorderRadius: "50%",
                                MozBorderRadius: "50%",
                                zIndex: 1,
                                boxShadow: "0px 5px 25px -2px #D4D4D4",
                                margin: "0 auto"}}></div>
                            <div className="row-center" style={{justifyContent: "space-around", marginTop: 20}}>
                                <div style={{flexBasis: "80%"}}>
                                    <input
                                        ref="locationInput"
                                        className="pd-input"
                                        style={{width: "100%", fontSize: 13}}
                                        placeholder="Address, Zip Code..."/>
                                </div>
                                <div style={{textAlign: "center"}}>
                                    <button className="pd-button"
                                        style={{
                                            padding: "0 15px",
                                            borderBottom: "1px solid #FAEEC4",
                                            height: 23
                                        }}
                                        onClick={this.handleLocationSearch}><i className="fa fa-search"></i></button>
                                </div>
                            </div>
                        </div>

                        { /* Pokemon */}
                        <div className="column-start-center" style={{marginBottom: 30}}>
                            <div className="column-center-center" style={{
                                height: 100
                            }}>
                            {
                                (this.state.selectedPokemon) ?
                                    <img
                                        height="96"
                                        width="96"
                                        src={`http://localhost:2998/${this.state.selectedPokemon.id}.png`}
                                        style={{
                                            margin: "0 auto"
                                        }}/>
                                    :
                                    <i className="fa fa-question-circle-o" style={{fontSize: 60}}></i>
                            }
                            </div>
                        <select className={this.pokemonSelectClassNames()} onChange={this.handlePokemonSelection}>
                            <option value="0">Select Pokemon</option>
                            {
                                this.props.pokemonList.map((pokemon, index) => (
                                    <option key={index} value={index}>{pokemon.identifier}</option>
                                ))
                            }
                        </select>
                        {(this.state.noPokemonSelected) ? <p className="pd-error-text">No Pokemon selected</p> : null}
                        </div>

                        <button
                            className="pd-button"
                            style={{fontSize: 15}}
                            onClick={this.handleReportButton}>
                            <i className="fa fa-map-pin"></i> Report
                        </button>
                    </div>

                </div>
            </div>
        );
    }
}

ReportSighting.propTypes = {
    onToggleReportSighting: React.PropTypes.func,
    location: React.PropTypes.object,
    googleMaps: React.PropTypes.object,
    pokemonList: React.PropTypes.array
};
