import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, hashHistory, IndexRoute} from "react-router";

import App from "./components/App";
import Explore from "./components/Explore";
import ReportSighting from "./components/ReportSighting";

window.google.maps.event.addDomListener(window, "load", () => {
    ReactDOM.render(
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Explore} />
                <Route path="/report" component={ReportSighting} />
            </Route>
        </Router>,
        document.getElementById("app"));
});
