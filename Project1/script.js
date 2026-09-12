/**
 * ============================================================================
 * Modern Responsive Calculator
 * Vanilla JavaScript Implementation without eval()
 * ============================================================================
 */

// State Management Variables
let currentInput = '0';          // Current number string being entered
let expressionTokens = [];       // Array of confirmed tokens (numbers and operators)
let isCalculated = false;        // True if the current display is the result of '='
let hasError = false;            // True if an error (like division by zero) occurred
let historyText = '';            // Text displayed in the history/formula bar

// DOM Elements
const historyDisplay = document.getElementById('historyDisplay');
const currentDisplay = document.getElementById('currentDisplay');
const allButtons = document.querySelectorAll('.btn');

/**
 * Updates the screen displays based on the current calculator state.
 */
function updateDisplay() {
  // Update the top history expression line
  if (historyText) {
    historyDisplay.textContent = historyText;
  } else if (expressionTokens.length > 0) {
    historyDisplay.textContent = expressionTokens.join(' ');
  } else {
    historyDisplay.textContent = '';
  }

  // Update the main current value display line
  if (hasError) {
    currentDisplay.textContent = 'Error';
    currentDisplay.classList.add('error-text');
  } else {
    currentDisplay.classList.remove('error-text');
    currentDisplay.textContent = currentInput === '' ? '0' : currentInput;
  }
}

/**
 * Appends a numeric digit (0-9) to the current input.
 * Handles state resets following errors or completed calculations.
 * 
 * @param {string} digit - The digit string ('0' - '9')
 */
function appendDigit(digit) {
  // Reset completely if recovering from an error
  if (hasError) {
    clearAll();
  }

  // If a calculation was just completed, typing a new number starts a new calculation
  if (isCalculated) {
    currentInput = digit;
    expressionTokens = [];
    historyText = '';
    isCalculated = false;
    updateDisplay();
    return;
  }

  // Replace default '0' with the new digit, unless '0' is pressed again
  if (currentInput === '0') {
    currentInput = digit;
  } else if (currentInput === '-0') {
    currentInput = '-' + digit;
  } else {
    // Limit input length to prevent display overflow
    if (currentInput.length >= 16) return;
    currentInput += digit;
  }

  updateDisplay();
}

/**
 * Appends a decimal point (.) to the current input.
 * Prevents multiple decimals within the same number.
 */
function appendDecimal() {
  if (hasError) {
    clearAll();
  }

  // If calculation was just completed, starting with a decimal initiates a new number: '0.'
  if (isCalculated) {
    currentInput = '0.';
    expressionTokens = [];
    historyText = '';
    isCalculated = false;
    updateDisplay();
    return;
  }

  // Prevent multiple decimal points in the current operand
  if (currentInput.includes('.')) {
    return;
  }

  if (currentInput === '' || currentInput === '-') {
    currentInput += '0.';
  } else {
    currentInput += '.';
  }

  updateDisplay();
}

/**
 * Appends an arithmetic operator (+, -, ×, ÷) to the expression.
 * Supports operation chaining and handles consecutive operator replacements.
 * 
 * @param {string} operator - The arithmetic operator
 */
function appendOperator(operator) {
  if (hasError) {
    return;
  }

  // Allow negative sign at the very beginning of a calculation
  if (currentInput === '0' && expressionTokens.length === 0 && operator === '-') {
    currentInput = '-';
    updateDisplay();
    return;
  }

  // If chaining directly after pressing '=', use the result as the first operand
  if (isCalculated) {
    expressionTokens = [currentInput, operator];
    currentInput = '';
    historyText = '';
    isCalculated = false;
    updateDisplay();
    return;
  }

  // If a number has been entered, push both the number and the operator
  if (currentInput !== '' && currentInput !== '-') {
    expressionTokens.push(currentInput);
    expressionTokens.push(operator);
    currentInput = '';
    historyText = '';
  } else if (expressionTokens.length > 0) {
    // If an operator was already selected and another operator is pressed, replace it
    expressionTokens[expressionTokens.length - 1] = operator;
  }

  updateDisplay();
}

