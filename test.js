const Client = require('./client.js');

const client = new Client({
    options: {
        cache: {
            enabled: true,
            ttl: 60000
        }
    }
});

client.search('fortnite').then(results => {
    console.log(results.categories[0].name);
});

client.getSubcategories().then(subcategories => {
    console.log(subcategories);
});