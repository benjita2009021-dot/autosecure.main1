const getDonutStats = require('../../utils/donutapi');
const { EmbedBuilder } = require('discord.js');

let donut = {
    name: 'donut',
    userOnly: true,
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });
            const customId = interaction.customId;
            const parts = customId.split('|');
            const username = parts[1];
            
            if (!username) {
                return await interaction.editReply({ content: 'No username provided.' });
            }

            console.log(`[DONUT] Fetching stats for username: ${username}`);
            const stats = await getDonutStats(username);
            
            if (!stats) {
                console.log(`[DONUT] No stats found for: ${username}`);
                return await interaction.editReply({ content: `No DonutSMP stats found for **${username}**.` });
            }

            console.log(`[DONUT] Stats retrieved for: ${username}`);
            const fields = [];
            fields.push({ name: 'Money', value: `${stats.money || 0}`, inline: true });
            fields.push({ name: 'Shards', value: `${stats.shards || 0}`, inline: true });
            fields.push({ name: 'Player Kills', value: `${stats.playerKills || 0}`, inline: true });
            fields.push({ name: 'Deaths', value: `${stats.deaths || 0}`, inline: true });

            const seconds = stats.playtimeSeconds || 0;
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const playtimeStr = `${days}d ${hours}h ${mins}m`;
            fields.push({ name: 'Playtime', value: playtimeStr, inline: true });

            fields.push({ name: 'Blocks Placed', value: `${stats.blocksPlaced || 0}`, inline: true });
            fields.push({ name: 'Blocks Broken', value: `${stats.blocksBroken || 0}`, inline: true });
            fields.push({ name: 'Mobs Killed', value: `${stats.mobsKilled || 0}`, inline: true });
            fields.push({ name: 'Money Spent', value: `${stats.moneySpent || 0}`, inline: true });
            fields.push({ name: 'Money Made', value: `${stats.moneyMade || 0}`, inline: true });

            const embed = new EmbedBuilder()
                .setTitle(`${username} — DonutSMP Stats`)
                .setColor(0xffc857)
                .addFields(fields)
                .setFooter({ text: 'DonutSMP' });

            if (stats.uuid) {
                embed.setThumbnail(`https://crafatar.com/avatars/${stats.uuid}?size=256&overlay`);
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.error('[DONUT] Error:', e.message, e.stack);
            try { 
                await interaction.editReply({ content: 'Error fetching DonutSMP stats.' }); 
            } catch(_){}
        }
    }
};

module.exports = donut;
