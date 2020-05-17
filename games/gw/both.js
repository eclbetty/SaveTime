const game = "SunCity";
const gameLogo = "🌇";
const newPlayerEndpoint = "http://localhost:9999/new";
const transactionEndpoint = "http://localhost:9999/transaction";
const upperReference = document.querySelector(
  "#ctl00_ContentPlaceHolder1_PlayerActionPanel > div > table > tbody > tr:nth-child(2)"
);
const bottomReference = document.querySelector(
  "#ctl00_ContentPlaceHolder1_PlayerActionPanel > div > table > tbody > tr:nth-child(8)"
);

const copyTextarea = create("TEXTAREA", {
  class: "copy-text",
  style: "height: 1px",
});
document.body.appendChild(copyTextarea);

const createPlayerButton = document.querySelector(
  "#ctl00_ContentPlaceHolder1_createBtn"
);
createPlayerButton.setAttribute("disabled", "disabled");
const depositButton = document.querySelector(
  "#ctl00_ContentPlaceHolder1_depositBtn"
);
const withdrawButton = document.querySelector(
  "#ctl00_ContentPlaceHolder1_cashoutBtn"
);

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
  "Deposit Bonus 5%",
  "Welcome Bonus 100%",
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

const depositBankOpt = ["Maybank", "Ambank", "Digi", "7-Eleven", ""];
let depositBank = depositBankOpt[0];
let newCustomer = false;
let otherReason = "";

function generateID() {
  const company = "ORBMY";
  const numbs = "0123456789";
  const IDLength = 6;
  let j = 0;
  let ID = "";

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  for (let i = 0; i < IDLength; i++) {
    ID += numbs[getRandomInt(IDLength)];
  }
  return company + ID;
}

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

function createCheckboxElement(options, className, vertical, handleClick) {
  let checkboxElement = create("DIV", {
    class: `form-group ${className.replace(" ", "-")}-div`,
  });

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
    let radioLabel = create("LABEL", { for: option.replace(" ", "-") }, option);
    checkboxElement.appendChild(radio);
    checkboxElement.appendChild(radioLabel);

    if (vertical) {
      checkboxElement.appendChild(create("BR"));
    }
  });

  return checkboxElement;
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

let idInput = document.querySelector(
  "#ctl00_ContentPlaceHolder1_userNameTextBox"
);

// Hide useless Fill in AgentID Button
document.querySelector("#ctl00_ContentPlaceHolder1_copyKioskLB").style.display =
  "none";

let newIdButton = create(
  "BUTTON",
  { style: "margin-left: 10px", id: "newIDButton" },
  "New ID"
);

insertAfter(idInput, newIdButton);

newIdButton.addEventListener("click", handleGenerateID);

let newCustomerDiv = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let newCustomerTableHead = create("TH", {
  class: "Tab_Header_TR",
  align: "right",
});
let newCustomerLabel = create("LABEL", {}, "New Customer?");
let newCustomerCheckbox = createCheckboxElement(
  ["No", "Yes"],
  "New Customer",
  false,
  "handleClick(this)"
);

newCustomerDiv.appendChild(newCustomerTableHead);
newCustomerTableHead.appendChild(newCustomerLabel);
newCustomerDiv.appendChild(newCustomerCheckbox);

// Phone Input
let phoneRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let phoneTableHead = create("TH", { class: "Tab_Header_TR", align: "right" });
let phoneLabel = create("LABEL", {}, "Phone Number");
let phoneInput = create("INPUT", {
  type: "text",
  id: "customer-phone-number",
  name: "customer-phone-number",
  class: "form-control",
});

phoneRow.appendChild(phoneTableHead);
phoneTableHead.appendChild(phoneLabel);
phoneRow.appendChild(phoneInput);

// Name Input
let nameRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let nameTableHead = create("TH", { class: "Tab_Header_TR", align: "right" });
let nameLabel = create("LABEL", {}, "Name");
let nameInput = create("INPUT", {
  type: "text",
  id: "customer-name",
  name: "customer-name",
  class: "form-control",
});

nameRow.appendChild(nameTableHead);
nameTableHead.appendChild(nameLabel);
nameRow.appendChild(nameInput);

// Bank
let bankRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let bankTableHead = create("TH", { class: "Tab_Header_TR", align: "right" });
let bankLabel = create("LABEL", {}, "Bank");
let bankSelect = create("SELECT", {
  class: "form-control",
  id: "customer-bank-select",
  style: "width: 173px",
});

banksOpt.forEach((bank, index) => {
  if (index === 0) {
    bankSelect.appendChild(new Option(bank, bank, true));
  } else {
    bankSelect.appendChild(new Option(bank, bank));
  }
});

