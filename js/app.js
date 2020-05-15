/**
    Código para NextU
    Patrón módulo: Calculator

    Cumple con los siguientes requerimientos:

    1.  Permitir realizar las 4 operaciones básicas entre dos números racionales.
    2.  El mayor número de dígitos por cada operando y del resultado es 8.
    3.  Los resultados de todas las operaciones deben mostrarse sólo cuando se
        presione la tecla igual (=).
    4.  Permitir realizar operaciones en cadena, es decir que el resultado de una
        operación puede ser el primer operando de una operación siguiente.
    5.  Permitir la secuencia de operaciones al presionar el botón igual (=)
        consecutivamente después de una operación, repitiendo la operación y
        el segundo operando sobre el resultado obtenido.
    6.  Desarrolla la funcionalidad de la calculadora utilizando el patrón
        módulo, es decir que todo el código debe estar englobado en un objeto
        llamado Calculadora. Utiliza un método de inicialización que se encargue
        de ejecutar todas las otras funciones que se deben iniciar con la ejecución del programa.
    7.  La tecla presionada reduce su tamaño y vuelve a su forma original al soltarla.
    8.  Al presionar una tecla numérica, se muestre el número correspondiente en la pantalla,
        debes verificar si en la pantalla se encuentra sólo el número cero, que no se puedan
        agregar más números cero. Además debes hacer que si en pantalla está sólo el cero, al
        presionar otro número diferente, éste debe reemplazar al cero inicial.
    9.  Al presionar el botón ON/C se borren los números que estén en pantalla y se muestre
        sólo el número cero.
    10. Al presionar la tecla del punto, lo añada a la derecha del número actual que se
        muestra en pantalla. Debes verificar si el punto ya está o no en pantalla para no
        adicionarlo más de una vez.
    11. Método que añada el signo negativo al presionar la tecla +/- a un número en pantalla.
        Si el número sólo es un cero, no se debe agregar el signo, además debes verificar que
        si el signo menos ya está en pantalla, al presionar la tecla se borre.

    Métodos Adicionales

    1.  Escuchar las teclas del teclado para que interactuen con la calculadora.

    Se códifica en ingles porque se publicará públicamente.
    @author Daniel Valencia <11-05-2020>
*/

var Calculator = (function Calculator() {
    /**
     * @var display
     * Element HTML of the display
     */
    var display = document.getElementById('display')

    /**
     * Init the calculator
     * @author Daniel Valencia <11-05-2020>
     */
    function init() {
        removeSessionStorage()
        sessionStorage.number = 0
        sessionStorage.operationProgress = []
        sessionStorage.continueOperation = []
        print(0)
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
        var key = event.which || event.keyCode;
        key = String.fromCharCode(key)

        if (
            key == '+' ||
            key == '-' ||
            key == '*' ||
            key == '/'
        ) {
            addOperation(key)
        } else if (event.which == 13) {
            result()
        } else {
            renderNumber(key)
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
        plusMinus: plusMinus,
        renderKey: renderKey,
        renderKeyCalculator: renderKeyCalculator,
        addOperation: addOperation,
        result: result
    }
})();

/**
 * When the DOM content load
 * Init the calculator
 * Listen Keyboard
 * Listen numbers of the calculator
 */
document.addEventListener("DOMContentLoaded", function (event) {
    Calculator.init()

    document.onkeypress = Calculator.renderKey;

    var calculatorNumbers = document.querySelectorAll(".numberKey");

    for (var i = 0; i < calculatorNumbers.length; i++) {
        calculatorNumbers[i].onclick = Calculator.renderKeyCalculator;
    }
});