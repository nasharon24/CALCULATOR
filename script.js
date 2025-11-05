// get the display element once
const display = document.getElementById("display");

function appendValue(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    // 1) Remove whitespace
    let expr = display.value.replace(/\s+/g, "");

    // 2) Normalize common symbols:
    //    • division signs -> '/'
    //    • many possible multiplication symbols (× x X ✕ ✖ · • etc.) -> '*'
    //    • percent -> '/100' (so 50% -> 50/100)
    expr = expr
      .replace(/÷/g, "/")
      .replace(/[×✕✖·•\u00D7\u2715\u2716\u00B7xX]/g, "*")
      .replace(/%/g, "/100");

    // 3) Remove accidental trailing operator(s) which cause eval errors (e.g., "12+")
    expr = expr.replace(/[+\-*/.]+$/g, "");

    // 4) Validate final expression only contains safe characters (digits, operators, parentheses, and decimal point)
    //    After replacements we expect digits, + - * / ( ) and .
    if (!/^[0-9+\-*/().]+$/.test(expr)) {
      display.value = "Error";
      return;
    }

    // 5) Evaluate safely using Function (slightly safer than direct eval usage)
    //    This still evaluates expressions but prevents access to outer scope.
    let result = Function('"use strict"; return (' + expr + ')')();

    // 6) Handle bad numeric results
    if (!isFinite(result) || isNaN(result)) {
      display.value = "Error";
    } else {
      display.value = result;
    }
  } catch (err) {
    display.value = "Error";
  }
}

