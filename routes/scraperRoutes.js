'use strict';

module.exports = function(app) {
    var scraper = require('../controllers/scraperController');

    app.route('/weekend')
        .get(scraper.read_weekend_data);
    
}