bankRow.appendChild(bankTableHead);
bankTableHead.appendChild(bankLabel);
bankRow.appendChild(bankSelect);

// Bank Account Number
let bankAccRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let bankAccHead = create("TH", { class: "Tab_Header_TR", align: "right" });
let bankAccLabel = create("LABEL", {}, "Bank Account Number");
let bankAccInput = create("INPUT", {
  type: "text",
  id: "customer-bank-acc",
  name: "customer-bank-acc",
  class: "form-control",
});

bankAccRow.appendChild(bankAccHead);
bankAccHead.appendChild(bankAccLabel);
bankAccRow.appendChild(bankAccInput);

// Remark
let remarkRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let remarkTableHead = create("TH", { class: "Tab_Header_TR", align: "right" });
let remarkLabel = create("LABEL", {}, "Remark");
let remarkInput = create("INPUT", {
  type: "text",
  id: "remark",
  name: "remark",
});

remarkRow.appendChild(remarkTableHead);
remarkTableHead.appendChild(remarkLabel);
remarkRow.appendChild(remarkInput);

// Group Link
let groupLinkRow = create("TR", {
  class: "Tab_Content_TR_Even group-link-row",
  style: "display: none",
});
let groupLinkTableHead = create("TH", {
  class: "Tab_Header_TR",
  align: "right",
});
let groupLinkLabel = create("LABEL", {}, "Group Link");
let groupLinkInput = create("INPUT", {
  type: "text",
  id: "group-link",
  name: "group-link",
});

groupLinkRow.appendChild(groupLinkTableHead);
groupLinkTableHead.appendChild(groupLinkLabel);
groupLinkRow.appendChild(groupLinkInput);

let bonusRow = create("TR", { class: "Tab_Content_TR_Even" });
let bonusTableHead = create("TH", { class: "Tab_Header_TR", align: "right" });
let bonusLabel = create("LABEL", {}, "Bonus Reason");
let bonusCheckbox = createCheckboxElement(
  bonusReasonOpt,
  "Bonus Reason",
  true,
  "bonusReasonSetter(this)"
);

bonusRow.appendChild(bonusTableHead);
bonusTableHead.appendChild(bonusLabel);
bonusRow.appendChild(bonusCheckbox);

let depositBankRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "border: 1px solid grey",
});
let depositBankTableHead = create("TH", {
  class: "Tab_Header_TR",
  align: "right",
});
let depositBankLabel = create("LABEL", {}, "Deposit Bank");
let depositCheckbox = createCheckboxElement(
  depositBankOpt,
  "Bank IN/OUT",
  true,
  "bankSetter(this)"
);

function bankSetter(_) {
  depositBank = _.value;
}

// Group Link
let otherReasonRow = create("TR", {
  class: "Tab_Content_TR_Even other-reason-row",
  style: "display: none",
});
let otherReasonTableHead = create("TH", {
  class: "Tab_Header_TR",
  align: "right",
});
let otherReasonLabel = create("LABEL", {}, "Other Reason");
let otherReasonInput = create("INPUT", {
  type: "text",
  id: "other-reason",
  name: "other-reason",
});

otherReasonRow.appendChild(otherReasonTableHead);
otherReasonTableHead.appendChild(otherReasonLabel);
otherReasonRow.appendChild(otherReasonInput);

function bonusReasonSetter(_) {
  bonusReason = _.value;

  if (bonusReason == bonusReasonOpt[bonusReasonOpt.length - 1]) {
    otherReasonRow.style.display = "table-row";
    otherReasonInput.addEventListener("keyup", function (e) {
      otherReason = otherReasonInput.value;
    });
  } else {
    otherReasonRow.style.display = "none";
  }
}

// Tranasction Remark
let transactionRemarkRow = create("TR", { class: "Tab_Content_TR_Even" });
let transactionRemarkTableHead = create("TH", {
  class: "Tab_Header_TR",
  align: "right",
});
let transactionRemarkLabel = create("LABEL", {}, "Remark");
let transactionRemarkInput = create("INPUT", {
  type: "text",
  id: "transaction-remark",
  name: "transaction-remark",
});

transactionRemarkRow.appendChild(transactionRemarkTableHead);
transactionRemarkTableHead.appendChild(transactionRemarkLabel);
transactionRemarkRow.appendChild(transactionRemarkInput);

depositBankRow.appendChild(depositBankTableHead);
depositBankTableHead.appendChild(depositBankLabel);
depositBankRow.appendChild(depositCheckbox);

