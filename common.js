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
