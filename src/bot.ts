import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import cron from "node-cron";
import { readFile, writeFile } from "fs/promises";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!; // seu próprio chat ID ou grupo

if (!TOKEN || !CHAT_ID) {
  throw new Error("Token do Telegram ou Chat ID não encontrados no .env");
}

const bot = new TelegramBot(TOKEN, { polling: false });
console.log("📦 Bot de rastreio rodando...");

const HISTORY_FILE = "rastreamento_status.json";

const rastreioInfo = [
  {
    cpf: "44178732838",
    empresa: "BWT",
    notaFiscal: "276848",
  },
];

type StatusHistory = {
  [key: string]: string; // chave no formato `${cpf}_${notaFiscal}`
};

async function getUltimoStatus(): Promise<string> {
  try {
    const data = await readFile(HISTORY_FILE, "utf8");
    const json = JSON.parse(data);
    return json.status || "";
  } catch {
    return "";
  }
}

async function carregarHistorico(): Promise<StatusHistory> {
  try {
    const data = await readFile(HISTORY_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function salvarHistorico(historico: StatusHistory) {
  await writeFile(HISTORY_FILE, JSON.stringify(historico, null, 2));
}

function gerarChave({ cpf, notaFiscal }: { cpf: string; notaFiscal: string }) {
  return `${cpf}_${notaFiscal}`;
}

// async function salvarStatusAtual(status: string) {
//   await writeFile(HISTORY_FILE, JSON.stringify({ status }, null, 2));
// }

async function buscarRastreio() {
  const historico = await carregarHistorico();

  for (const rastreio of rastreioInfo) {
    const chave = gerarChave(rastreio);

    try {
      const response = await axios.post(
        "https://atlas.hyerdev.com.br/api/rastreamento/cpf/v2/destinatario",
        rastreio,
        {
          headers: {
            "Content-Type": "application/json",
            Origin: "https://cliente.brasilweb.log.br",
            Referer: "https://cliente.brasilweb.log.br/",
          },
        },
      );

      const statusAtual =
        response.data?.ocorrenciaMaisRecente.ocorrencia.titulo ||
        "Status não encontrado";
      const ultimoStatus = historico[chave];
      const remetente = response.data?.remetente;
      const titulo = response.data?.ocorrenciaMaisRecente.ocorrencia.titulo;
      const descricao =
        response.data?.ocorrenciaMaisRecente.ocorrencia.descricao;
      const hora = response.data?.ocorrenciaMaisRecente.ocorrencia.hora;
      const data = response.data?.ocorrenciaMaisRecente.ocorrencia.data;

      if (statusAtual !== ultimoStatus) {
        const mensagem = `📦 *Atualização de entrega*:
        \n
        *Remetente*: ${remetente}
        *Data e hora*: ${data} - ${hora}
        *Título Rastreio*: ${titulo}
        *Descrição*: ${descricao}
        *Status Atual*: ${statusAtual}
        `;
        await bot.sendMessage(CHAT_ID, mensagem, { parse_mode: "Markdown" });

        historico[chave] = statusAtual;
        console.log("🔔 Status atualizado e enviado.");
      } else {
        console.log("✅ Sem mudanças no rastreio.");
      }
    } catch (error) {
      console.error("❌ Erro ao buscar rastreio:", error);
    }
  }

  await salvarHistorico(historico);
}

cron.schedule("*/1 * * * *", () => {
  console.log("🔍 Verificando atualizações de rastreio...");
  buscarRastreio();
});
