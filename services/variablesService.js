(function(angular){
    "use strict";
    angular.module('mathApp')
        .service('variableService', VariableService);

    function VariableService(){
        let service = this;

        service.processVariableValues = processVariableValues;
        service.resetVariableValues = resetVariableValues;
        service.checkListOfVariablesChanges = checkListOfVariablesChanges;

        function processVariableValues(variablesValues) {
            let isError = false;
            let emptyVariables = [];

            for (let variable in variablesValues) {
                let values = variablesValues[variable];

                if (values.length === 0) {
                    isError = true;
                    emptyVariables.push(variable);

                }
                else {
                    variablesValues[variable] = parseVariableValues(values);
                }
            }

            return {variablesValues, emptyVariables, isError};
        }

        function resetVariableValues(variablesValues) {
            for (let variable in variablesValues) {
                variablesValues[variable] = [];
            }
            return variablesValues;
        }

        function checkListOfVariablesChanges(newValue, oldValue, variablesValues) {
            if (newValue !== null) {
                for(let variable of newValue) {
                    if (!(variable in variablesValues)) {
                        variablesValues[variable] = [];
                    }
                }

                if (oldValue !== null) {
                    let deletedVariables = arrayDiff(oldValue, newValue);

                    for (let deletedVariable of deletedVariables) {
                        delete variablesValues[deletedVariable];
                    }
                }
            }

            return variablesValues;
        }

        function parseVariableValues(variableValues) {
            let parsedValues = [];
            for (let value of variableValues) {
                parsedValues.push(parseFloat(value));
            }
            parsedValues.sort((a, b) => (a < b) ? -1 : 1 );
            return parsedValues;
        }

        function arrayDiff(firstArray, secondArray) {
            return firstArray.filter(value => secondArray.indexOf(value) < 0);
        }
    }
})(angular);
