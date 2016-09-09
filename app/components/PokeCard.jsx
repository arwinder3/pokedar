import React from "react";

import PokeImg from "./PokeImg";

export default class PokeCard extends React.Component {

    constructor(props) {
        super(props);

        this.handlePokeCardClick = this.handlePokeCardClick.bind(this);
    }

    handlePokeCardClick() {
        this.props.onPokeCardClick(this.props.pokemonId);
    }

    pokeCardClassNames() {
        let classes = ["poke-card"];

        if (this.props.activePokemonId === this.props.pokemonId) {
            classes.push("active");
        }

        return classes.join(" ");
    }

    scrollTo() {
        if (this.props.activePokemonId === this.props.pokemonId && this.refs.pokeCard) {
            console.log("Scrolling into view");
            this.refs.pokeCard.scrollIntoView();
        }
    }

    render() {
        this.scrollTo();
        return (
            <div
                className={this.pokeCardClassNames()}
                onClick={this.handlePokeCardClick}
                ref="pokeCard">
                <PokeImg id={this.props.pokemonId} width="86px" height="86px" />
                <div className="poke-card-name">{this.props.name}</div>
            </div>
        );
    }
}

PokeCard.propTypes = {
    onPokeCardClick: React.PropTypes.func,
    activePokemonId: React.PropTypes.number
};
