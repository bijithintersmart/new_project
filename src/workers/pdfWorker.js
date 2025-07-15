import { parentPort, workerData } from 'worker_threads';
import puppeteer from 'puppeteer';

async function generatePdf() {
  const { htmlContent } = workerData;

  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    parentPort.postMessage(pdfBuffer);
  } catch (error) {
    console.error('Error in PDF worker:', error);
    parentPort.postMessage({ error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

generatePdf();