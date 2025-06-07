import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

export const sendTelegramMessage = async (username: string, message: string) => {
  try {
    await bot.sendMessage(`@${username}`, message);
    return true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};