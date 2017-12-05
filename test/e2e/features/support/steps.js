import { Given, When, Then, And, defineSupportCode } from 'cucumber';

import puppeteer from 'puppeteer';
import request from 'superagent';

const baseUrl = 'http://localhost:5001';

const clearLogBtnSelector = '.test-clearLog';
const responseSelector = '.test-responseList > .test-response li';

const clearMocksBtnSelector = '.test-clearMocks';
const mocksSelector = '.test-mockList > .test-response';
const mockBtnSelector = '.test-mockBtn';

const textareaSelector = '.test-textarea';

let browser;

defineSupportCode(({ After, Before }) => {
  Before(async function() {
    this.browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 250,
    });
    this.page = await this.browser.newPage();
  });

  After(async function() {
    const { browser, page } = this;

    await page.screenshot({
      path: 'example.png',
      fullPage: true,
    });
    await browser.close();
  });
});

Given('I visit the proxy ui', async function() {
  const { page } = this;
  await page.goto(`${baseUrl}`);
});

Given('I have no logged requests', async function() {
  const { page } = this;

  const clearLogBtn = await page.$(clearLogBtnSelector);
  if (clearLogBtn) await clearLogBtn.click();
});

Given('I have no mocked responses', async function() {
  const { page } = this;

  const clearMocksBtn = await page.$(clearMocksBtnSelector);
  if (clearMocksBtn) await clearMocksBtn.click();
});
