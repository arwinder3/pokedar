import React from "react";

export default class LoadingOverlay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.showSpinner === true) {
            return this.renderSpinner();
        } else {
            return this.renderNonSpinner();
        }
    }

    renderSpinner() {
        return (
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                zIndex: 100,
                backgroundColor: "rgba(0,0,255,0.3)"
            }}>
                Loading Spinner
            </div>
        );
    }

    renderNonSpinner() {
        return (
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: 100,
                    backgroundColor: "rgba(0,0,255,0.3)"
                }}>
            </div>
        );
    }
}

LoadingOverlay.propTypes = {
    showSpinner: React.PropTypes.bool
};
