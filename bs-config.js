module.exports = {
    proxy: "http://localhost:3001", // Должен быть React-сервер
    host: "192.168.0.2",
    port: 3002,
    ui: false, // Отключаем панель управления (чтобы не путала)
    files: ["src/**/*.{js,jsx,css,html}"],
    notify: false,
    ghostMode: {
        clicks: true,
        scroll: true,
        forms: true,
    },
};
