const display = document.getElementById("display");
const operationDisplay = document.getElementById("operation");
const keys = document.querySelector(".keys");
const projectsBtn = document.getElementById("cta-projects");
const backBtn = document.getElementById("cta-back");

let current = "0";
let previous = "";
let operator = "";
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = current;
}

function symbolFor(operatorValue) {
  if (operatorValue === "*") {
    return "x";
  }
  if (operatorValue === "/") {
    return "÷";
  }
  return operatorValue;
}

function updateOperation() {
  if (operator) {
    operationDisplay.textContent = `${previous} ${symbolFor(operator)}`;
    return;
  }
  operationDisplay.textContent = "";
}

function updateOperatorHighlight() {
  const operatorButtons = keys.querySelectorAll(".key-operator");
  operatorButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.value === operator);
  });
}

function refreshUI() {
  updateDisplay();
  updateOperation();
  updateOperatorHighlight();
}

function inputNumber(value) {
  if (shouldResetDisplay) {
    current = value;
    shouldResetDisplay = false;
    return;
  }

  if (current === "0") {
    current = value;
    return;
  }

  current += value;
}

function inputDot() {
  if (shouldResetDisplay) {
    current = "0.";
    shouldResetDisplay = false;
    return;
  }

  if (!current.includes(".")) {
    current += ".";
  }
}

function setOperator(nextOperator) {
  if (operator && !shouldResetDisplay) {
    calculate();
  }

  previous = current;
  operator = nextOperator;
  shouldResetDisplay = true;
}

function calculate() {
  if (!operator || shouldResetDisplay) {
    return;
  }

  const prev = Number(previous);
  const curr = Number(current);
  let result = 0;

  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      if (curr === 0) {
        current = "Erro";
        operator = "";
        previous = "";
        shouldResetDisplay = true;
        return;
      }
      result = prev / curr;
      break;
    default:
      return;
  }

  current = Number.isInteger(result) ? String(result) : String(Number(result.toFixed(8)));
  operator = "";
  previous = "";
  shouldResetDisplay = true;
}

function clearAll() {
  current = "0";
  previous = "";
  operator = "";
  shouldResetDisplay = false;
}

function backspace() {
  if (shouldResetDisplay || current === "Erro") {
    current = "0";
    shouldResetDisplay = false;
    return;
  }

  current = current.length > 1 ? current.slice(0, -1) : "0";
}

keys.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const { value, action } = target.dataset;

  if (action === "clear") {
    clearAll();
  } else if (action === "backspace") {
    backspace();
  } else if (action === "equals") {
    calculate();
  } else if (value) {
    if (/\d/.test(value)) {
      inputNumber(value);
    } else if (value === ".") {
      inputDot();
    } else {
      setOperator(value);
    }
  }

  refreshUI();
});

window.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/\d/.test(key)) {
    inputNumber(key);
  } else if (key === ".") {
    inputDot();
  } else if (["+", "-", "*", "/"].includes(key)) {
    setOperator(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape" || key.toLowerCase() === "c") {
    clearAll();
  } else {
    return;
  }

  refreshUI();
});

refreshUI();

if (projectsBtn) {
  projectsBtn.addEventListener("click", () => {
    window.location.href = "../../index.html#projects";
  });
}

if (backBtn) {
  backBtn.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "../../index.html#projects";
  });
}
