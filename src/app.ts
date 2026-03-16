import { migrate, seed } from "#postgres/knex.js";
import cron from "node-cron";

import { tariffSyncDiContainer } from "#di/containet.js";

await migrate.latest();
await seed.run();

console.log("All migrations and seeds have been run");

console.log(" ==== Job Init ====");

const tariffSyncContainer = tariffSyncDiContainer();

console.log(" ==== Job Startet ====");

const taskGetFromWb = cron.schedule('0 * * * *', () => {
    console.log('Update from WB started');
    tariffSyncContainer.domain.getFromWb();
});

const taskSetToGoogleSheet = cron.schedule('*/15 * * * *', () => {
    console.log('Upload to GS started');
    tariffSyncContainer.domain.setToGoogleSheet();
});

process.on('SIGINT', () => {
    console.log(" ==== Gracefull exit ====");
    
    taskGetFromWb.stop(); 
    taskSetToGoogleSheet.stop();  

    taskGetFromWb.destroy(); 
    taskSetToGoogleSheet.destroy();    

    console.log(" ==== Bye ====");
    process.exit(0);
});