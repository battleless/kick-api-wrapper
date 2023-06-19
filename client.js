const puppeteer = require('puppeteer');

class Client {
    constructor({ options }) {
        if (options.cache.enabled || options.cache.ttl) {
            this.cache = new Map();
        }

        this.options = options;
    }
    /**
     * ✅ Fetches data with a headless browser (puppeteer)
     * @param {string} url
     */
    async fetch(url) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(url);
        
        const data = await page.content();
        
        browser.close();
    
        try {
            const parsedData = JSON.parse(data.replace(/<\/?[^>]+>/gi, ''));

            this.cache.set(url, {
                data: parsedData,
                expires: Date.now() + this.options.cache.ttl
            });

            return parsedData;
        } catch {
            return null;
        }
    }
    /**
     * ✅ Checks the cache for data before fetching it
     * @param {string} url
     */
    validiateCache(url) {
        if (!this.options.cache) return this.fetch(url);

        const data = this.cache.get(url);

        if (!data) return this.fetch(url);

        if (data.expires <= Date.now()) {
            this.cache.delete(url);
            return this.fetch(url);
        }

        return Promise.resolve(data.data);
    }
    /**
     * 🪓 Returns data on a Kick channel
     * @param {string} channel
     */
    getChannel(channel) {
        return this.validiateCache(`https://kick.com/api/v1/channels/${channel}`);
    }
    /**
     * 🪓 Returns all main categories on Kick
     */
    getCategories() {
        return this.validiateCache('https://kick.com/api/v1/categories');
    }
    /**
     * 🪓 Returns data on Kick subcategories | Default: page = 1, limit = 25
     * @param {number} page 
     * @param {number} limit 
     */
    getSubcategories(page = 1, limit = 25) {
        return this.validiateCache(`https://kick.com/api/v1/subcategories?page=${page}&limit=${limit}`);
    }
    /**
     * 🔍 Returns channels and categories which match the searched word
     * @param {string} searched_word
     */
    search(searched_word) {
        return this.validiateCache(`https://kick.com/api/search?searched_word=${searched_word}`);
    }
}

module.exports = Client;