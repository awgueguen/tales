import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
// import { HashRouter as Router} from "react-router-dom"; //test

// import ScrollToTop from "@components/ScrollToTop";
import App from "./App";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Router>
        <App />
        {/* <ScrollToTop /> */}
        {/*revoir pourquoi ça ne fonctionne pas */}
    </Router>);
