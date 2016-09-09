import React from "react";

/* Components */
import SiteHeader from "./SiteHeader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app-container">
                <SiteHeader />
                <div className="app-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
