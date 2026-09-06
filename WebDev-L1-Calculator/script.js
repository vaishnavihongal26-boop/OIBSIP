const clickSound = new Audio("click.mp3");

let expression = "0";
let justEvaluated = false;

const currentOperandEl = document.getElementById("currentOperand");
const previousOperandEl = document.getElementById("prevOperand");
const historyListEl = document.getElementById("historyList");

function updateDisplay() {
  currentOperandEl.textContent = expression;
  previousOperandEl.textContent = "";
}

function appendNumber(number) {
  if (justEvaluated) {
    expression = (number === ".") ? "0." : number;
    justEvaluated = false;
    updateDisplay();
    return;
  }

  if (expression === "0" && number !== ".") {
    expression = number;
    updateDisplay();
    return;
  }

  const lastNumberSegment = expression.split(/[+\-×÷]/).pop();
  if (number === "." && lastNumberSegment.includes(".")) return;

  expression = expression + number;
  updateDisplay();
}

function chooseOperator(op) {
  justEvaluated = false;

  const lastChar = expression.slice(-1);
  const isLastCharOperator = ["+", "−", "×", "÷"].includes(lastChar);

  if (isLastCharOperator) {
    expression = expression.slice(0, -1) + op;
  } else {
    expression = expression + op;
  }

  updateDisplay();
}

function evaluateExpression(expr) {
  const sanitized = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");

  if (!/^[0-9+\-*/.]+$/.test(sanitized)) return NaN;

  try {
    return Function('"use strict"; return (' + sanitized + ')')();
  } catch (e) {
    return NaN;
  }
}

function showError(message) {
  expression = message;
  justEvaluated = true;
  updateDisplay();
}

function addToHistory(expressionText, result) {
  const emptyMsg = historyListEl.querySelector(".empty-msg");
  if (emptyMsg) emptyMsg.remove();

  const entry = document.createElement("li");
  entry.innerHTML = `<span>${expressionText}</span><span>= ${result}</span>`;
  entry.style.cursor = "pointer";

  entry.addEventListener("click", function () {
    navigator.clipboard.writeText(result.toString()).then(function () {
      entry.classList.add("copied-flash");
      setTimeout(function () {
        entry.classList.remove("copied-flash");
      }, 500);
    });
  });

  historyListEl.prepend(entry);
}

function renderEmptyHistory() {
  if (historyListEl.children.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.classList.add("empty-msg");
    emptyMsg.textContent = "No history yet";
    historyListEl.appendChild(emptyMsg);
  }
}

function clearAll() {
  expression = "0";
  justEvaluated = false;
  updateDisplay();
}

function backspace() {
  if (justEvaluated) return;

  if (expression.length === 1) {
    expression = "0";
  } else {
    expression = expression.slice(0, -1);
  }

  updateDisplay();
}

function handleEquals() {
  const lastChar = expression.slice(-1);
  const isLastCharOperator = ["+", "−", "×", "÷"].includes(lastChar);
  if (isLastCharOperator) return;

  const result = evaluateExpression(expression);

  if (isNaN(result) || !isFinite(result)) {
    showError("Error");
    return;
  }

  addToHistory(expression, result);
  expression = result.toString();
  justEvaluated = true;
  updateDisplay();
}

function getTrailingNumber(expr) {
  const match = expr.match(/(\d+\.?\d*)$/);
  if (!match) return null;
  return { value: parseFloat(match[0]), start: match.index };
}

function handleScientific(func) {
  const trailing = getTrailingNumber(expression);
  if (!trailing) return;

  const current = trailing.value;
  let result;

  switch (func) {
    case "sqrt":
      if (current < 0) { showError("Invalid input"); return; }
      result = Math.sqrt(current);
      break;
    case "square":
      result = current * current;
      break;
    case "percent": {
      const before = expression.slice(0, trailing.start);
      const lastOp = before.slice(-1);
      if (lastOp === "+" || lastOp === "−") {
        const beforeThatMatch = before.slice(0, -1).match(/(\d+\.?\d*)$/);
        const baseNumber = beforeThatMatch ? parseFloat(beforeThatMatch[0]) : current;
        result = baseNumber * (current / 100);
      } else {
        result = current / 100;
      }
      break;
    }
    case "sin":
      result = Math.sin(current * Math.PI / 180);
      break;
    case "cos":
      result = Math.cos(current * Math.PI / 180);
      break;
    case "tan":
      result = Math.tan(current * Math.PI / 180);
      break;
    case "log":
      if (current <= 0) { showError("Invalid input"); return; }
      result = Math.log10(current);
      break;
    case "pi":
      if (justEvaluated || expression === "0") {
        expression = Math.PI.toString();
      } else {
        expression = expression + Math.PI.toString();
      }
      justEvaluated = false;
      updateDisplay();
      return;
  }

  expression = expression.slice(0, trailing.start) + result.toString();
  justEvaluated = false;
  updateDisplay();
}

document.querySelectorAll("button").forEach(function (button) {
  button.addEventListener("click", function () {
    clickSound.currentTime = 0;
    clickSound.play();
  });
});

document.querySelectorAll("[data-number]").forEach(function (button) {
  button.addEventListener("click", function () {
    appendNumber(button.dataset.number);
  });
});

document.querySelectorAll("[data-action='operator']").forEach(function (button) {
  button.addEventListener("click", function () {
    chooseOperator(button.dataset.operator);
  });
});

document.querySelector("[data-action='clear']").addEventListener("click", clearAll);
document.querySelector("[data-action='backspace']").addEventListener("click", backspace);
document.querySelector("[data-action='equals']").addEventListener("click", handleEquals);

