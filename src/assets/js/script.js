if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}

// Foundation.
//import "../../../node_modules/foundation-sites/dist/css/foundation.min.css";
//import "../../../node_modules/foundation-sites/scss/foundation.scss";

// Styles.
import "../scss/styles.scss";
// Scripts.
import "../js/highlight.pack.js";
// HTML
//require("html-loader?interpolate!../../index.html");
require.context("../", true, /\.html$/);

console.log("hello, world");
