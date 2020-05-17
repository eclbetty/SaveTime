(async () => {
  const express = require("express");
  const cors = require("cors");
  const bodyParser = require("body-parser");
  const SheetWrapper = require("./sheetWrapper");

  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const customerSheet = "customer";
  const gamePlayerSheet = "gamePlayer";
  const transactionSheet = "transaction";

  const admin = "Jordan";

  /*Rate*/
  let shopeeRate = 0.0212;
  let depositBonusRate = 0.05;
  let welcomeBonusRate = 1.0;

  const sheetWrapper = new SheetWrapper();
  await sheetWrapper.init();

  async function writeToSheet(admin, sheet, values) {
    try {
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  function getDateTimeNow() {
    let now = new Date();
    let day = now.getDate().toString().padStart(2, "0");
    let month = (now.getMonth() + 1).toString().padStart(2, "0");
    let year = now.getFullYear();
    let hour = now.getHours().toString().padStart(2, "0");
    let minute = now.getMinutes().toString().padStart(2, "0");
    let second = now.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  }

  function getGameCode(game, id) {
    switch (game.toUpperCase()) {
      case "918KISS":
        return `K${id}`;
      case "XE88":
        return `XE${id}`;
      case "MEGA888":
        return `M${id}`;
      case "PUSSY888":
        return `P${id}`;
      case "PLAYBOY2":
        return `PB${id}`;
      case "GREATWALL":
        return `GW${id}`;
      case "SUNCITY":
        return `SC${id}`;
      case "LIVE22":
        return `L${id}`;
      case "JOKER":
        return `J${id}`;
      default:
        return `${id}`;
    }
  }

  function isInt(n) {
    return n % 1 === 0;
  }

  function getTopupAndBonusAmount(amount, bonusReason, depositBank) {
    let topup = 0;
    let bonus = 0;
    if (depositBank.toUpperCase() == "DIGI") {
      if (amount < 30) {
        if (isInt(amount)) {
          bonus = -(amount * 0.25);
          topup = parseInt(amount) - bonus;
        } else {
          bonus = -(Math.ceil(amount) * 0.25);
          topup = parseFloat(amount) - bonus;
        }

        return [topup, bonus];
      } else {
        topup = amount;
        bonus = 0;
      }
    } else {
      if (bonusReason == "Deposit Bonus 5%") {
        console.log("Deposit Bonus");
        let depositRate = depositBonusRate / (1 + depositBonusRate);
        bonus = amount * depositRate;
        topup = amount * (1 - depositRate);
      } else if (bonusReason == "Welcome Bonus 100%") {
        console.log("Welcome Bonus");
        let welcomeRate = welcomeBonusRate / (1 + welcomeBonusRate);
        bonus = amount * welcomeRate;
        topup = amount * (1 - welcomeRate);
      } else if (bonusReason == "Withdraw Free Credit") {
        console.log("Withdraw Free Credit");
        bonus = amount;
      } else if (bonusReason == "Withdraw 10%") {
        console.log("Withdraw 10%");
        topup = Math.round(amount * 0.1);
        bonus = amount - topup;
      } else if (
        bonusReason == "Withdraw 100%" ||
        bonusReason == "Digi Withdraw 100%"
      ) {
        console.log("Withdraw 100%");
        topup = Math.round(amount);
      } else if (
        bonusReason == "Weekly Rebate" ||
        bonusReason == "Recommend Bonus" ||
        bonusReason == "Free Credit" ||
        bonusReason == "Transfer"
      ) {
        console.log("Rebate and transfer");
        bonus = amount;
      } else {
        console.log("Else");
        topup = amount;
        bonus = 0;
      }
    }

    if (depositBank.toUpperCase() == "7-ELEVEN") {
      let tempTotal = parseFloat(topup) + parseFloat(bonus);
      topup = parseFloat(topup * (1 - shopeeRate)).toFixed(2);
      bonus = tempTotal - topup;
    }
    return [topup, bonus];
  }

  app.post("/new", async (req, res) => {
    try {
      console.log(req.body);
      let {
        newCustomer,
        phoneNoVal,
        name,
        bankSelect,
        bankAccVal,
        game,
        id,
        amount,
        bonusReason,
        depositBank,
        otherReason,
        remark,
        groupLink,
      } = req.body;

      let [topup, bonus] = getTopupAndBonusAmount(
        amount,
        bonusReason,
        depositBank
      );

      if (bonusReason.toUpperCase() == "OTHER") {
        bonusReason = "__other_option__";
      }

      if (newCustomer) {
        await sheetWrapper.writeTo(customerSheet, {
          name,
          phone: phoneNoVal,
          bank: bankSelect,
          bankAcc: bankAccVal,
          remark,
          groupLink,
        });
      }

      await sheetWrapper.writeTo(gamePlayerSheet, {
        platform: game,
        gameID: getGameCode(game, id),
        phone: phoneNoVal,
      });

      if (game.toUpperCase() != "LIVE22") {
        await sheetWrapper.writeTo(transactionSheet, {
          platform: game,
          gameID: getGameCode(game, id),
          topup,
          bonus,
          bonusReason,
          otherReason,
          personInCharge: admin,
          bankInOut: depositBank,
        });
      }

      console.log(`Done Update ${game}: ${id}.`);

      res.json({
        status: 200,
        newCustomer,
        phoneNoVal,
        name,
        bankSelect,
        bankAccVal,
        game,
        id,
        amount,
        bonusReason,
        depositBank,
      });
    } catch (e) {
      console.log(e);
    }
  });

  app.post("/transaction", async (req, res) => {
    try {
      let {
        game,
        id,
        amount,
        bonusReason,
        otherReason,
        bank,
        remark,
      } = req.body;

      console.log(req.body);

      if (bonusReason.toUpperCase() == "OTHER") {
        bonusReason = "__other_option__";
      }

      let [topup, bonus] = getTopupAndBonusAmount(amount, bonusReason, bank);

      await sheetWrapper.writeTo(transactionSheet, {
        platform: game,
        gameID: getGameCode(game, id),
        topup,
        bonus,
        bonusReason,
        otherReason,
        personInCharge: admin,
        bankInOut: bank,
        remark,
      });

      console.log(`Done Update ${game}: ${id}.`);

      res.json({
        status: 200,
        platform: game,
        gameID: id,
        topup,
        bonus,
        bonusReason,
        otherReason,
        personInCharge: admin,
        bankInOut: bank,
      });
    } catch (e) {
      console.log(e);
    }
  });

  app.listen(9999, async () => {
    console.log("The server is listening on PORT 9999....");
  });
})();