document.querySelectorAll("[data-sci]").forEach(function (button) {
  button.addEventListener("click", function () {
    handleScientific(button.dataset.sci);
  });
});

document.getElementById("clearHistory").addEventListener("click", function () {
  historyListEl.innerHTML = "";
  renderEmptyHistory();
});

document.getElementById("copyBtn").addEventListener("click", function () {
  const copyBtn = document.getElementById("copyBtn");

  navigator.clipboard.writeText(expression).then(function () {
    copyBtn.classList.add("copied");
    copyBtn.textContent = "✓";

    setTimeout(function () {
      copyBtn.classList.remove("copied");
      copyBtn.textContent = "⧉";
    }, 1200);
  });
});

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("light-theme");
  themeToggle.textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙";
});

const modeToggle = document.getElementById("modeToggle");
const sciGrid = document.getElementById("sciGrid");

modeToggle.addEventListener("click", function () {
  sciGrid.classList.toggle("show");
  modeToggle.textContent = sciGrid.classList.contains("show") ? "Basic" : "Sci";
});

document.addEventListener("keydown", function (e) {
  const key = e.key;

  if (key >= "0" && key <= "9") {
    document.querySelector(`[data-number="${key}"]`).click();
  } else if (key === ".") {
    document.querySelector(`[data-number="."]`).click();
  } else if (key === "+") {
    document.querySelector(`[data-operator="+"]`).click();
  } else if (key === "-") {
    document.querySelector(`[data-operator="−"]`).click();
  } else if (key === "*") {
    document.querySelector(`[data-operator="×"]`).click();
  } else if (key === "/") {
    e.preventDefault();
    document.querySelector(`[data-operator="÷"]`).click();
  } else if (key === "Enter" || key === "=") {
    document.querySelector(`[data-action="equals"]`).click();
  } else if (key === "Escape") {
    document.querySelector(`[data-action="clear"]`).click();
  } else if (key === "Backspace") {
    document.querySelector(`[data-action="backspace"]`).click();
  }
});
const convertToggle = document.getElementById("convertToggle");
const converterPanel = document.getElementById("converterPanel");
const converterType = document.getElementById("converterType");
const convertFromValue = document.getElementById("convertFromValue");
const convertFromUnit = document.getElementById("convertFromUnit");
const convertToValue = document.getElementById("convertToValue");
const convertToUnit = document.getElementById("convertToUnit");

convertToggle.addEventListener("click", function () {
  converterPanel.classList.toggle("show");
});

const unitOptions = {
  length: ["Kilometers", "Miles", "Meters", "Feet"],
  weight: ["Kilograms", "Pounds", "Grams", "Ounces"],
  temperature: ["Celsius", "Fahrenheit"]
};

function populateUnitDropdowns() {
  const type = converterType.value;
  const options = unitOptions[type];

  convertFromUnit.innerHTML = "";
  convertToUnit.innerHTML = "";

  options.forEach(function (unit) {
    const option1 = document.createElement("option");
    option1.value = unit;
    option1.textContent = unit;
    convertFromUnit.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = unit;
    option2.textContent = unit;
    convertToUnit.appendChild(option2);
  });

  convertToUnit.selectedIndex = 1;
}

function convertLength(value, from, to) {
  const toMeters = {
    Kilometers: 1000,
    Miles: 1609.34,
    Meters: 1,
    Feet: 0.3048
  };
  return (value * toMeters[from]) / toMeters[to];
}

function convertWeight(value, from, to) {
  const toGrams = {
    Kilograms: 1000,
    Pounds: 453.592,
    Grams: 1,
    Ounces: 28.3495
  };
  return (value * toGrams[from]) / toGrams[to];
}

function convertTemperature(value, from, to) {
  if (from === to) return value;

  if (from === "Celsius" && to === "Fahrenheit") {
    return (value * 9) / 5 + 32;
  }
  if (from === "Fahrenheit" && to === "Celsius") {
    return ((value - 32) * 5) / 9;
  }
  return value;
}

function runConversion() {
  const value = parseFloat(convertFromValue.value);

  if (isNaN(value)) {
    convertToValue.value = "";
    return;
  }

  const type = converterType.value;
  const from = convertFromUnit.value;
  const to = convertToUnit.value;
  let result;

  if (type === "length") {
    result = convertLength(value, from, to);
  } else if (type === "weight") {
    result = convertWeight(value, from, to);
  } else if (type === "temperature") {
    result = convertTemperature(value, from, to);
  }

  convertToValue.value = Math.round(result * 10000) / 10000;
}

converterType.addEventListener("change", function () {
  populateUnitDropdowns();
  runConversion();
});

convertFromValue.addEventListener("input", runConversion);
convertFromUnit.addEventListener("change", runConversion);
convertToUnit.addEventListener("change", runConversion);

document.getElementById("downloadHistory").addEventListener("click", function () {
  const historyItems = historyListEl.querySelectorAll("li:not(.empty-msg)");

  if (historyItems.length === 0) {
    alert("No history to download yet!");
    return;
  }

  let textContent = "Calculator History\n";
  textContent += "===================\n\n";

  historyItems.forEach(function (item) {
    const spans = item.querySelectorAll("span");
    textContent += spans[0].textContent + " " + spans[1].textContent + "\n";
  });

  const blob = new Blob([textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "calculator-history.txt";
  link.click();

  URL.revokeObjectURL(url);
});
populateUnitDropdowns();
updateDisplay();
renderEmptyHistory();