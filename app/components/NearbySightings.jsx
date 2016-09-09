import React from "react";

import PokeCard from "./PokeCard";
import LoadingOverlay from "./LoadingOverlay";

export default class NearbySightings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeCardId: null
        };

        this.setActiveCardId = this.setActiveCardId.bind(this);
    }

    setActiveCardId(id) {
        this.setState({
            activeCardId: id
        });
    }

    getUniqueSightings() {
        return this.props.nearbyPokemon.reduce((uniqueSightings, sighting) => {
            let add = true;
            for (let i = 0; i < uniqueSightings.length; i++) {
                if (uniqueSightings[i].pokemonId === sighting.pokemonId) {
                    add = false;
                    break;
                }
            }
            if (add) {
                uniqueSightings.push(sighting);
            }
            return uniqueSightings;
        }, []);
    }

    render() {
        if (this.props.mapError) {
            return this.renderMapError();
        } else if (!this.props.isExploreReady) {
            return this.renderSightingsLoading();
        } else {
            return this.renderSightings();
        }
    }

    renderMapError() {
        return (
            <div className="nearby-poke-wrapper" style={{backgroundColor: "white"}}></div>
        );
    }

    renderSightingsLoading() {
        return (
            <div className="nearby-poke-wrapper">
                <LoadingOverlay showSpinner={false} />
            </div>
        );
    }

    renderSightings() {
        const sightings = this.getUniqueSightings(this.props.nearbyPokemon);

        return (
            <div className="nearby-poke-wrapper">
                {
                    (sightings.length > 0) ?
                    <div style={{height: "100%"}}>
                        <div className="row-start-center" style={{height: "15%"}}>
                            Nearby Sightings
                        </div>
                        <div className="nearby-poke-row">
                            {
                                sightings.map(sighting => (
                                    <PokeCard
                                        key={sighting.id}
                                        activePokemonId={this.props.activePokemonId}
                                        onPokeCardClick={this.props.onPokeCardClick}
                                        {...sighting} />
                                ))
                            }
                        </div>
                    </div>
                    :
                    <div className="column-start-center" style={{height: "100%", textAlign: "center"}}>
                        <p style={{paddingBottom: 0, marginBottom: 0}}><i className="fa fa-eye-slash" style={{fontSize: 60}}></i></p>
                        <p>No nearby sightings.</p>
                        <p>Let us know if you see any!</p>
                    </div>
                }
            </div>
        );
    }


}

NearbySightings.propTypes = {
    nearbyPokemon: React.PropTypes.array.isRequired,
    onPokeCardClick: React.PropTypes.func.isRequired,
    activePokemonId: React.PropTypes.number,
    isExploreReady: React.PropTypes.bool,
    mapError: React.PropTypes.bool
};
