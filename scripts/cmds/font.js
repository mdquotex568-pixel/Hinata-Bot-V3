const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmud-aura/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "font",
                aliases: ["style"],
                version: "2.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        en: "Convert your text into various stylish fonts",
                        vi: "Chuyển đổi văn bản của bạn thành nhiều phông chữ phong cách khác nhau"
                },
                category: "general",
                guide: {
                        en: '   {pn} <number> <text>: Get stylish text'
                                + '\n   {pn} list <page>: See all font styles',
                        vi: '   {pn} <số> <văn bản>: Nhận văn bản phong cách'
                                + '\n   {pn} list <page>: Xem tất cả danh sách phông chữ'
                }
        },

        langs: {
                en: {
                        noList: "× No font styles found.",
                        invalid: "× Invalid usage! Format: {pn} <number> <text>",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        noList: "× Không tìm thấy kiểu phông chữ nào.",
                        invalid: "× Sử dụng sai! Định dạng: {pn} <số> <văn bản>",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, message, args, event, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                try {
                        if (args[0] === "list") {
                                const page = args[1] && !isNaN(args[1]) ? args[1] : 1;
                                const response = await axios.get(`${await baseApiUrl()}/api/font/list?page=${page}`);
                                const fontList = response.data;
                                return fontList ? message.reply(fontList) : message.reply(getLang("noList"));
                        }

                        const [number, ...textParts] = args;
                        const text = textParts.join(" ");

                        if (!text || isNaN(number)) return message.reply(getLang("invalid"));
                        const response = await axios.get(`${await baseApiUrl()}/api/font?text=${encodeURIComponent(text)}&font=${number}`);
                        const convertedText = response.data.converted;
                        
                        if (!convertedText) return message.reply(getLang("noList"));
                        return message.reply(convertedText);

                } catch (err) {
                        console.error("Font Style Error:", err);
                        return message.reply(getLang("error", err.message));
                }
        }
};
