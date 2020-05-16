/**
    |--------------------------------------------------------------------------
    | Código para NextU - Patrón módulo: Calculator
    |--------------------------------------------------------------------------
    |
    | Tiene las siguientes funcionalidades:
    |
    | 1) La tecla presionada reduce su tamaño y vuelve a su forma original al soltarla.
    | 2) Al presionar el boton punto, permite manejar decimales.
    | 3) Al presionar el botón 'ON/C', se borra los números que estén en pantalla.
    | 4) Al presionar una tecla numérica, se muestra el número correspondiente en pantalla.
    | 5) Al presionar la tecla '+/-', se añade el signo negativo a un número en pantalla.
    | 6) Permite realizar las 4 operaciones básicas entre dos números racionales.
    | 7) Al presionar la tecla '=', se muestra el resultado de todas las operaciones.
    | 8) El mayor número de dígitos por cada operando y del resultado es 8.
    | 9) Permite realizar operaciones en cadena.
    | 10)Permitir la secuencia de operaciones al presionar el botón igual (=).
    |
    |--------------------------------------------------------------------------
    | Adicional
    |--------------------------------------------------------------------------
    |
    | 1) Escucha las teclas del teclado para que interactuen con la calculadora.
    | 2) Se códifica en ingles porque se publicará públicamente
    |
    |--------------------------------------------------------------------------
    | @author Daniel Valencia <danielfelipeluis@outlook>
    |--------------------------------------------------------------------------
    */

