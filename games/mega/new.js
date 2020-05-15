function waitForElementToDisplay(selector, time) {
  if (document.querySelector(selector) != null) {
    console.log("We are in main");
    main();
    return;
  } else {
    setTimeout(function () {
      waitForElementToDisplay(selector, time);
    }, time);
  }
}

waitForElementToDisplay("#validForm > div.box-body > div:nth-child(1)", 500);

function main() {
  let game = "Mega888";
  let gameLogo = "Ⓜ ";
  let transactionEndpoint = "http://localhost:9999/new";
  let OKButton = document.querySelector("#Button_OK");
  let upperReferenceNode = document.querySelector(
    "#validForm > div.box-body > div:nth-child(1)"
  );
  let bottomReferenceNode = document.querySelector(
    "#validForm > div.box-body > div:nth-child(9)"
  );
  let id = document.querySelector("#s_playerID").value;
  let newCustomer = false;

  let copyTextarea = create("TEXTAREA", {
    class: "copy-text",
    style: "height: 1px",
  });
  document.body.appendChild(copyTextarea);
  let otherReason = "";

  let banksOpt = [
    "Malayan Banking Berhad (Maybank)",
    "Bank Simpanan Nasional",
    "Public Bank Berhad",
    "Affin Bank Berhad",
    "Agrobank (Bank Pertanian Malaysia)",
    "Ambank (M) Berhad",
    "Bank Rakyat",
    "CIMB Bank Berhad",
    "RHB Bank Berhad",
    "Hong Leong Bank Berhad",
    "Bank Islam Malaysia Berhad",
    "Alliance Bank Malaysia Berhad",
    "HSBC Bank Malaysia Berhad",
    "OCBC Bank (Malaysia) Berhad",
    "Standard Chartered Bank Malaysia Berhad",
    "Other (Please State in Remarks Column)",
  ];

  let bonusReasonOpt = [
    "Normal Package",
    "Deposit Bonus 10%",
    "Welcome Bonus 50%",
    "Withdraw Free Credit",
    "Withdraw 10%",
    "Withdraw 100%",
    "Digi Withdraw 100%",
    "Weekly Rebate",
    "Recommend Bonus",
    "Welcome Back Bonus 20%",
    "Free Credit",
    "Transfer",
    "Other",
  ];
  let bonusReason = bonusReasonOpt[0];

  let depositBankOpt = ["Maybank", "Ambank", "Digi", "7-Eleven", ""];
  let depositBank = depositBankOpt[0];

  let uselessNameInput = document.querySelector(
    "#validForm > div.box-body > div:nth-child(7)"
  );
  let uselessTelInput = document.querySelector(
    "#validForm > div.box-body > div:nth-child(8)"
  );
  let uselessDesc = document.querySelector(
    "#validForm > div.box-body > div:nth-child(9)"
  );

  document.querySelector("#txt_Password").value = "Qwer123";
  uselessNameInput.querySelector("INPUT").value = "0";
  uselessTelInput.querySelector("INPUT").value = "0";

  uselessNameInput.style.display = "none";
  uselessTelInput.style.display = "none";
  uselessDesc.style.display = "none";

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  function create(elementName, elementAttribute, value) {
    let element = document.createElement(elementName.toUpperCase());

    if (!isEmpty(elementAttribute)) {
      for (var key in elementAttribute) {
        element.setAttribute(`${key}`, `${elementAttribute[key]}`);
      }
    }

    if (value) {
      switch (elementName) {
        case ("P", "H1", "H2", "H3", "H4", "H5", "H6"):
          element.innerText = value;
          break;
        case ("BUTTON", "A"):
          element.innerHTML = value;
          break;
        case ("INPUT", "TEXTAREA"):
          element.value = value;
          break;
        default:
          element.innerHTML = value;
          break;
      }
    }

    return element;
  }

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function createCheckboxElement(options, className, handleClick) {
    let checkboxElement = create("DIV", {
      class: `form-group ${className.replace(" ", "-")}-div`,
    });
    let rowLabel = create(
      "LABEL",
      { style: "font-size: 18px" },
      `${className}`
    );

    checkboxElement.appendChild(rowLabel);
    checkboxElement.appendChild(create("BR"));

    options.forEach((option, index) => {
      let radio = create("INPUT", {
        type: "radio",
        id: option.replace(" ", "-"),
        name: className,
        value: option,
        style: "margin: 0 5px; vertical-align: middle",
        onClick: handleClick,
      });

      if (index == 0) radio.setAttribute("checked", "checked");
      let radioLabel = create(
        "LABEL",
        { for: option.replace(" ", "-") },
        option
      );
      checkboxElement.appendChild(radio);
      checkboxElement.appendChild(radioLabel);
      checkboxElement.appendChild(create("BR"));
    });

    return checkboxElement;
  }

  let newCustomerCheckbox = createCheckboxElement(
    ["No", "Yes"],
    "New Customer",
    "handleClick(this)"
  );

  // Phone Input
  let phoneRow = create("DIV", { class: "form-group customer-phone-div" });
  let phoneLabel = create("LABEL", {}, "Phone Number");
  phoneLabel.appendChild(create("SPAN", { class: "text-red" }, "[*]"));
  let phoneInput = create("INPUT", {
    type: "text",
    id: "customer-phone-number",
    name: "customer-phone-number",
    class: "form-control",
  });

  phoneRow.appendChild(phoneLabel);
  phoneRow.appendChild(phoneInput);

  // Name Input
  let nameRow = create("DIV", { class: "form-group customer-name-div" });
  let nameLabel = create("LABEL", {}, "Name");
  nameLabel.appendChild(create("SPAN", { class: "text-red" }, "[*]"));
  let nameInput = create("INPUT", {
    type: "text",
    id: "customer-name",
    name: "customer-name",
    class: "form-control",
  });

  nameRow.appendChild(nameLabel);
  nameRow.appendChild(nameInput);

  // Bank
  let bankRow = create("DIV", { class: "form-group customer-bank-div" });
  let bankLabel = create("LABEL", {}, "Bank");
  bankLabel.appendChild(create("SPAN", { class: "text-red" }, "[*]"));
  let bankSelect = create("SELECT", {
    class: "form-control",
    id: "customer-bank-select",
  });

  banksOpt.forEach((bank, index) => {
    if (index == 0) {
      bankSelect.appendChild(new Option(bank, bank, true));
    } else {
      bankSelect.appendChild(new Option(bank, bank));
    }
  });

  bankRow.appendChild(bankLabel);
  bankRow.appendChild(bankSelect);

  // Bank Account Number
  let bankAccRow = create("DIV", { class: "form-group customer-bank-acc-div" });
  let bankAccLabel = create("LABEL", {}, "Bank Account Number");
  bankAccLabel.appendChild(create("SPAN", { class: "text-red" }, "[*]"));
  let bankAccInput = create("INPUT", {
    type: "text",
    id: "customer-bank-acc",
    name: "customer-bank-acc",
    class: "form-control",
  });

  bankAccRow.appendChild(bankAccLabel);
  bankAccRow.appendChild(bankAccInput);

  // Remark
  let remarkRow = create("DIV", { class: "form-group remark-div" });
  let remarkLabel = create("LABEL", {}, "Remark");
  let remarkInput = create("INPUT", {
    type: "text",
    id: "remark",
    name: "remark",
    class: "form-control",
  });

  remarkRow.appendChild(remarkLabel);
  remarkRow.appendChild(remarkInput);

  // Group Link
  let groupLinkRow = create("DIV", { class: "form-group group-link-div" });
  let groupLinkLabel = create("LABEL", {}, "Group Link");
  let groupLinkInput = create("INPUT", {
    type: "text",
    id: "group-link",
    name: "group-link",
    class: "form-control",
  });

  groupLinkRow.appendChild(groupLinkLabel);
  groupLinkRow.appendChild(groupLinkInput);

  let newCustomerDiv = create("DIV", { style: "display: none" });
  newCustomerDiv.appendChild(nameRow);
  newCustomerDiv.appendChild(bankRow);
  newCustomerDiv.appendChild(bankAccRow);
  newCustomerDiv.appendChild(remarkRow);
  newCustomerDiv.appendChild(groupLinkRow);

  this.handleClick = (myRadio) => {
    if (myRadio.value == "Yes") {
      newCustomer = true;
      newCustomerDiv.style.display = "block";
    } else {
      newCustomer = false;
      newCustomerDiv.style.display = "none";
    }
  };

  let bonusRow = createCheckboxElement(
    bonusReasonOpt,
    "Bonus Reason",
    "bonusReasonSetter(this)"
  );

  this.bonusReasonSetter = (_) => {
    bonusReason = _.value;
    console.log(bonusReason);

    if (bonusReason == bonusReasonOpt[bonusReasonOpt.length - 1]) {
      otherInput.style.display = "inline-block";
      otherInput.addEventListener("keyup", function (e) {
        otherReason = otherInput.value;
      });
    } else {
      otherInput.style.display = "none";
    }
  };

  let otherInput = create("INPUT", {
    class: "other-reason",
    style: "display: none; margin-left: 10px; width: 300px;",
  });

  let depositBankRow = createCheckboxElement(
    depositBankOpt,
    "Bank IN/OUT",
    "bankSetter(this)"
  );

  this.bankSetter = (_) => {
    depositBank = _.value;
  };

  function replyText(id, amount, bonusReason, bank) {
    if (amount >= 0) {
      if (bank == "Digi") {
        let minCuci;
        let maxCuci;

        if (amount < 30) {
          minCuci = Math.ceil(amount) * 1.25 * 7;
          maxCuci = Math.ceil(amount) * 1.25 * 20;
        } else {
          minCuci = Math.ceil(amount) * 7;
          maxCuci = Math.ceil(amount) * 20;
        }

        return `_*New ${gameLogo} ${game} Account*_
🆔 ${id}
PW: Qwer123
💰 +${amount}
Min cuci: ${minCuci}
Max cuci: ${maxCuci}
Package: No
Cara: ${bank}
😘 Ong ID sudah siap ya boss!`;
      } else {
        let txt;
        let minCuci;
        let maxCuci;
        if (bonusReason == bonusReasonOpt[0]) {
          if (amount >= 30) {
            txt = "No";
          } else if (amount <= 10) {
            txt = 30;
          } else {
            txt = amount * 2;
          }
        } else if (
          bonusReason == bonusReasonOpt[1] ||
          bonusReason == bonusReasonOpt[2] ||
          bonusReason == bonusReasonOpt[9]
        ) {
          if (bonusReason == bonusReasonOpt[2]) {
            txt = amount * 3;
          } else {
            txt = amount * 2;
          }
        }

        return `_*New ${gameLogo} ${game} Account*_
🆔 ${id}
PW: Qwer123
💰 +${amount}
Min cuci: ${txt}
Package: ${bonusReason}
Cara: ${bank}
Ong ID sudah siap ya boss! 😘`;
      }
    } else if (
      bonusReason == bonusReasonOpt[3] ||
      bonusReason == bonusReasonOpt[4]
    ) {
      txt = Math.ceil(amount * 0.1);

      return `_*${gameLogo} ${game} Withdrawal*_
🆔 ${id}
💰 ${txt}
Type: ${bonusReason}
🎉Tahniah Boss!🎖️`;
    } else if (bonusReason == bonusReasonOpt[5]) {
      return `_*${gameLogo} ${game} Withdrawal*_
🆔 ${id}
💰 ${amount}
Type: ${bonusReason}
🎉Tahniah Boss!🎖️`;
    } else if (bonusReason == bonusReasonOpt[6]) {
      txt = Math.ceil(amount);

      return `_*${gameLogo} ${game} Withdrawal*_
🆔 ${id}
💰 ${txt}
Type: ${bonusReason}
🎉Tahniah Boss!🎖️`;
    } else if (bonusReason == bonusReasonOpt[7]) {
      minCuci = amount * 2;
      maxCuci = amount * 8;

      return `🎁_*VIP Weekly Rebate Bonus*_🎁
${gameLogo} ${game}
🆔 ${id}
💰 ${amount}
Min Cuci: ${minCuci}
Max Cuci: ${maxCuci}
Point Yang Lebih Daripada 8x Akan Burn
Enjoy Your Game🏆`;
    } else if (bonusReason == bonusReasonOpt[8]) {
      minCuci = amount * 4;
      maxCuci = amount * 8;

      return `🎁_*Recommend Bonus*_🎁
${gameLogo} ${game}
🆔 ${id}
💰 ${amount}
Max Cuci: ${maxCuci}
Thank you for recommending OriBet Malaysia
Enjoy Your Game🏆`;
    } else if (bonusReason == bonusReasonOpt[11]) {
      return `💱_*Game Credit Transfer*_💱
${gameLogo} ${game}
🆔 ${id}
💰 ${amount}`;
    }
  }

  insertAfter(upperReferenceNode, newCustomerCheckbox);
  insertAfter(newCustomerCheckbox, phoneRow);
  insertAfter(phoneRow, newCustomerDiv);
  insertAfter(bottomReferenceNode, bonusRow);
  insertAfter(bonusRow, depositBankRow);
  insertAfter(document.querySelector("label[for=Other]"), otherInput);

  document
    .querySelector("#customer-phone-number")
    .addEventListener("keyup", function (e) {
      let formatPhoneNum = document
        .querySelector("#customer-phone-number")
        .value.replace(/\D/g, "");

      if (formatPhoneNum.substr(0, 1) == "6") {
        formatPhoneNum = formatPhoneNum.substring(1, formatPhoneNum.length);
      }

      document.querySelector("#customer-phone-number").value = formatPhoneNum;
    });

  OKButton.addEventListener("click", function (e) {
    let id = document.querySelector("#s_playerID").value;
    let phoneNoVal = document.querySelector("#customer-phone-number").value;
    let name = document.querySelector("#customer-name").value;
    let amount = document.querySelector("#txt_scoreNum").value;
    let bankAccVal = document.querySelector("#customer-bank-acc").value;
    let bankSelect = document.querySelector("#customer-bank-select").value;
    let remark = document.querySelector("#remark").value;
    let groupLink = document.querySelector("#group-link").value;

    try {
      axios.post(transactionEndpoint, {
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
      });
    } catch (e) {
      console.log(e);
      alert("Please turn on the program");
    }

    copyTextarea.value = replyText(id, amount, bonusReason, depositBank);

    copyTextarea.select();
    copyTextarea.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");
  });
}