insertAfter(upperReference, newCustomerDiv);
insertAfter(newCustomerDiv, phoneRow);
insertAfter(phoneRow, nameRow);
insertAfter(nameRow, bankRow);
insertAfter(bankRow, bankAccRow);
insertAfter(
  document.querySelector(
    "#ctl00_ContentPlaceHolder1_PlayerActionPanel > div > table > tbody > tr:nth-child(8)"
  ),
  bonusRow
);
insertAfter(bonusRow, otherReasonRow);
insertAfter(otherReasonRow, depositBankRow);
insertAfter(depositBankRow, transactionRemarkRow);

insertAfter(bankAccRow, remarkRow);
insertAfter(remarkRow, groupLinkRow);

function handleGenerateID(e) {
  e.preventDefault();
  idInput.value = generateID();

  createPlayerButton.removeAttribute("disabled");
  depositButton.setAttribute("disabled", "disabled");
  withdrawButton.setAttribute("disabled", "disabled");

  newCustomerDiv.style.display = "table-row";
  phoneRow.style.display = "table-row";

  newCustomer = true;
}

function handleClick(myRadio) {
  if (myRadio.value == "Yes") {
    nameRow.style.display = "table-row";
    bankRow.style.display = "table-row";
    bankAccRow.style.display = "table-row";
    remarkRow.style.display = "table-row";
    groupLinkRow.style.display = "table-row";
  } else {
    nameRow.style.display = "none";
    bankRow.style.display = "none";
    bankAccRow.style.display = "none";
    remarkRow.style.display = "none";
    groupLinkRow.style.display = "none";
  }
}

function newReplyText(id, amount, bonusReason, bank) {
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
          txt = amount * 10;
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

function transactionReplyText(id, amount, bonusReason, bank) {
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

      return `_*${gameLogo} ${game} Top Up*_
🆔 ${id}
💰 +${amount}
Min cuci: ${minCuci}
Max cuci: ${maxCuci}
Package: No
Cara: ${bank}
😘 Ong ong ya boss`;
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
          txt = amount * 10;
        } else {
          txt = amount * 2;
        }
      }

      return `_*${gameLogo} ${game} Top Up*_
🆔 ${id}
💰 +${amount}
Min cuci: ${txt}
Package: ${bonusReason}
Cara: ${bank}
Ong ong ya boss 😘`;
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
createPlayerButton.addEventListener("click", function (e) {
  let id = document.querySelector("#ctl00_ContentPlaceHolder1_userNameTextBox")
    .value;
  let phoneNoVal = document.querySelector("#customer-phone-number").value;
  let name = document.querySelector("#customer-name").value;
  let amount = document.querySelector(
    "#ctl00_ContentPlaceHolder1_depositTextBox"
  ).value;
  let bankAccVal = document.querySelector("#customer-bank-acc").value;
  let bankSelect = document.querySelector("#customer-bank-select").value;
  let remark = document.querySelector("#remark").value || "";
  let groupLink = document.querySelector("#group-link").value || "";

  try {
    axios.post(newPlayerEndpoint, {
      newCustomer,
      phoneNoVal,
      name,
      bankSelect,
      bankAccVal,
      game,
      id,
      amount,
      bonusReason,
      otherReason,
      depositBank,
      remark,
      groupLink,
    });
  } catch (e) {
    console.log(e);
    alert("Please turn on the program");
  }

  copyTextarea.value = newReplyText(id, amount, bonusReason, depositBank);

  copyTextarea.select();
  copyTextarea.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");
});

function handleTransaction(e) {
  let id = document.querySelector("#ctl00_ContentPlaceHolder1_userNameTextBox")
    .value;
  let amount = document.querySelector(
    "#ctl00_ContentPlaceHolder1_depositTextBox"
  ).value;
  let transactionRemark =
    document.querySelector("#transaction-remark").value || "";

  if (e.target.id == "ctl00_ContentPlaceHolder1_cashoutBtn") {
    amount = -amount;
  }

  try {
    axios.post(transactionEndpoint, {
      game,
      id,
      amount,
      bonusReason,
      otherReason,
      bank: depositBank,
      remark: transactionRemark,
    });
  } catch (e) {
    console.log(e);
    alert("Please turn on the program");
  }

  console.log(id, amount, bonusReason, depositBank);

  copyTextarea.value = transactionReplyText(
    id,
    amount,
    bonusReason,
    depositBank
  );

  copyTextarea.select();
  copyTextarea.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");
}

depositButton.addEventListener("click", handleTransaction);
withdrawButton.addEventListener("click", handleTransaction);