var Calculator = (function Calculator() {
    /**
     * @var display
     * Element HTML of the display
     */
    var display = document.getElementById('display')
    /**
     * @var operationSigns
     * Basic operations signs
     */
    var operationSigns = ['+', '-', '*', '/']

    /**
     * Init the calculator
     * Listen Keyboard
     * Listen numbers of the calculator
     * @author Daniel Valencia <11-05-2020>
     */
    function init() {
        removeSessionStorage()
        sessionStorage.point = false
        sessionStorage.number = 0
        sessionStorage.operationProgress = []
        sessionStorage.continueOperation = []
        print(0)
    }

    /**
     * Active the keyboard listeners
     * Listen Keyboard
     * Listen numbers of the calculator
     * @author Daniel Valencia <15-05-2020>
     */
    function keyListeners() {
        document.onkeypress = renderKey;

        var calculatorNumbers = document.querySelectorAll(".numberKey");

        for (var i = 0; i < calculatorNumbers.length; i++) {
            calculatorNumbers[i].onclick = renderKeyCalculator;
        }
    }

    /**
     * Change the sign of the number
     * @author Daniel Valencia <11-05-2020>
     */
    function plusMinus() {
        if (sessionStorage.number) {
            sessionStorage.number = Number(sessionStorage.number) * -1
            print(sessionStorage.number)
        }
    }

    /**
     * Render the key of the keyboard
     * @param Event event
     * @author Daniel Valencia <14-05-2020>
     */
    function renderKey(event) {
        var keyEnter = 13, keyPoint = '.', keyEqual = '='

        var key = event.which || event.keyCode;
        key = String.fromCharCode(key)

        /**
         * The options are:
         * 1) A basic operation sign
         * 2) The button enter or equal
         * 3) A point
         * 4) A Number
         */
        if (
            operationSigns.indexOf(key) != -1
        ) {
            addOperation(key)

        } else if (
            event.which == keyEnter ||
            keyEqual == key
        ) {
            key = keyEqual
            result()

        } else if (
            key == keyPoint
        ) {
            addPoint()

        } else if (
            isFinite(key)
        ) {

            renderNumber(key)
        }
        pressKey(key)
    }

    /**
     * Key pressed animation
     * @param String key
     */
    function pressKey(key) {
        var idElement, interval, count = 0

        switch (key) {
            case '+':
                idElement = 'mas'
                break;
            case '-':
                idElement = 'menos'
                break;
            case '*':
                idElement = 'por'
                break;
            case '/':
                idElement = 'dividido'
                break;
            case '=':
                idElement = 'igual'
                break;
            case '.':
                idElement = 'punto'
                break;
            default:
                idElement = null
                break;
        }

        if (!idElement && isFinite(key)) idElement = key

        if (idElement) {
            var element = document.getElementById(idElement)

            interval = setInterval(function () {
                count++
                element.classList.toggle("keyPressed")
                if (count == 2) clearInterval(interval);
            }, 100);
        }
    }

    /**
     * Render the key of the calculator
     * @author Daniel Valencia <14-05-2020>
     */
    function renderKeyCalculator() {
        var key = this.getAttribute('alt')
        renderNumber(key)
    }

    /**
     * Render Number
     * @param Mixed Value
     * @author Daniel Valencia <14-05-2020>
     */
    function renderNumber(value) {
        sessionStorage.number = validationsNumber(
            (!sessionStorage.number) ?
                String(value) :
                sessionStorage.number + String(value)
        )

        print(sessionStorage.number)
    }

    /**
     * Validate input number
     * @param Mixed value
     * @return Number
     * @author Daniel Valencia <12-05-2020>
     */
    function validationsNumber(value) {
        value = validatePoint(value)
        value = validateQuantity(value)
        return parseFloat(value)
    }

    /**
     * Validate: only one point by number
     * @param Mixed value
     * @return Number
     * @author Daniel Valencia <12-05-2020>
     */
    function validatePoint(value) {
        value = String(value)
        if (
            value.length > 1 &&
            value.indexOf(".") == -1 &&
            sessionStorage.point &&
            sessionStorage.point == 'true'
        ) {
            value = eval(value.substr(0, value.length - 1) + "." + value.substr(-1))
        }
        return value
    }

    /**
     * Validate: quantity a number's digits
     * @param Mixed value
     * @return Number
     * @author Daniel Valencia <11-05-2020>
     */
    function validateQuantity(value) {
        var quantityDigit = 8

        if (numDigits(value) > quantityDigit) {
            var valueString = String(value)

            if (valueString.substr(0, 1) == '-') quantityDigit++
            value = Number(valueString.substr(0, quantityDigit))
        }

        return value
    }

    /**
     * Get quantity of a number's digits
     * @param Mixed x
     * @return Number
     */
    function numDigits(x) {
        x = Number(String(x).replace(/[^0-9]/g, ''));
        return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1;
    }

    /**
     * Add point a number
     * @author Daniel Valencia <15-05-2020>
     */
    function addPoint() {
        if (!sessionStorage.number) sessionStorage.number = 0

        if ((!sessionStorage.point) ||
            (sessionStorage.point == 'false')
        ) {
            sessionStorage.point = true
            print(String(sessionStorage.number) + '.')
        } else {
            sessionStorage.point = false
            print(sessionStorage.number)
        }
    }

    /**
     * Add operation
     * @param String sign
     * @author Daniel Valencia <12-05-2020>
     */
    function addOperation(sign) {
        if (validationsOperation(sign) == 'true') {
            var operations = []

            if (sessionStorage.operationProgress) {
                operations = JSON.parse(sessionStorage.operationProgress)
            }

            operations.push(Number(sessionStorage.number))
            operations.push(sign)

            sessionStorage.operationProgress = JSON.stringify(operations)

            sessionStorage.removeItem("number")
            sessionStorage.removeItem("point")
            sessionStorage.removeItem("continueOperation")
            print('')
        }
    }

    /**
     * Validate input sign
     * @param String value
     * @return Boolean
     * @author Daniel Valencia <12-05-2020>
     */
    function validationsOperation(value) {
        status = notOperationProgress()
        if (status) status = updateSign(value)
        return status
    }

    /**
     * If sessionStorage.number is nothing
     * And the current operation is nothing
     * @return Boolean
     * @author Daniel Valencia <12-05-2020>
     */
    function notOperationProgress() {
        var operations = sessionStorage.operationProgress

        if ((!sessionStorage.number ||
            sessionStorage.number == 0) &&
            (!operations || JSON.parse(operations).length == 0)
        ) {
            return false
        }
        return true
    }

    /**
     * If the last two elements are signs, then only the last will kept
     * @return Boolean
     * @author Daniel Valencia <12-05-2020>
     */
    function updateSign(sign) {
        /**
         * If there isn't a number
         * And there is a operation in progress
         */
        if ((!sessionStorage.number ||
            sessionStorage.number == 0) &&
            (JSON.parse(sessionStorage.operationProgress).length > 0)
        ) {
            var operations = JSON.parse(sessionStorage.operationProgress)

            operations.pop()
            operations.push(sign)

            sessionStorage.operationProgress = JSON.stringify(operations)
            return false
        }
        return true
    }

    /**
     * Make the operation
     * @author Daniel Valencia <12-05-2020>
     */
    function result() {
        var operations = validationsResult()

        if (operations.length > 0) {
            var result = validateQuantity(
                eval(operations.join(''))
            )

            sessionStorage.removeItem("operationProgress")

            sessionStorage.number = result

            var continueOperation = (sessionStorage.continueOperation) ?
                JSON.parse(sessionStorage.continueOperation) : []

            if (continueOperation.length == 0) {
                sessionStorage.continueOperation = JSON.stringify([
                    operations[operations.length - 2], // Sign
                    operations[operations.length - 1], // Number
                ])
            }

            print(sessionStorage.number)
        }
    }

    /**
     * Validations of the result
     * If there is an operation in progress:
     * var operations will be operationProgress.
     * Else if there isn't any operation in progress,
     * but there is a recent result:
     * var operations will be continueOperation.
     * @returns Array
     * @author Daniel Valencia <13-05-2020>
     */
    function validationsResult() {
        var operations = []

        if (sessionStorage.operationProgress) {
            operations = JSON.parse(sessionStorage.operationProgress)

            if (sessionStorage.number && sessionStorage.number != 0) {
                operations.push(sessionStorage.number)
            } else {
                operations.pop()
            }
        } else if (sessionStorage.continueOperation) {
            operations = JSON.parse(sessionStorage.continueOperation)

            operations.unshift(sessionStorage.number)
        }
        return operations
    }

    /**
     * Remove all elements of sessionStorage
     * @author Daniel Valencia <12-05-2020>
     */
    function removeSessionStorage() {
        if (sessionStorage.point) sessionStorage.removeItem("point")
        if (sessionStorage.number) sessionStorage.removeItem("number")
        if (sessionStorage.operationProgress) sessionStorage.removeItem("operationProgress")
        if (sessionStorage.continueOperation) sessionStorage.removeItem("continueOperation")
    }

    /**
     * Print in display
     * @param Number value
     */
    function print(value) {
        display.innerHTML = value
    }

    return {
        init: init,
        keyListeners: keyListeners,
        plusMinus: plusMinus,
        renderKey: renderKey,
        renderKeyCalculator: renderKeyCalculator,
        addOperation: addOperation,
        addPoint: addPoint,
        result: result
    }
})();

/**
 * When the DOM content load
 * Init the calculator and the keyboard listeners
 */
document.addEventListener("DOMContentLoaded", function (event) {
    Calculator.init()
    Calculator.keyListeners()
});