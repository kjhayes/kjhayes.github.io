
const datefns = require("date-fns");
const EleventyTeX = require("@vrugtehagel/eleventy-tex").default;

module.exports = async function(config)
{
    config.addPlugin(EleventyTeX, {
        extension: "tex",
    });

    config.addPassthroughCopy("site/style");

    config.addGlobalData("site", {
        url: "https://kjhayes.github.io"
    });

    config.addFilter('date', function (date, fmt) {
        return datefns.format(date, fmt)
    })
    config.addFilter('pretty-date', function (date) {
        return datefns.format(date, "yyyy/MM/dd")
    })
    config.addFilter("limit", function (arr, limit) {
        console.log(`limit called with: arr=${arr} and limit=${limit}`)
        if(limit >= 0){
            return arr.slice(0,limit);
        } else {
            return arr;
        }
    });


    config.addDataExtension("txt", {
        parser: (content, path) => {
            return {
                content: content,
                path: path,
            };
        },
        read: true,
        encoding: "utf-8",
    });

    return {
        dir: {
            input: "site",
            output: "public",
            includes: "templates",
            layouts: "templates",
            data: "data",
        },
    };
};

