const game = "Joker";
const gameLogo = "🃏";
const newPlayerEndpoint = "http://localhost:9999/new";
const upperReference = document.querySelector(
  "#form_person > div > div > div > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(6)"
);
const copyTextarea = create("TEXTAREA", {
  class: "copy-text",
  style: "height: 1px",
});
document.body.appendChild(copyTextarea);

const createPlayerButton = document.querySelector(
  "#form_person > div > div > div > div > div:nth-child(3) > div > button"
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

let depositBankOpt = ["Maybank", "Ambank", "Digi", "7-Eleven", ""];

let depositBank = depositBankOpt[0];
let newCustomer = false;
let otherReason = "";

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
    class: `${className.replace(" ", "-")}-div`,
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

// Hide useless Input field
document.querySelector(
  "#form_person > div > div > div > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(4)"
).style.display = "none";

document.querySelector(
  "#form_person > div > div > div > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(5)"
).style.display = "none";

document.querySelector("#Password").value = "Qwer1234";
document.querySelector("#Password").setAttribute("type", "text");

let newCustomerDiv = create("TR", {});
let newCustomerTableHead = create("TD", { class: "text-right no-r-border" });
let newCustomerLabel = create("LABEL", { for: "Available" }, "New Customer?");
let newCustomerInputDiv = create("TD", { colspan: 4, class: "no-1-r-border" });
let newCustomerCheckbox = createCheckboxElement(
  ["No", "Yes"],
  "New Customer",
  false,
  "handleClick(this)"
);

newCustomerDiv.appendChild(newCustomerTableHead);
newCustomerTableHead.appendChild(newCustomerLabel);
newCustomerDiv.appendChild(newCustomerInputDiv);
newCustomerInputDiv.appendChild(newCustomerCheckbox);

// Phone Input
let phoneRow = create("TR", { class: "Tab_Content_TR_Even" });
let phoneTableHead = create("TD", { class: "text-right no-r-border" });
let phoneLabel = create("LABEL", { for: "Available" }, "Phone Number");
let phoneInputDiv = create("TD", { colspan: 4, class: "no-1-r-border" });
let phoneInput = create("INPUT", {
  type: "text",
  id: "customer-phone-number",
  name: "customer-phone-number",
});

phoneRow.appendChild(phoneTableHead);
phoneTableHead.appendChild(phoneLabel);
phoneRow.appendChild(phoneInputDiv);
phoneInputDiv.appendChild(phoneInput);

// // Name Input
let nameRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let nameTableHead = create("TD", { class: "text-right no-r-border" });
let nameLabel = create("LABEL", {}, "Name");
let nameInputDiv = create("TD", { colspan: 4, class: "no-1-r-border" });
let nameInput = create("INPUT", {
  type: "text",
  id: "customer-name",
  name: "customer-name",
});

nameRow.appendChild(nameTableHead);
nameTableHead.appendChild(nameLabel);
nameRow.appendChild(nameInputDiv);
nameInputDiv.appendChild(nameInput);

// Bank
let bankRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let bankTableHead = create("TD", { class: "text-right no-r-border" });
let bankLabel = create("LABEL", {}, "Bank");
let bankInputDiv = create("TD", { colspan: 4, class: "no-1-r-border" });
let bankSelect = create("SELECT", {
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
bankRow.appendChild(bankInputDiv);
bankInputDiv.appendChild(bankSelect);

// // Bank Account Number
let bankAccRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let bankAccHead = create("TD", { class: "text-right no-r-border" });
let bankAccLabel = create("LABEL", {}, "Bank Account Number");
let bankAccInputDiv = create("TD", { colspan: 4, class: "no-1-r-border" });
let bankAccInput = create("INPUT", {
  type: "text",
  id: "customer-bank-acc",
  name: "customer-bank-acc",
});

bankAccRow.appendChild(bankAccHead);
bankAccHead.appendChild(bankAccLabel);
bankAccRow.appendChild(bankAccInputDiv);
bankAccInputDiv.appendChild(bankAccInput);

// Remark
let remarkRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let remarkHead = create("TD", { class: "text-right no-r-border" });
let remarkLabel = create("LABEL", {}, "Remark");
let remarkInputDiv = create("TD", { colspan: 4, class: "no-1-r-border" });
let remarkInput = create("INPUT", {
  type: "text",
  id: "remark",
  name: "remark",
});

remarkRow.appendChild(remarkHead);
remarkHead.appendChild(remarkLabel);
remarkRow.appendChild(remarkInputDiv);
remarkInputDiv.appendChild(remarkInput);

// // Remark
let groupLinkRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "display: none",
});
let groupLinkHead = create("TD", { class: "text-right no-r-border" });
let groupLinkLabel = create("LABEL", {}, "Group Link");
let groupLinkInputDiv = create("TD", { colspan: 4, class: "no-1-r-border" });
let groupLinkInput = create("INPUT", {
  type: "text",
  id: "group-link",
  name: "group-link",
});

groupLinkRow.appendChild(groupLinkHead);
groupLinkHead.appendChild(groupLinkLabel);
groupLinkRow.appendChild(groupLinkInputDiv);
groupLinkInputDiv.appendChild(groupLinkInput);

let bonusRow = create("TR", { class: "Tab_Content_TR_Even" });
let bonusTableHead = create("TD", { class: "text-right no-r-border" });
let bonusLabel = create("LABEL", {}, "Bonus Reason");
let bonusInputDiv = create("TD", { colspan: 4, class: "no-1-r-border" });
let bonusCheckbox = createCheckboxElement(
  bonusReasonOpt,
  "Bonus Reason",
  true,
  "bonusReasonSetter(this)"
);

function bonusReasonSetter(_) {
  bonusReason = _.value;
}

bonusRow.appendChild(bonusTableHead);
bonusTableHead.appendChild(bonusLabel);
bonusRow.appendChild(bonusInputDiv);
bonusInputDiv.appendChild(bonusCheckbox);

let depositBankRow = create("TR", {
  class: "Tab_Content_TR_Even",
  style: "border: 1px solid grey",
});
let depositBankTableHead = create("TD", { class: "text-right no-r-border" });
let depositBankLabel = create("LABEL", {}, "Deposit Bank");
let depositBankDiv = create("TD", { colspan: 4, class: "no-1-r-border" });
let depositCheckbox = createCheckboxElement(
  depositBankOpt,
  "Bank IN/OUT",
  true,
  "bankSetter(this)"
);

function bankSetter(_) {
  depositBank = _.value;
}

depositBankRow.appendChild(depositBankTableHead);
depositBankTableHead.appendChild(depositBankLabel);
depositBankRow.appendChild(depositBankDiv);
depositBankDiv.appendChild(depositCheckbox);

insertAfter(upperReference, newCustomerDiv);
insertAfter(newCustomerDiv, phoneRow);
insertAfter(phoneRow, nameRow);
insertAfter(nameRow, bankRow);
insertAfter(bankRow, bankAccRow);
insertAfter(bankAccRow, remarkRow);
insertAfter(remarkRow, groupLinkRow);
insertAfter(groupLinkRow, bonusRow);
insertAfter(bonusRow, depositBankRow);

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
    newCustomer = true;
    nameRow.style.display = "table-row";
    bankRow.style.display = "table-row";
    bankAccRow.style.display = "table-row";
    remarkRow.style.display = "table-row";
    groupLinkRow.style.display = "table-row";
  } else {
    newCustomer = false;
    nameRow.style.display = "none";
    bankRow.style.display = "none";
    bankAccRow.style.display = "none";
    remarkRow.style.display = "none";
    groupLinkRow.style.display = "none";
  }
}

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
  let id = document.querySelector("#Username").value;
  let phoneNoVal = document.querySelector("#customer-phone-number").value;
  let name = document.querySelector("#customer-name").value;
  let amount = document.querySelector("#Available").value;
  let bankAccVal = document.querySelector("#customer-bank-acc").value;
  let bankSelect = document.querySelector("#customer-bank-select").value;
  let remark = document.querySelector("#remark").value;
  let groupLink = document.querySelector("#group-link").value;

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
      depositBank,
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
