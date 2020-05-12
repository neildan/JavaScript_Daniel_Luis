/**
 * Patrón módulo Calculator
 * Se códifica en ingles porque será de dominio público
 * @author Daniel Valencia <11-05-2020>
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
        if (sessionStorage.number) sessionStorage.removeItem("number")
        if (sessionStorage.operationProgress) sessionStorage.removeItem("operationProgress")
        print(0)
    }

    /**
     * Render Number
     * @param Number value
     * @author Daniel Valencia <11-05-2020>
     */
    function renderNumber(value) {
        sessionStorage.number = validations(
            (!sessionStorage.number) ?
                String(value) :
                sessionStorage.number + String(value)
        )

        print(sessionStorage.number)
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
     * Validate input number
     * @param Mixed value
     * @return Number
     * @author Daniel Valencia <12-05-2020>
     */
    function validations(value){
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
    function validatePoint(value){
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
     * Print in display
     * @param Number value
     */
    function print(value) {
        display.innerHTML = value
    }

    return {
        init: init,
        plusMinus: plusMinus,
        renderNumber: renderNumber,
    }
})();

document.addEventListener("DOMContentLoaded", function (event) {
    Calculator.init()
});