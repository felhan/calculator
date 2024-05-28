window.onload = function() {
    const calcButtons = Array.from(document.querySelectorAll('.calc_button'));
    const formValue = document.querySelector('.calc_value');

    calcButtons.forEach((button) => {
        button.addEventListener('click', function(evt) {
            const buttonType = button.getAttribute('data-type');
            const buttonValue = button.getAttribute('data-value');

            if (buttonType === 'number') {
                if (formValue.innerText === '0') {
                    formValue.innerText = buttonValue;
                } else {
                    formValue.innerText += buttonValue;
                }
            } else if (buttonType === 'operation') {
                // Проверяем, что символ оператора еще не присутствует в выражении
                if ((buttonValue === '-' || buttonValue === '(' || buttonValue === ')') && !formValue.innerText.includes('-')) {
                    // Проверяем, равно ли formValue.innerText значению "0"
                    if (formValue.innerText === '0') {
                        formValue.innerText = '';
                        formValue.innerText += buttonValue;
                    } else {
                        formValue.innerText += buttonValue;
                    }
                } else if (!formValue.innerText.includes(buttonValue)) {
                    formValue.innerText += buttonValue;
                }
            } else if (buttonType === 'calculate') {
                try {
                    formValue.innerText = calculateExpression(formValue.innerText);
                } catch (error) {
                    console.error('Ошибка вычисления выражения:', error);
                    formValue.innerText = 'Ошибка';
                }
            } else if (buttonType === 'clear') {
                console.log('cleared');
                formValue.innerText = '0';
            }
        });
    });
}

// Функция для безопасного вычисления математического выражения
function calculateExpression(expression) {
    // Разрешены только цифры и операторы +, -, *, /, (, )
    const allowedCharacters = /^[0-9+\-*/().\s]+$/;
    if (!allowedCharacters.test(expression)) {
        throw new Error('Недопустимые символы в выражении');
    }

    // Функция создается с телом выражения для вычисления
    const safeFunction = new Function(`return (${expression})`);
    return safeFunction();
}
