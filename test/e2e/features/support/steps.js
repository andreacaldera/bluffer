import { Given as step, defineSupportCode } from 'cucumber';
import { delay } from 'bluebird';
import puppeteer from 'puppeteer';
import request from 'superagent';
import { lorem } from 'faker';
import assert from 'assert';
import { expect } from 'chai';
import { URL } from 'url';

const BASE_URL_UI = 'http://localhost:5001';
const BASE_URL_PROXY = 'http://localhost:7001';

const clearLogBtnSelector = '.test-clearLog';
const responseSelector = '.test-responseList > .test-response li';

const clearMocksBtnSelector = '.test-clearMocks';
const mocksSelector = '.test-mockList > .test-response li';
const mockBtnSelector = '.test-mockBtn';

const randomPath = (...args) =>
  lorem
    .words(...args)
    .split(' ')
    .join('/');

defineSupportCode(({ After, Before }) => {
  Before(async function() {
    this.browser = await puppeteer.launch({
      // headless: true,
      // slowMo: 250,
    });
    this.page = await this.browser.newPage();
    // this.page.on('console', msg => {
    //   const text = msg.args.map(a => a.toString()).join(',')
    //   text.indexOf('mudi') > -1 && console.log(text)
    // });
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

step('I visit the proxy ui', async function() {
  const { page } = this;
  await page.goto(`${BASE_URL_UI}`);
});

step('I have no logged requests', async function() {
  const { page } = this;

  const clearLogBtn = await page.$(clearLogBtnSelector);
  if (clearLogBtn) await clearLogBtn.click();
});

step('I have no mocked responses', async function() {
  const { page } = this;

  const clearMocksBtn = await page.$(clearMocksBtnSelector);
  if (clearMocksBtn) await clearMocksBtn.click();
});

step('I make multiple requests via the proxy', async function() {
  const { page } = this;
  const requestCount = Math.round(Math.random() * 10);
  this.proxyRequests = await Promise.all(Array(requestCount)
    .fill('')
    .map(() =>
      request
        .get(`${BASE_URL_PROXY}/target/${randomPath()}`)
        .then(response => {
          assert(response.status === 200);
          return response;
        })));

  await page.waitForSelector(responseSelector);
});

step('I expect to see all the requests made', async function() {
  const { page, proxyRequests } = this;
  const loggedResponses = await page.evaluate(
    selector => document.querySelectorAll(selector).length,
    responseSelector
  );
  expect(loggedResponses).to.eql(proxyRequests.length);
});

step('I click to select any one', async function() {
  const { page, proxyRequests } = this;
  const idx = Math.round(Math.random() * (proxyRequests.length - 1));
  const response = proxyRequests[idx];
  const url = new URL(response.request.url);

  this.$log = await page.evaluateHandle(
    (selector, i, pathname) => {
      const $log = [].slice
        .call(document.querySelectorAll(selector))
        .find($l => $l.innerText.indexOf(pathname) > -1);
      $log.click();
      return $log;
    },
    responseSelector,
    idx,
    url.pathname
  );

  assert(!!this.$log);

  this.selectedResponse = response;
});

step('I should see the response body in a textarea', async function() {
  const { page, selectedResponse, $log } = this;
  const response = await page.evaluate(
    $l => $l.parentNode.querySelector('textarea').value,
    $log
  );
  expect(JSON.parse(response)).to.eql(JSON.parse(selectedResponse.text));
});

step('I update the textarea with JSON', async function() {
  const { page, $log } = this;
  await page.evaluate(
    ($l) => {
      $l.parentNode.querySelector('textarea').value = '{"mudi": "was here"}';
    },
    $log
  );
});

step('click mock', async function() {
  const { page, $log } = this;
  await page.evaluate(
    ($l, _mockBtnSelector) => {
      $l.parentNode.querySelector(_mockBtnSelector).click();
    },
    $log,
    mockBtnSelector
  );
});


step('I should see the mocked response above', async function () {
  const { page, selectedResponse } = this;
  const url = new URL(selectedResponse.request.url);

  const mock = await page.evaluate(
    (selector, pathname) => {
      const $log = [].slice
        .call(document.querySelectorAll(selector))
        .find($l => $l.innerText.indexOf(pathname) > -1);
      $log.click();
      return $log.parentNode.querySelector('textarea').value;
    },
    mocksSelector,
    url.pathname
  );

  expect(mock).to.eql('{"mudi": "was here"}');
});

step('I wait a moment', () => delay(0.5 * 1000));
