window.onload = function() {
    const calcButtons = Array.from(document.querySelectorAll('.calc_button'));
    const formValue = document.querySelector('.calc_value');

    let insideRoot = false;  // Флаг для отслеживания, находимся ли мы внутри скобок после √

    calcButtons.forEach((button) => {
        button.addEventListener('click', function(evt) {
            const buttonType = button.getAttribute('data-type');
            const buttonValue = button.getAttribute('data-value');

            const specialSymbols = ['√', 'sin', 'cos', 'tan'];

            if (buttonType === 'number') {
                if (insideRoot) {
                    // Найти последнюю закрывающую скобку и вставить перед ней
                    let currentText = formValue.innerText;
                    let insertPosition = currentText.lastIndexOf(')');
                    formValue.innerText = currentText.slice(0, insertPosition) + buttonValue + currentText.slice(insertPosition);
                } else {
                    formValue.innerText += buttonValue;
                }
            } else if (buttonType === 'operation') {
                if (specialSymbols.includes(buttonValue)) {
                    formValue.innerText += buttonValue +'()';
                    insideRoot = true;  // Устанавливаем флаг, что мы теперь внутри скобок
                } else {
                    formValue.innerText += buttonValue;
                    insideRoot = false;  // Сбрасываем флаг при любом другом операторе
                }
            } else if (buttonType === 'calculate') {
                try {
                    formValue.innerText = calculateExpression(formValue.innerText);
                    insideRoot = false;  // Сбрасываем флаг после вычисления
                } catch (error) {
                    console.error('Ошибка вычисления выражения:', error);
                    formValue.innerText = 'Ошибка';
                }
            } else if (buttonType === 'clear') {
                formValue.innerText = '';
                insideRoot = false;  // Сбрасываем флаг при очистке
            }
        });
    });
}

// Функция для безопасного вычисления математического выражения
function calculateExpression(expression) {
    // Разрешены только цифры и операторы +, -, *, /, (, ), √, sin, cos, tan
    const allowedCharacters = /^[0-9+\-*/().√sintancos\s]+$/;
    if (!allowedCharacters.test(expression)) {
        throw new Error('Недопустимые символы в выражении');
    }

    // Заменяем √(x) на Math.sqrt(x), sin(x) на Math.sin(x), cos(x) на Math.cos(x), tan(x) на Math.tan(x)
    expression = expression.replace(/√\(/g, 'Math.sqrt(');
    expression = expression.replace(/sin\(/g, 'Math.sin(');
    expression = expression.replace(/cos\(/g, 'Math.cos(');
    expression = expression.replace(/tan\(/g, 'Math.tan(');

    // Функция создается с телом выражения для вычисления
    const safeFunction = new Function(`return (${expression})`);
    return safeFunction();
}