const puppeteer = require('puppeteer');

const inputPath = 'https://en.wikipedia.org/wiki/PDF';
const outputPath = './dist/Lukas Grebe CV.pdf';


const blockedResources = ['goatcounter','gc.zgo'];

(async () => {  
  console.debug("launching browser");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    console.log('intercepting', request.url());
     if (blockedResources.some(resource => request.url().indexOf(resource) !== -1)){
      console.log('blocked', request.url())
        request.abort();
     }
    else
        request.continue();
  });

  console.debug("Loading page", inputPath);

  await page.setCacheEnabled(false);
  await page.goto(inputPath,{waitUntil: 'networkidle2'});
  page.on('requestfailed', err => console.error('REQUEST_FAILED:\n' + util.inspect(err)))
  await page.emulateMediaType('print');

  await page.pdf({
    path: outputPath,
    printBackground: true,
    format: 'A4',
    preferCSSPageSize: true,
    margin: {top: 0, left: 0, right: 0, bottom: 0}
  });
  await browser.close();
})();
