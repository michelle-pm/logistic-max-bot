const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Ваш токен бота MAX
const BOT_TOKEN = 'f9LHodD0cOJ9YrHNnsgB36usCpe7UGQrvfwYIS66FJhrIv6M9EBDI3FttlaHsBjl0cZT_zH6n1DDIhvUx90m';

// Функция отправки сообщения пользователю
async function sendMessage(userId, text) {
  await axios.post('https://api.max.ru/bot/messages.send', {
    token: BOT_TOKEN,
    user_id: userId,
    text: text
  });
}

// Webhook для входящих сообщений
app.post('/webhook', async (req, res) => {
  const event = req.body;

  if (event.type === 'message_new') {
    const userId = event.user_id;
    const messageText = event.text;

    // Приветствие при первом сообщении
    if (event.is_first) {
      await sendMessage(userId, 'Добро пожаловать в чат компании ЛОГИСТИК!\nВ ближайшее время с Вами свяжется менеджер!');
    }

    // Пример: автоматический эхо ответ (можно удалить)
    // await sendMessage(userId, `Вы написали: ${messageText}`);
  }

  res.sendStatus(200);
});

// Роут для отправки ответов пользователю через бота
app.post('/send', async (req, res) => {
  const { userId, text } = req.body;

  await sendMessage(userId, text);
  res.send({ status: 'ok' });
});

app.listen(3000, () => console.log('Bot running on port 3000'));
