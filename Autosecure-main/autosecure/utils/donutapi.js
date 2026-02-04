const axios = require('axios');

async function getDonutStats(username) {
    if (!username) {
        console.log('[DONUT API] No username provided');
        return null;
    }
    console.log(`[DONUT API] getDonutStats called for: "${username}"`);
    
    try {
        // Try scraping from donutstats.net
        const url = `https://www.donutstats.net/player/${encodeURIComponent(username)}`;
        console.log(`[DONUT API] Fetching from: ${url}`);
        
        const response = await axios.get(url, { 
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000 
        });
        
        if (!response.data) {
            console.log(`[DONUT API] No data returned for: "${username}"`);
            return null;
        }

        // Parse stats from HTML
        const html = response.data;
        const stats = {};

        // Extract stats using regex patterns
        const patterns = {
            money: /(?:Money|Balance)[:\s]*\$?([\d,.]+)/i,
            shards: /(?:Shards|Essence)[:\s]*([\d,.]+)/i,
            playerKills: /(?:Player\s+Kills|Kills|K\/D)[:\s]*([\d,.]+)/i,
            deaths: /(?:Deaths|D)[:\s]*([\d,.]+)/i,
            playtimeSeconds: /(?:Playtime|Play\s+Time)[:\s]*([0-9]+[dhms\s]+)+/i,
            blocksPlaced: /(?:Blocks\s+Placed)[:\s]*([\d,.]+)/i,
            blocksBroken: /(?:Blocks\s+Broken)[:\s]*([\d,.]+)/i,
            mobsKilled: /(?:Mobs\s+Killed)[:\s]*([\d,.]+)/i,
            moneySpent: /(?:Money\s+Spent)[:\s]*\$?([\d,.]+)/i,
            moneyMade: /(?:Money\s+Made|Earned)[:\s]*\$?([\d,.]+)/i,
        };

        for (const [key, pattern] of Object.entries(patterns)) {
            const match = html.match(pattern);
            if (match && match[1]) {
                let value = match[1].replace(/[,$\s]/g, '');
                stats[key] = isNaN(value) ? 0 : parseInt(value, 10);
            } else {
                stats[key] = 0;
            }
        }

        console.log(`[DONUT API] Parsed stats for: ${username}:`, JSON.stringify(stats).substring(0, 200));
        
        return stats && Object.keys(stats).length > 0 ? stats : null;
    } catch (e) {
        console.log(`[DONUT API] Error fetching/parsing for "${username}":`, e.message);
        return null;
    }
}

module.exports = getDonutStats;
