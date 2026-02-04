const getDonutStats = require('../../utils/donutapi');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'donut',
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });
            const [action, username] = interaction.customId.split('|');
            if (!username) return interaction.editReply({ content: 'No username provided.' });

            const stats = await getDonutStats(username);
            if (!stats) return interaction.editReply({ content: `No DonutSMP stats found for **${username}**.` });

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

            if (stats.uuid) embed.setThumbnail(`https://crafatar.com/avatars/${stats.uuid}?size=256&overlay`);

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.error('[Donut Button] Error:', e);
            try { await interaction.editReply({ content: 'Error fetching DonutSMP stats.' }); } catch(_){}
        }
    }
};
