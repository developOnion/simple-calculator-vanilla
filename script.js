const screen = document.querySelector(".calc-screen");

let buffer = "0";
let runningTotal = 0;
let previousOperator;

function btnClick(val) {
    if (isNaN(parseInt(val))) {
        handleSymbol(val);
    } else {
        handleNumber(val);
    }

    reRender();
}

function handleNumber(num) {
    if (buffer === "0" || buffer === "Infinity") {
        buffer = num;
    } else if (buffer === "Infinity") {
        buffer = "0";
    } else {
        buffer += num;
    }

    reRender();
}

function handleSymbol(symbol) {
    if (buffer === "Infinity") {
        buffer = "0";
        runningTotal = 0;
        previousOperator = null;
        reRender();

        if (symbol !== "C") {
            handleSymbol(symbol);
        }

        return;
    }

    switch (symbol) {
        case "C":
            buffer = "0";
            break;
        case "=":
            if (previousOperator === null) {
                return;
            }
            flushOperation(parseInt(buffer));
            previousOperator = null;
            buffer = String(runningTotal);
            runningTotal = 0;

            break;
        case "←":
            if (buffer.length === 1) {
                buffer = "0";
            } else {
                buffer = buffer.slice(0, -1);
            }

            break;
        case "+":
        case "-":
        case "÷":
        case "×":
            handleMath(symbol);
    }
}

function flushOperation(intBuffer) {
    if (previousOperator === "+") {
        runningTotal += intBuffer;
    } else if (previousOperator === "-") {
        runningTotal -= intBuffer;
    } else if (previousOperator === "÷") {
        if (intBuffer === 0) {
            runningTotal = Infinity;
            buffer = "Infinity";
        } else {
            runningTotal /= intBuffer;
        }
    } else if (previousOperator === "×") {
        runningTotal *= intBuffer;
    }
}

function handleMath(val) {
    if (buffer === "0") {
        return;
    }

    const intBuffer = parseInt(buffer);
    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }

    previousOperator = val;
    buffer = "0";
}

function init() {
    document.querySelector(".calc-btns").addEventListener("click", (e) => {
        if (e.target.classList.contains("calc-btn")) {
            btnClick(e.target.innerText);
        }
    });
}

function reRender() {
    screen.innerText = buffer;
}

init();
