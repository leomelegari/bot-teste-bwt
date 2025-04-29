# 🤖 BWT Tracking Bot

This project is a personal bot built in **TypeScript** to meet a very specific need: continuously tracking my shipments with the logistics company **Brasil Web Transporte (BWT)**.  

The bot sends a request to the BWT endpoint every 60 seconds, checking for any updates in the tracking information. If any movement is detected, it sends a message directly to my private bot on Telegram.

---

## 📦 Why I Built This

I created this bot because I needed a reliable way to monitor my packages with **Brasil Web Transporte**. Instead of manually checking the tracking page, I wanted real-time notifications whenever there was a change in status — such as departure, arrival, or delivery.

This bot automates that process by polling the tracking endpoint every minute and notifying me immediately through Telegram when updates occur.

---

## 📁 Project Structure

- `src/`: Main source code for the tracking and messaging logic.
- `documents/`: Stores any related documents (not required for execution).
- `.env`: Environment variables for API keys and tokens.
- `Dockerfile`: Docker image definition for deployment.
- `docker-compose.yml`: Simplifies container orchestration.
- `package.json`: Project metadata, dependencies, and scripts.
- `tsconfig.json`: TypeScript compiler settings.

---

## 🚀 Technologies Used

- **TypeScript** – For writing clean and typed application logic.
- **Node.js** – JavaScript runtime environment.
- **Docker** – To containerize the application.
- **Docker Compose** – To manage and run the container easily.

---

## ⚙️ How to Use

### 1. Clone the repository

```bash
git clone https://github.com/leomelegari/bot-teste-bwt.git
cd bot-teste-bwt
```
### 2. Set up environment variables
Create a ```.env``` file in the root directory with the following structure:
### Example .env
```
BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_private_chat_id
TRACKING_ENDPOINT=https://your-bwt-endpoint.com/track
```
### 3. Create an array of objects for the package you want to track and put it into ```bot.ts``` file
```
const rastreioInfo = [
    {
        cpf: "your-cpf",
        empresa: "BWT",
        notaFiscal: "your-receipt-number",
    },
    {
        cpf: "your-cpf",
        empresa: "BWT",
        notaFiscal: "your-receipt-number",
    },
]
```

### 3. Run with Docker

```docker-compose up --build```

The bot will start immediately, sending requests every 60 seconds and notifying you if any shipment status changes are detected.