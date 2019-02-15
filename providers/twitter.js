const Twitter = require('twitter');
const config = require('../config.js');
const T = new Twitter(config);

class TwitterProvider {
    async post(message) {
        return T.post('statuses/update', { status: message });
    }

    stream(id) {
        return T.stream('statuses/filter', { follow: id });
    }
}

module.exports = TwitterProvider;