// bot.js — бот MAX для компании ЛОГИСТИК
// Использует Environment Variable LOGISTIC_BOT_TOKEN

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Токен берём из Environment Variables
const BOT_TOKEN = process.env.LOGISTIC_BOT_TOKEN;

// Функция отправки сообщения пользователю
async function sendMessage(userId, text) {
  try {
    await axios.post('https://api.max.ru/bot/messages.send', {
      token: BOT_TOKEN,
      user_id: userId,
      text: text
    });
  } catch (err) {
    console.error('Ошибка при отправке сообщения:', err.message);
  }
}

// Webhook для входящих сообщений от MAX
app.post('/webhook', async (req, res) => {
  const event = req.body;

  if (event.type === 'message_new') {
    const userId = event.user_id;
    const messageText = event.text;

    // Приветствие при первом сообщении
    if (event.is_first) {
      await sendMessage(
        userId,
        'Добро пожаловать в чат компании ЛОГИСТИК!\nВ ближайшее время с Вами свяжется менеджер!'
      );
    }

    // Здесь можно добавить автоматическую обработку сообщений
    // Например, эхо:
    // await sendMessage(userId, `Вы написали: ${messageText}`);
  }

  res.sendStatus(200);
});

// Роут для отправки сообщений пользователю через POST
app.post('/send', async (req, res) => {
  const { userId, text } = req.body;

  if (!userId || !text) {
    return res.status(400).send({ status: 'error', message: 'userId и text обязательны' });
  }

  await sendMessage(userId, text);
  res.send({ status: 'ok' });
});

// Запуск сервера на порту 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on port ${PORT}`));
