`kick-api-wrappepr` allows you to access Kick's currently private API.

- Headless browser to avoid Cloudflare block
- Built-in caching to avoid unnecessary requests
- Simplistic codebase - simple to addon to

```
npm install kick-api-wrapper
```

```js
const Client = require('kick-api-wrapper');

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
```

Feel free to open an issue / pull request to add an endpoint.
