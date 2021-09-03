const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = 'token';

const bot = new TelegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Right now I will guess the number from 0 to 9');
  const number = Math.floor(Math.random() * 10);
  chats[chatId] = number;

  await bot.sendMessage(chatId, 'Guess!', gameOptions);
};

const start = () => {
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    await bot.setMyCommands([
      { command: '/start', description: 'Init bot' },
      { command: '/info', description: 'Show info about user' },
      { command: '/game', description: 'lets play a game' },
    ]);

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.eu/_/stickers/734/c29/734c2933-892b-340b-980f-9d94305e9d95/2.jpg',
      );
      return bot.sendMessage(chatId, `Welcome to this chat bot`);
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'I don`t understand you:(');
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (+data === chats[chatId]) {
      return bot.sendMessage(chatId, `You won! Guess number was ${chats[chatId]}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `You lose:( Guess number was ${chats[chatId]}`, againOptions);
    }
  });
};
start();
