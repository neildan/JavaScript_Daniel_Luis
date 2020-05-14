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
        removeSessionStorage()
        sessionStorage.number = 0
        sessionStorage.operationProgress = []
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
     * Render Number
     * @param Number value
     * @author Daniel Valencia <11-05-2020>
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
    function validationsNumber(value){
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
     * Add operation
     * @param String sign
     * @author Daniel Valencia <12-05-2020>
     */
    function addOperation(sign){
        if(validationsOperation(sign) == 'true'){
            var operations = []

            if (sessionStorage.operationProgress) {
                operations = JSON.parse(sessionStorage.operationProgress)
            }

            operations.push(Number(sessionStorage.number))
            operations.push(sign)

            sessionStorage.operationProgress = JSON.stringify(operations)

            sessionStorage.removeItem("number")
            print(0)
        }
    }

    /**
     * Validate input sign
     * @param String value
     * @return Boolean
     * @author Daniel Valencia <12-05-2020>
     */
    function validationsOperation(value){
        status = notOperationProgress()
        if(status) status = updateSign(value)
        return status
    }

    /**
     * If sessionStorage.number is nothing
     * And the current operation is nothing
     * @return Boolean
     * @author Daniel Valencia <12-05-2020>
     */
    function notOperationProgress(){
        var operations = sessionStorage.operationProgress

        if((!sessionStorage.number ||
            sessionStorage.number == 0) &&
            (!operations || JSON.parse(operations).length == 0)
        ){
            return false
        }
        return true
    }

    /**
     * If the last two elements are signs, then only the last will kept
     * @return Boolean
     * @author Daniel Valencia <12-05-2020>
     */
    function updateSign(sign){
        /**
         * If there isn't a number
         * And there is a operation in progress
         */
        if((!sessionStorage.number ||
            sessionStorage.number == 0) &&
            (JSON.parse(sessionStorage.operationProgress).length > 0)
        ){
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
    function result(){
        var operations = validationsResult()

        var result = validateQuantity(
            eval(operations.join(''))
        )

        removeSessionStorage()

        sessionStorage.number = result

        sessionStorage.continueOperation = JSON.stringify([
            operations[operations.length-1], // Number
            operations[operations.length-2], // Sign
        ])

        print(sessionStorage.number)
    }

    /**
     * Validations of the result
     * @returns Array
     * @author Daniel Valencia <13-05-2020>
     */
    function validationsResult(){
        var operations = []
        /*
        * If there is an operation in progress:
        * var operations will be operationProgress
        *
        * Else if there isn't any operation in progress,
        * but there is a recent result:
        * var operations will be continueOperation
        */
        if(sessionStorage.operationProgress){
            operations = JSON.parse(sessionStorage.operationProgress)

            if(sessionStorage.number && sessionStorage.number != 0){
                operations.push(sessionStorage.number)
            }else{
                operations.pop()
            }
        }else if(sessionStorage.continueOperation){
            operations = JSON.parse(sessionStorage.continueOperation)

            operations.push(sessionStorage.number)
        }
        return operations
    }

    /**
     * Remove all elements of sessionStorage
     * @author Daniel Valencia <12-05-2020>
     */
    function removeSessionStorage(){
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
        renderNumber: renderNumber,
        addOperation : addOperation,
        result : result
    }
})();

document.addEventListener("DOMContentLoaded", function (event) {
    Calculator.init()
});