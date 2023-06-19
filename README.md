`kick-api` allows you to access Kick's currently private API.

- Headless browser to avoid Cloudflare block
- Built-in caching to avoid unnecessary requests
- Simplistic codebase - simple to addon to

```js
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
```

Feel free to open an issue / pull request to add an endpoint.
