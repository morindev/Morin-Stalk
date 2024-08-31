const { Client, Partials, GatewayIntentBits, Events, ActivityType } = require('discord.js');
const client = global.client = new Client({ intents: Object.keys(GatewayIntentBits), partials: Object.keys(Partials) });
let message = false;

const config = {
    token: '', // Botunuzun Tokeni
    manitaID: '', // Sevgilinizin ID'si
    manitaName: '', // Sevgilinizin İsmi 
    ownerID: '', // Sizin ID'niz
    guildID: '', // Sunucunuzun ID'si (Sevgilinizin botla aynı sunucuda olması gerekmektedir.)
    text: '' // Botun, sevgilinizin aktif olduğunda size atacağı mesaj
}

client.on(Events.ClientReady, async () => {
    client.user.setStatus('dnd');
    console.log(client.user.tag)

    setInterval(() => {
        const guild = client.guilds.cache.get(config.guildID);
        const manita = guild.members.cache.get(config.manitaID);
        if (!manita || !manita.presence) return;
        const status = manita.presence.status === 'online' ? 'Aktif' : manita.presence.status === 'idle' ? 'Aktif' : manita.presence.status === 'dnd' ? 'Aktif' : 'Çevrimdışı';
        client.user.setActivity({ name: `${config.manitaName} Şuan ${status}`, type: ActivityType.Playing });
    }, 10000);
});

client.on(Events.PresenceUpdate, async (oldPresence, newPresence) => {
    if (newPresence?.user?.bot) return;
    if (oldPresence?.status === newPresence?.status) return;
    if (newPresence?.member?.id === config.manitaID && oldPresence?.status === 'offline' || undefined && (newPresence?.status === 'online' || newPresence?.status === 'idle' || newPresence?.status === 'dnd')) {
        if (message) return;
        const ertu = oldPresence.guild.members.cache.get(config.ownerID);
        if (ertu) {
            ertu.send({ content: `${config.text}` });
            message = true;
        }
    } else message = false; 
});

client.login(config.token).catch(console.error);

// Made by Ertu (github.com/ertucuk)