var express = require("express");
var chalk = require("chalk");

var WebpackIsomorphicTools = require("webpack-isomorphic-tools");
var projectBasePath = process.cwd();

var isProduction = process.env.NODE_ENV === "production";

var PORT = isProduction ? 8888 : 8880;

module.exports = function () {
    global.webpackIsomorphicTools = new WebpackIsomorphicTools(require("../../webpack-isomorphic-tools-configuration"))
        .development(process.NODE_ENV !== "production")
        .server(process.cwd(), function () {
            var app = express();
            var serverRequestHandler = require("../lib/server-request-handler");

            if (isProduction) {
                app.use("/assets", express.static("build"));
                console.log(chalk.green("Server side rendering server running at http://localhost:" + PORT));

            }
            else {
                console.log("Server side rendering proxy running at http://localhost:" + PORT);
            }

            app.use(serverRequestHandler);
            app.listen(PORT);
        });
};

