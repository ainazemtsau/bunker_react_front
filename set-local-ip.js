// save as set-local-ip.js
const os = require('os');
const fs = require('fs');
const path = require('path');

// Получаем список сетевых интерфейсов
const interfaces = os.networkInterfaces();
let localIp;

for (const iface of Object.values(interfaces)) {
    for (const info of iface) {
        if (
            info.family === 'IPv4' &&
            !info.internal &&
            !info.address.startsWith('169.254') // skip link-local
        ) {
            localIp = info.address;
            break;
        }
    }
    if (localIp) break;
}

if (!localIp) {
    console.error('Не удалось найти локальный IP-адрес');
    process.exit(1);
}

// Путь до .env.local
const envPath = path.resolve(__dirname, '.env.local');
const envLine = `REACT_APP_HOST_ADDR=http://${localIp}:3000\n`;

// Записываем переменную
fs.writeFileSync(envPath, envLine, { encoding: 'utf8' });
console.log(`Локальный адрес сохранён: ${envLine}`);
