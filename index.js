const puppeteer = require('puppeteer');

class Client {
    constructor(options) {
        if (options.cache?.enabled || options.cache?.ttl) {
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
        if (!options.cache?.enabled && !options.cache?.ttl) return this.fetch(url);

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
     * 🔍 Returns channels and categories which match the searched word
     * @param {string} searched_word
     */
    search(searched_word) {
        return this.validiateCache(`https://kick.com/api/search?searched_word=${searched_word}`);
    }
    /**
     * 🔍 Returns channels live streaming based on parameters
     * @param {string} subcategory
     * @param {number} page
     * @param {number} limit
     * @param {string} sort
     */
    getLivestreams(language = 'en', sort = 'desc', page = 1, limit = 25, subcategory = false) {
        return this.validiateCache(`https://kick.com/stream/livestreams/${language}?page=${page}&limit=${limit}&subcategory=${subcategory}&sort=${sort}`);
    }
    /**
     * 🪓 Returns clips based on parameters
     * @param {number} cursor
     * @param {string} sort
     * @param {string} time
     */
    getClips(cursor = 0, sort = 'view', time = 'all') {
        return this.validiateCache(`https://kick.com/api/v2/clips?cursor=${cursor}&sort=${sort}&time=${time}`);
    }
    /**
     * 🪓 Returns all main categories on Kick
     */
    getCategories() {
        return this.validiateCache('https://kick.com/api/v1/categories');
    }
    /**
     * 🪓 Returns data on Kick subcategories
     * @param {number} page 
     * @param {number} limit 
     */
    getSubcategories(page = 1, limit = 25) {
        return this.validiateCache(`https://kick.com/api/v1/subcategories?page=${page}&limit=${limit}`);
    }
}

module.exports = Client;