/**
 * Deletes the last entered character (Backspace functionality).
 */
function deleteLastChar() {
  if (hasError || isCalculated) {
    clearAll();
    return;
  }

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else if (currentInput.length === 1 && currentInput !== '0') {
    currentInput = '0';
  } else if (currentInput === '' && expressionTokens.length > 0) {
    // If current input is empty, step back into the expression:
    // remove operator and restore the preceding operand for editing
    expressionTokens.pop(); // Remove operator
    if (expressionTokens.length > 0) {
      currentInput = expressionTokens.pop(); // Restore operand
    }
  }

  updateDisplay();
}

/**
 * Resets all calculator states and clears the display.
 */
function clearAll() {
  currentInput = '0';
  expressionTokens = [];
  historyText = '';
  isCalculated = false;
  hasError = false;
  updateDisplay();
}

/**
 * Performs a single binary arithmetic operation using a switch statement.
 * Handles division by zero safely.
 * 
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @param {string} op - Arithmetic operator (+, -, ×, ÷)
 * @returns {number|string} The numeric result, or 'Error' for division by zero
 */
function operate(a, b, op) {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
    case '*':
      return a * b;
    case '÷':
    case '/':
      if (b === 0) {
        return 'Error';
      }
      return a / b;
    default:
      return b;
  }
}

/**
 * Rounds numbers to remove floating point precision artifacts (e.g. 0.1 + 0.2 = 0.3).
 * Formats large or very small numbers nicely.
 * 
 * @param {number} num - The raw number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
  if (isNaN(num) || !isFinite(num)) {
    return 'Error';
  }

  // Round to 10 decimal places to eliminate IEEE-754 precision issues
  const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10;

  // Convert to string
  const str = rounded.toString();

  // If number exceeds 14 characters, format in exponential notation
  if (str.length > 14) {
    return rounded.toExponential(7);
  }

  return str;
}

/**
 * Evaluates an array of expression tokens following standard mathematical
 * operator precedence (Multiplication and Division before Addition and Subtraction)
 * without using eval().
 * 
 * @param {string[]} tokens - Array of numbers and operators, e.g. ['5', '+', '3', '×', '2']
 * @returns {string} The final calculated result or 'Error'
 */
function evaluateExpression(tokens) {
  if (tokens.length === 0) return '0';

  // Make a working copy of the tokens array
  let workingTokens = [...tokens];

  // --------------------------------------------------------------------------
  // Pass 1: Handle high-precedence operators (Multiplication '×' and Division '÷')
  // --------------------------------------------------------------------------
  let i = 0;
  while (i < workingTokens.length) {
    const token = workingTokens[i];
    if (token === '×' || token === '*' || token === '÷' || token === '/') {
      const left = parseFloat(workingTokens[i - 1]);
      const right = parseFloat(workingTokens[i + 1]);

      if (isNaN(left) || isNaN(right)) {
        return 'Error';
      }

      const result = operate(left, right, token);
      if (result === 'Error') {
        return 'Error';
      }

      // Replace left operand, operator, and right operand with computed result
      workingTokens.splice(i - 1, 3, result.toString());
      // Step back index to re-evaluate at this position
      i -= 1;
    } else {
      i++;
    }
  }

  // --------------------------------------------------------------------------
  // Pass 2: Handle low-precedence operators (Addition '+' and Subtraction '-')
  // --------------------------------------------------------------------------
  i = 0;
  while (i < workingTokens.length) {
    const token = workingTokens[i];
    if (token === '+' || token === '-') {
      const left = parseFloat(workingTokens[i - 1]);
      const right = parseFloat(workingTokens[i + 1]);

      if (isNaN(left) || isNaN(right)) {
        return 'Error';
      }

      const result = operate(left, right, token);
      if (result === 'Error') {
        return 'Error';
      }

      workingTokens.splice(i - 1, 3, result.toString());
      i -= 1;
    } else {
      i++;
    }
  }

  // Return the remaining single value formatted
  const finalNum = parseFloat(workingTokens[0]);
  return formatNumber(finalNum);
}

