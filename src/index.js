const puppeteer = require('puppeteer');

/* eslint-disable no-unused-vars */
module.exports = {
  async onPostBuild({netlifyConfig, inputs,constants,utils }) {
    try {

      console.log('Plugin configuration', inputs)
      // Commands are printed in Netlify logs

      await utils.run('echo', ['Hello world!\n'])

      const pubDirBase = constants.PUBLISH_DIR+"/";
      const webBase = netlifyConfig.build.environment.DEPLOY_URL+"/"
      const inputPath = webBase+inputs.inputPath;
      const outputPath = pubDirBase+inputs.outputPath;
console.debug("launching browser");
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
console.debug("Loading page", inputPath);
      await page.goto(inputPath);
      console.debug("saving pdf");
      await page.pdf({
          path: outputPath,
          format: inputs.pdfPaperFormat,
          landscape: inputs.landscape
        });
        console.debug("closing browser");
      await browser.close();

    } catch (error) {
      // Report a user error
      utils.build.failBuild('Error message', { error })
    }
    finally {
      
    }
    // Display success information
    utils.status.show({ summary: 'Success!' })
  }
}
