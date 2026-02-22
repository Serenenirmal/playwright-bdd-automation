import { promises as fs } from 'fs';
import { BeforeAll, AfterAll, Before, After, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { BrowserFactory } from './browserFactory';
import { config } from '../config/env';

// Set default timeout to 30 seconds
setDefaultTimeout(30000);

BeforeAll(async function () {
    // Create reports directories
    await fs.mkdir('reports/screenshots', { recursive: true });
    await BrowserFactory.initBrowser();
});

Before(async function () {
    this.page = await BrowserFactory.getPage();
});

After(async function (scenario) {
    if (scenario.result?.status === Status.FAILED) {
        if (this.page) {
            const screenshot = await this.page.screenshot({ path: `reports/screenshots/${scenario.pickle.name.replace(/\s+/g, '_')}.png`, fullPage: true });
            this.attach(screenshot, 'image/png');
        }
    }
    await BrowserFactory.closePage(this.page);
});

AfterAll(async function () {
    await BrowserFactory.closeBrowser(); // Ensure browser is closed at the very end
});
