console.log(`
    ██╗    ██╗██╗ ██████╗██╗  ██╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ 
    ██║    ██║██║██╔════╝██║ ██╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
    ██║ █╗ ██║██║██║     █████╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
    ██║███╗██║██║██║     ██╔═██╗     ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
    ╚███╔███╔╝██║╚██████╗██║  ██╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
     ╚══╝╚══╝ ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 
`);

const { Routes, REST } = require('discord.js');
const { CustomClient } = require('./src/utils/index');
const fs = require('fs');
const path = require('path');

const client = new CustomClient();
client.tickets = new Map();

// تحميل الأوامر
const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.name, command);
  if (command.data) commands.push(command.data);
}

// تحميل التفاعلات
const interactionsFiles = fs.readdirSync('./src/interactions').filter(file => file.endsWith('.js'));
for (const file of interactionsFiles) {
  const interaction = require(`./src/interactions/${file}`);
  client.interactions.set(interaction.name, interaction);
}

// تحميل الأحداث
const eventsFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventsFiles) {
  const event = require(`./src/events/${file}`);
  client.on(event.name, (...args) => event.execute(client, ...args));
}

// تحميل اللغات
const localesPath = path.resolve(__dirname, './src/locale');
const localeFiles = fs.readdirSync(localesPath).filter(file => file.endsWith('.json'));
for (const file of localeFiles) {
  const locale = require(path.join(localesPath, file));
  const localeName = path.basename(file, '.json');
  client.locale.set(localeName, locale);
}

// تسجيل أوامر السلاش
const rest = new REST({ version: '10' }).setToken(client.config.TOKEN);

client.once('ready', async () => {
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log(`✅ Bot is online! ${client.user.username}`);
    console.log('🔧 Code by Wick Studio');
    console.log('💬 discord.gg/wicks');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }

  // ✅ ارسال بانلات التذاكر إلى روماتها (احذف أو علّق هذا السطر بعد أول مرة)
  // prequire('./deploy-panels')(client);

  // ✅ تشغيل لوحة التحكم
  require('./src/dashboard/dashboard')(client);
});

// أمر !close داخل قنوات التذاكر فقط
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const prefix = '!';
  if (message.content.trim() === `${prefix}close`) {
    console.log(`📥 Received !close in ${message.channel.name}`);

    const closeCommandPath = path.resolve(__dirname, './src/commands/closeCommand.js');
    if (fs.existsSync(closeCommandPath)) {
      const closeCommand = require(closeCommandPath);
      if (typeof closeCommand.execute === 'function') {
        try {
          await closeCommand.execute(client, message);
        } catch (err) {
          console.error('❌ Error while executing close command:', err);
        }
      } else {
        console.warn('⚠️ ملف closeCommand.js موجود لكن لا يحتوي على دالة execute!');
      }
    } else {
      console.warn('⚠️ ملف closeCommand.js غير موجود!');
    }
  }
});

// الحماية من الكراش
process.on('unhandledRejection', (reason, p) => {
  console.log(' [antiCrash] :: Unhandled Rejection/Catch');
  console.log(reason, p);
});
process.on('uncaughtException', (err, origin) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch');
  console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(' [antiCrash] :: Uncaught Exception Monitor');
  console.log(err, origin);
});

// تسجيل الدخول
client.login(client.config.TOKEN);
