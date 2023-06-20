const Client = require('./index.js');

const client = new Client({
    cache: {
        enabled: true,
        ttl: 60000
    }
});

client.getChannel('adinross').then(channel => {
    console.log(channel.user_id);
    // Returns: 904404
});