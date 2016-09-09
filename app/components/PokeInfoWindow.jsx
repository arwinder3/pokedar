import React from "react";

import PokeImg from "./PokeImg";

export default class PokeInfoWindow extends React.Component {
    constructor(props) {
        super(props);

        this.handleDirectionsClick = this.handleDirectionsClick.bind(this);
    }

    handleDirectionsClick() {
        window.open(`https://www.google.com/maps/dir/Current+Location/${this.props.lat},${this.props.lng}`);
    }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>

                <PokeImg id={this.props.pokemonId} width="56px" height="56px" />

                <p style={{padding: "0 0 10px 0", margin: 0, fontSize: "1.1em"}}>{this.props.name}</p>
                <p style={{padding: "0 0 10px 0", margin: 0}}>Sightings: {this.props.clusteredSightings.length + 1}</p>

                <button
                    className="pd-button"
                    style={{fontSize: "1em"}}
                    onClick={this.handleDirectionsClick}>
                    Directions
                </button>

            </div>
        );
    }

}
