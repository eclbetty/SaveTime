const puppeteer = require("puppeteer");

let urls = {
  customer:
    "https://docs.google.com/forms/d/e/1FAIpQLSe5BCzTAK-km0pK6GJCfct3tgNidH7PI5wMgJM2Ft85yuzTfQ/viewform?",
  gamePlayer:
    "https://docs.google.com/forms/d/e/1FAIpQLSf5DL1xcM7WWEEaxfdSM90bgb23Ndv1aDMYjAezZzsiWcGZYA/viewform?",
  transaction:
    "https://docs.google.com/forms/d/e/1FAIpQLSdZjo0_8Xt8j47f203xGpjG_9_cRDK0MSuZOrbGIMSO1DPLCQ/viewform?",
};

let formEntry = {
  customer: {
    phone: "entry.642586132",
    name: "entry.1112645439",
    bank: "entry.147119155",
    bankAcc: "entry.1097891495",
    remark: "entry.888391575",
    groupLink: "entry.1125965109",
  },
  gamePlayer: {
    gameID: "entry.526165272",
    phone: "entry.2038273630",
    platform: "entry.930649759",
  },
  transaction: {
    platform: "entry.622747945",
    gameID: "entry.931626184",
    topup: "entry.1675630251",
    bonus: "entry.535813883",
    expenses: "entry.973448956",
    bonusReason: "entry.73019013",
    otherReason: "entry.73019013.other_option_response",
    personInCharge: "entry.369667911",
    bankInOut: "entry.992186400",
    remark: "entry.1212653217",
  },
};

class SheetWrapper {
  constructor() {
    this.browser = true;
    this.browserWSEndpoint;
    this.pages = {};

    this.init = this.init.bind(this);
    this.createNewPage = this.createNewPage.bind(this);
    this.waitForBrowser = this.waitForBrowser.bind(this);
  }

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        ignoreHTTPSErrors: true,
      });

      this.browserWSEndpoint = this.browser.wsEndpoint();

      console.log("Done loading...");

      this.browser.on("disconnected", this.init);
    } catch (e) {
      console.log(e);
    }
  }

  async createNewPage(url) {
    console.log(this.browser.isConnected());
    if (!this.browser.isConnected()) {
      console.log("Connect to browser");
      this.browser = await puppeteer.connect({
        browserWSEndpoint: this.browserWSEndpoint,
      });
    }

    let newPage = await this.browser.newPage();
    newPage.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    );
    newPage.goto(url);
    await newPage.waitForNavigation();
    newPage.on("dialog", async (dialog) => {
      console.log("dialog");
      await dialog.accept();
    });
    return newPage;
  }

  constructFormURL(sheet, values) {
    let url = urls[sheet];
    let keys = Object.keys(values);

    keys.forEach((key, index) => {
      let entry = formEntry[sheet][key];
      let value = values[key];

      if (typeof value == "string") {
        value = value.replace(/ /g, "+");
        value = value.replace("%", "%25");
      }

      url += `${entry}=${value}`;

      if (index != keys.length - 1) {
        url += "&";
      }
    });

    console.log(url);
    return url;
  }

  async writeTo(sheet, values) {
    try {
      // construct url here

      if (this.browser === false) {
        console.log("The browser has been closed.");

        await this.waitForBrowser;
      }

      let url = this.constructFormURL(sheet, values);
      let page = await this.createNewPage(url);

      // submit
      const navigationPromise = page.waitForNavigation();
      await page.click(
        "#mG61Hd > div > div > div.freebirdFormviewerViewNavigationNavControls > div.freebirdFormviewerViewNavigationButtonsAndProgress > div > div > span"
      );
      await navigationPromise;

      await page.waitFor(500);

      await page.close();
    } catch (e) {
      console.log(e);
      this.writeTo(sheet, values);
    }
  }

  waitForBrowser() {
    return new Promise((resolve, reject) => {
      const browser_check = setInterval(() => {
        if (this.browser !== false) {
          clearInterval(browser_check);
          resolve(true);
        }
      }, 100);
    });
  }

  async disconnect() {
    console.log("Disconnect from the browser");
    await this.browser.disconnect();
  }
}

module.exports = SheetWrapper;
