const Client = require('./client.js');

const client = new Client({
    options: {
        cache: {
            enabled: true,
            ttl: 60000
        }
    }
});

client.livestreams(undefined, undefined, 'slots', 1, 10).then(livestreams => {
    console.log(livestreams);
});