
module.exports = function(config) {

    config.addPassthroughCopy("site/style");

    config.setInputDirectory("site");
    config.setIncludesDirectory("include");
    config.setLayoutsDirectory("layouts");
    config.setDataDirectory("data");
    config.setOutputDirectory("public");
};