/**
 * Calculates the result of the full expression.
 * Updates history and display accordingly.
 */
function calculate() {
  if (hasError) return;

  // Build the complete token list for calculation
  let fullTokens = [...expressionTokens];

  if (currentInput !== '' && currentInput !== '-') {
    fullTokens.push(currentInput);
  } else if (fullTokens.length > 0) {
    // If the expression ended with a trailing operator, remove it
    fullTokens.pop();
  }

  // Nothing to compute if no tokens or just one number
  if (fullTokens.length <= 1) {
    return;
  }

  // Store the full formula string for the history display line
  historyText = fullTokens.join(' ') + ' =';

  // Evaluate the expression without eval()
  const result = evaluateExpression(fullTokens);

  if (result === 'Error') {
    hasError = true;
    currentInput = 'Error';
  } else {
    currentInput = result;
    isCalculated = true;
  }

  expressionTokens = [];
  updateDisplay();
}

/**
 * Routes user actions from clicks or keyboard events to the appropriate function.
 * 
 * @param {string} action - The action type ('number', 'operator', 'equals', 'clear', 'delete', 'decimal')
 * @param {string} [value] - Optional value associated with the action (e.g. digit or operator symbol)
 */
function handleAction(action, value) {
  switch (action) {
    case 'number':
      appendDigit(value);
      break;
    case 'decimal':
      appendDecimal();
      break;
    case 'operator':
      appendOperator(value);
      break;
    case 'equals':
      calculate();
      break;
    case 'clear':
      clearAll();
      break;
    case 'delete':
      deleteLastChar();
      break;
    default:
      console.warn(`Unhandled action: ${action}`);
      break;
  }
}

/**
 * Handles physical keyboard shortcuts and maps them to calculator actions.
 * Provides temporary active button highlight for visual feedback.
 * 
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyPress(event) {
  const key = event.key;

  // Find matching button element for visual press feedback
  let matchingBtn = null;

  if (key >= '0' && key <= '9') {
    matchingBtn = document.querySelector(`.btn[data-key="${key}"]`);
    handleAction('number', key);
  } else if (key === '.') {
    matchingBtn = document.querySelector(`.btn[data-key="."]`);
    handleAction('decimal', '.');
  } else if (key === '+') {
    matchingBtn = document.querySelector(`.btn[data-key="+"]`);
    handleAction('operator', '+');
  } else if (key === '-') {
    matchingBtn = document.querySelector(`.btn[data-key="-"]`);
    handleAction('operator', '-');
  } else if (key === '*' || key === 'x' || key === 'X') {
    matchingBtn = document.querySelector(`.btn[data-key="*"]`);
    handleAction('operator', '×');
  } else if (key === '/') {
    event.preventDefault(); // Prevent Firefox quick-find shortcut
    matchingBtn = document.querySelector(`.btn[data-key="/"]`);
    handleAction('operator', '÷');
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault(); // Prevent default form submission or button focus
    matchingBtn = document.querySelector(`.btn[data-key="Enter"]`);
    handleAction('equals');
  } else if (key === 'Backspace') {
    matchingBtn = document.querySelector(`.btn[data-key="Backspace"]`);
    handleAction('delete');
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    matchingBtn = document.querySelector(`.btn[data-key="Escape"]`);
    handleAction('clear');
  }

  // Trigger tactile button animation on keyboard press
  if (matchingBtn) {
    matchingBtn.classList.add('is-pressed');
    setTimeout(() => {
      matchingBtn.classList.remove('is-pressed');
    }, 120);
  }
}

/**
 * Initializes event listeners on buttons using a loop,
 * and sets up keyboard listeners on the window.
 */
function init() {
  // Use a loop to attach click event listeners to all buttons
  allButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const value = button.dataset.value;
      handleAction(action, value);
    });
  });

  // Attach keyboard event listener
  window.addEventListener('keydown', handleKeyPress);

  // Initial display setup
  updateDisplay();
}

// Start calculator on script load
init();
