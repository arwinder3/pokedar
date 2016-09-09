import React from "react";

export default (props) => (
    <img className="poke-card-img" style={{width: props.width, height: props.height}} src={`http://localhost:2998/${props.id}.png`}></img>
);
