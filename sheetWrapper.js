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
    this.browser;
    this.pages = {};

    this.init = this.init.bind(this);
    this.createNewPage = this.createNewPage.bind(this);
  }

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreHTTPSErrors: true,
        args: ["--proxy-server='direct://'", "--proxy-bypass-list=*"],
      });
      this.pages["customer"] = await this.createNewPage(urls.customer);
      this.pages["gamePlayer"] = await this.createNewPage(urls.gamePlayer);
      this.pages["transaction"] = await this.createNewPage(urls.transaction);

      console.log("Done loading...");
    } catch (e) {
      console.log(e);
    }
  }

  async createNewPage(url) {
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
      let page = this.pages[sheet];

      await page.bringToFront();

      // construct url here
      let url = this.constructFormURL(sheet, values);
      await page.goto(url);
      // submit
      await page.click(
        "#mG61Hd > div > div > div.freebirdFormviewerViewNavigationNavControls > div.freebirdFormviewerViewNavigationButtonsAndProgress > div > div > span"
      );
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = SheetWrapper;
