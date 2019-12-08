'use strict';

const rp = require('request-promise');
const $ = require('cheerio');
const base_url = "https://www.the-numbers.com/";

exports.read_weekend_data = function(req, res) {
    var url;

    if (req.params.weekendId) {
        var idConvert = (req.params.weekendId);
        idConvert = idConvert.replace("-", "/");
        idConvert = idConvert.replace("-", "/");
        url = base_url + "box-office-chart/weekend/" + idConvert;
    } else {
        url = base_url + "weekend-box-office-chart";
    }

    rp(url)
        .then(async function(html) {
            //Success

            var movies = [];
            var row;
            
            for (let i = 0; i < 10; i++) {

                row = $('#box_office_table > tbody > tr', html)[i];
                var rowItems = $(row).find('td');

                var urlMoviePage = "https://www.the-numbers.com" + $('b > a', rowItems[2])[0].attribs.href;
                let moviePageData = await read_movie_page(urlMoviePage);

                const movie = {
                    rank: $(rowItems[0]).text().trim(),
                    rankLW: $(rowItems[1]).text().trim(),
                    name: $(rowItems[2]).text().trim(),
                    weekendGross: $(rowItems[4]).text().trim(),
                    totalGross: $(rowItems[9]).text().trim(),
                    percentChange: $(rowItems[5]).text().trim(),
                    year: moviePageData.year,
                    imageURL: moviePageData.imageURL
                }
    
                movies.push(movie);

            }

            res.json(movies);
            
        })
        .then (function(err) {
            //Fail 
            res.send(err);
        });

}

async function read_movie_page(urlMoviePage) {
    var movie_data;

    movie_data = {
        year: "",
        imageURL: ""
    };

    let r = await rp(urlMoviePage)
        .then (function(html) {

            var movie_title_text = $('#main > div > h1', html).text();
            var index = movie_title_text.lastIndexOf("(");
            var movie_year = movie_title_text.substring(index + 1, index + 5);
            
            var movie_image = $('#col1 > div > div > img', html)[0].attribs.src;

            movie_data = {
                year: movie_year,
                imageURL: movie_image
            };

        })
        .then (function(err) {

        });

    return movie_data;
    
}
