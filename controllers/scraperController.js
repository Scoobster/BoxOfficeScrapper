'use strict';

const rp = require('request-promise');
const $ = require('cheerio');
const url = "https://www.the-numbers.com/weekend-box-office-chart";

exports.read_weekend_data = function(req, res) {
    var data;

    rp(url)
        .then(function(html) {
            //Success

            var movies = [];
            var row;
            
            for (let i = 0; i < 10; i++) {
                row = $('#box_office_table > tbody > tr', html)[i];
                var rowItems = $(row).find('td');

                const movie = {
                    rank: $(rowItems[0]).text().trim(),
                    name: $(rowItems[2]).text().trim(),
                    weekendGross: $(rowItems[4]).text().trim(),
                    totalGross: $(rowItems[9]).text().trim(),
                    percentChange: $(rowItems[5]).text().trim()
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