const puppeteer = require('puppeteer');

class Client {
    /**
     * 🔨 Creates a new Kick client
     * @param {object} options
     * @param {object} options.cache
     * @param {boolean} options.cache.enabled
     * @param {number} options.cache.ttl
     */
    constructor(options = {}) {
        if (options.cache) {
            if (options.cache?.enabled && options.cache?.ttl) {
                if (typeof options.cache.enabled !== 'boolean') throw new Error('cache.enabled: expected boolean, received ' + typeof options.cache.enabled);
                if (typeof options.cache.ttl !== 'number') throw new Error('cache.ttl: expected number, received ' + typeof options.cache.ttl);

                this.cache = new Map();
            } else throw new Error('cache: expected object with properties "enabled" and "ttl"');
        }

        this.options = options;
    }
    /**
     * ✅ Fetches data with a headless browser (puppeteer)
     * @param {string} url
     * @param {boolean} force
     */
    async fetch(url, force = false) {
        if (this.options?.cache && !force) {
            const data = this.cache.get(url);

            if (!data) return this.fetch(url, true);

            if (data.expires <= Date.now()) {
                this.cache.delete(url);
                return this.fetch(url, true);
            }

            return Promise.resolve(data.data);
        }

        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(url);
        
        const data = await page.content();
        
        browser.close();
    
        try {
            const parsedData = JSON.parse(data.replace(/<\/?[^>]+>/gi, ''));

            if (this.options?.cache) {
                this.cache.set(url, {
                    data: parsedData,
                    expires: Date.now() + this.options.cache.ttl
                });
            }

            return parsedData;
        } catch (error) {
            return null;
        }
    }
    /**
     * 🪓 Returns data on a Kick channel
     * @param {string} channel
     */
    getChannel(channel) {
        return this.fetch(`https://kick.com/api/v1/channels/${channel}`);
    }
    /**
     * 🔍 Returns channels and categories which match the searched word
     * @param {string} searched_word
     */
    search(searched_word) {
        return this.fetch(`https://kick.com/api/search?searched_word=${searched_word}`);
    }
    /**
     * 🔍 Returns channels live streaming based on parameters
     * @param {string} subcategory
     * @param {string} category
     * @param {number} page
     * @param {number} limit
     * @param {string} sort
     */
    getLivestreams({ language = 'en', sort = 'desc', page = 1, limit = 25, subcategory = '', category = '' }) {
        return this.fetch(`https://kick.com/stream/livestreams/${language}?page=${page}&limit=${limit}&subcategory=${subcategory}&category=${category}&sort=${sort}`);
    }
    /**
     * 🪓 Returns clips based on parameters
     * @param {number} cursor
     * @param {string} sort
     * @param {string} time
     */
    getClips({ cursor = 0, sort = 'view', time = 'all' }) {
        return this.fetch(`https://kick.com/api/v2/clips?cursor=${cursor}&sort=${sort}&time=${time}`);
    }
    /**
     * 🪓 Returns all main categories on Kick
     */
    getCategories() {
        return this.fetch('https://kick.com/api/v1/categories');
    }
    /**
     * 🪓 Returns data on Kick subcategories
     * @param {number} page 
     * @param {number} limit 
     */
    getSubcategories({ page = 1, limit = 25 }) {
        return this.fetch(`https://kick.com/api/v1/subcategories?page=${page}&limit=${limit}`);
    }
}

module.exports = Client;