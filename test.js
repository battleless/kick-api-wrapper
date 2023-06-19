const Client = require('./client.js');

const client = new Client({
    options: {
        cache: {
            enabled: true,
            ttl: 60000
        }
    }
});

client.getChannel('adinross').then(channel => {
    console.log(channel.slug);
    // Returns: 904404
});