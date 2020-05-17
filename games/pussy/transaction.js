let game = "Pussy888";
let gameLogo = "🐈";
let transactionEndpoint = "http://localhost:9999/transaction";
let OKButton = document.querySelector("#Button_OK");
let referenceNode = document.querySelector(
  "body > div.wrapper > div.content-wrapper > section.content > div.box.box-default > div.box-body > div:nth-child(2)"
);
let id = document.querySelector(".box-title").innerHTML;

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
let bankOpt = ["Maybank", "Ambank", "Digi", "7-Eleven", ""];
let bonusReason = bonusReasonOpt[0];
let bank = bankOpt[0];
let copyTextarea = create("TEXTAREA", {
  class: "copy-text",
  style: "height: 1px",
});
document.body.appendChild(copyTextarea);
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

function insertAfter(referenceNode, newNode, setter) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function createCheckboxElement(options, className, cbName) {
  let checkboxElement = create("DIV", {
    class: `form-group ${className.replace(" ", "-")}-div`,
  });
  let rowLabel = create("LABEL", { style: "font-size: 18px" }, `${className}`);

  checkboxElement.appendChild(rowLabel);
  checkboxElement.appendChild(create("BR"));

  options.forEach((option, index) => {
    let radio = create("INPUT", {
      type: "radio",
      id: option.replace(" ", "-"),
      name: className,
      value: option,
      style: "margin: 0 5px; vertical-align: middle",
      onClick: cbName,
    });

    if (index == 0) radio.setAttribute("checked", "checked");
    let radioLabel = create("LABEL", { for: option.replace(" ", "-") }, option);
    checkboxElement.appendChild(radio);
    checkboxElement.appendChild(radioLabel);
    checkboxElement.appendChild(create("BR"));
  });

  return checkboxElement;
}

let bonusRow = createCheckboxElement(
  bonusReasonOpt,
  "Bonus Reason",
  "bonusReasonSetter(this)"
);

function bonusReasonSetter(_) {
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
}

let otherInput = create("INPUT", {
  class: "other-reason",
  style: "display: none; margin-left: 10px; width: 300px;",
});

let bankRow = createCheckboxElement(bankOpt, "Bank IN/OUT", "bankSetter(this)");

function bankSetter(_) {
  bank = _.value;
  console.log(bank);
}

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

insertAfter(referenceNode, bonusRow);
insertAfter(document.querySelector("label[for=Other]"), otherInput);
insertAfter(otherInput, bankRow);
insertAfter(bankRow, remarkRow);

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
          txt = amount * 3;
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

OKButton.addEventListener("click", function () {
  let amount = document.querySelector("#txt_scoreNum").value;
  let remark = document.querySelector("#remark").value || "";
  let id = document.querySelector(".box-title").innerHTML;

  try {
    axios.post(transactionEndpoint, {
      game,
      id,
      amount,
      bank,
      bonusReason,
      otherReason,
      remark,
    });
  } catch (e) {
    alert("Please turn on the program");
  }

  if (bonusReason == bonusReasonOpt[bonusReasonOpt.length - 1]) {
    copyTextarea.value = replyText(id, amount, otherReason, bank);
  } else {
    copyTextarea.value = replyText(id, amount, bonusReason, bank);
  }

  copyTextarea.value = replyText(id, amount, bonusReason, bank);

  copyTextarea.select();
  copyTextarea.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");
});
