/**
 * Code reading example.
 * 
 * Please treat the code below as a pull request from a fellow developer.  The code runs according to the developer.
 * The new code is the methods below, calls made to other code is to be treated as working. 
 * e.g. await this.repository.getMeterReadingsFromDB() can be treated as working code.
 * 
 * Please reply with your comments and findings on the code as if you were the reviewer for this pull request into production.
 * 
 */

async function getSafeFilename(filename:string) {
    
    if (filename.split('.')[1] !== 'csv') return 'safefilename.csv'
    
    if (filename.length < 1) return 'safefilename.csv'

    if (filename == '') return 'safefilename.csv'

    if (filename.length < 5) return 'safefilename.csv'

    return filename;
}

sendMeterReadingsViaEmail = async (billingMeterReadingsEmail: string) => {
    
    const yesterday = today().subtract(1, 'days').format('YYYY-MM-DD');

    logger.info(`sendMeterReadingsViaEmail, now: ${yesterday}`);

    logger.info(`sendMeterReadingsViaEmail, billingMeterReadingsEmail: ${billingMeterReadingsEmail}`);

    let getMeterRecordsFromDb: Array<MeterReadDataExport> = await this.repository.getMeterReadingsFromDB(yesterday);

    logger.info(`getMeterReadingsFromDB ${getMeterRecordsFromDb}`)

    let processMeterRecordFromDb = await this.funcProcessMeterRecordFromDb(
    
        getMeterRecordsFromDb
    
    );

    let day = today().format('YYYYMMDDHHmmss');

    let fileName = await getSafeFilename(`RRCUSTNOVA${day}.csv`)

    logger.info(`sendMeterReadingsViaEmail: fileName: ${fileName}`);

    logger.info('Starting sendEmail()');
   
    let sendEmail = await this.send(processMeterRecordFromDb, billingMeterReadingsEmail, fileName)
    .then((data) => {
   
        logger.info('Result from send()', data);
   
    }).catch((err) => {
   
        logger.info('Error in send method', err);
   
    });
   
    logger.info('Completing sendEmail()');
  
}