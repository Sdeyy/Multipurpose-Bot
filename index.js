const { MessageEmbed, WebhookClient, Client, Collection, Discord } = require('discord.js');
const client = new Client({
    intents: 32767,
});

module.exports = (client)

let { readdirSync } = require('fs');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const yaml = require('js-yaml');
const fs = require('fs');
const axios  = require('axios');
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2));

client.commands = new Collection();
client.slashCommands = new Collection();
client.config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2));
client.messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2));
client.embeds = yaml.load(fs.readFileSync('settings/embeds.yml', 'utf8', 2));
client.buttons = yaml.load(fs.readFileSync('settings/buttons.yml', 'utf8', 2));

require("./handler")(client);
require('events').EventEmitter.defaultMaxListeners = 0;

process.on('unhandledRejection', error => {
  console.error(error);
  if(!config.ERROR_LOGGING.ENABLED) return;
  const errorlogs = new WebhookClient({ url: config.ERROR_LOGGING.WEBHOOK_URL })
  errorlogs.send(`\`\`\`js\n${error.stack}\`\`\``)
});
client.on('shardError', error => {
  console.error(error);
  if(!config.ERROR_LOGGING.ENABLED) return;
  const errorlogs = new WebhookClient({ url: config.ERROR_LOGGING.WEBHOOK_URL })
  errorlogs.send(`\`\`\`js\n${error.stack}\`\`\``)
});


client.distube = new DisTube(client, {
          leaveOnFinish: true,
          plugins: [
            new SpotifyPlugin({
              emitEventsAfterFetching: true
            }),
            new SoundCloudPlugin(),
            new YtDlpPlugin()
          ],
          youtubeDL: false
        })
      
      for(const file of readdirSync('./distube/')){
        if(file.endsWith('.js')){
          let fileName = file.substring(0, file.length - 3)
          let fileContents = require(`./distube/${file}`)
          client.distube.on(fileName, fileContents.bind(null, client))
        }
      }
client.login(config.TOKEN);
