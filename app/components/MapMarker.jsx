import React from "react";

export default class MapMarker extends React.Component {
    constructor(props) {
        super(props);

        this.marker = null;
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        if (this.marker) {
            this.marker.setMap(null);
        }
    }
}

MapMarker.propTypes = {
    map: React.PropTypes.object,
    googleMaps: React.PropTypes.object
};
