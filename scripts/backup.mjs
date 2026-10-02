import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const destination=path.join('backups',`leads-${new Date().toISOString().replaceAll(':','-')}.db`);
await mkdir('backups',{recursive:true});
try {await copyFile('prisma/leads.db',destination);console.log(`Backup: ${destination}. Запускайте после остановки приложения.`);} catch {console.error('Не удалось создать backup. Проверьте наличие prisma/leads.db и остановите приложение.');process.exitCode=1;}
