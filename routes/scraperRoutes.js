'use strict';

module.exports = function(app) {
    var scraper = require('../controllers/scraperController');

    app.route('/weekend')
        .get(scraper.read_weekend_data);

    app.route('/weekend/:weekendId')
        .get(scraper.read_weekend_data);
    
}