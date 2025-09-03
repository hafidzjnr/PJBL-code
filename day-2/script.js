const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator_key');
const display = calculator.querySelector('.calculator_display');

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  let result = '';

  if (operator === 'add') {
    result = firstNum + secondNum;
  } else if (operator === 'subtract') {
    result = firstNum - secondNum;
  } else if (operator === 'multiply') {
    result = firstNum * secondNum;
  } else if (operator === 'divide') {
    result = firstNum / secondNum;
  }

  return result;
};

keys.addEventListener('click', e => {
  if (e.target.matches('button')) {
    const key = e.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    const displayedNum = display.textContent;
    const previousKeyType = calculator.dataset.previousKeyType;

    // Hapus kelas 'is-depressed' dari semua tombol operator
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));

    // Aksi tombol angka
    if (!action) {
      if (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
        display.textContent = keyContent;
      } else {
        display.textContent = displayedNum + keyContent;
      }
      calculator.dataset.previousKeyType = 'number';
      calculator.querySelector('[data-action="clear"]').textContent = 'C';
    }

    // Aksi tombol operator
    if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
      const firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      const secondValue = displayedNum;

      if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
        const calcValue = calculate(firstValue, operator, secondValue);
        display.textContent = calcValue;
        calculator.dataset.firstValue = calcValue;
      } else {
        calculator.dataset.firstValue = displayedNum;
      }

      key.classList.add('is-depressed');
      calculator.dataset.previousKeyType = 'operator';
      calculator.dataset.operator = action;
    }

    // Aksi tombol desimal
    if (action === 'decimal') {
      if (!displayedNum.includes('.')) {
        display.textContent = displayedNum + '.';
      } else if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
        display.textContent = '0.';
      }
      calculator.dataset.previousKeyType = 'decimal';
    }

    // Aksi tombol clear
    if (action === 'clear') {
      if (key.textContent === 'C') {
        display.textContent = '0';
        key.textContent = 'AC';
      } else {
        calculator.dataset.firstValue = '';
        calculator.dataset.modValue = '';
        calculator.dataset.operator = '';
        calculator.dataset.previousKeyType = '';
        display.textContent = '0';
        key.textContent = 'AC';
      }
      calculator.dataset.previousKeyType = 'clear';
    }

    // Aksi tombol equals
    if (action === 'calculate') {
      let firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      let secondValue = displayedNum;

      if (firstValue) {
        if (previousKeyType === 'calculate') {
          firstValue = displayedNum;
          secondValue = calculator.dataset.modValue;
        }

        display.textContent = calculate(firstValue, operator, secondValue);
      }
      
      calculator.dataset.modValue = secondValue;
      calculator.dataset.previousKeyType = 'calculate';
      calculator.querySelector('[data-action="clear"]').textContent = 'AC';
    }
  }
});