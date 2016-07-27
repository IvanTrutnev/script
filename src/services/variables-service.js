(function(angular){
    "use strict";
    angular.module('mathApp')
        .service('variableService', VariableService);

    function VariableService(){
        let service = this;

        service.processVariableValues = processVariableValues;
        service.resetVariableValues = resetVariableValues;
        service.checkListOfVariablesChanges = checkListOfVariablesChanges;
        service.getFunctionArgs = getFunctionArgs;

        /**
         * Function that check for variables without values
         * If all ok it's return promise without data
         * If there are variables without values its throw error (reject promise)
         *                  (message='Variables a, b, c have no values! Add it!')
         *
         * @param {object} variablesValues - object contains variables values {'someVariable': [1, 2, 3]}
         * @returns {Promise}
         */
        function processVariableValues(variablesValues) {
            return new Promise((resolve) => {
                let isError = false;
                let emptyVariables = [];

                for (let variable in variablesValues) {
                    let values = variablesValues[variable];

                    if (values.length === 0) {
                        isError = true;
                        emptyVariables.push(variable);

                    }
                }

                if (isError) {
                    throw new Error(`Variables ${emptyVariables} have no values! Add it!`)
                }
                resolve();
            });
        }

        /**
         * @param {object} variablesValues - object contains variables values {'someVariable': ['1', '2', '3']}
         * @returns  {object} - object contains variables values {'someVariable': []}
         */
        function resetVariableValues(variablesValues) {
            for (let variable in variablesValues) {
                variablesValues[variable] = [];
            }
            return variablesValues;
        }

        /**
         * Function that delete all variables values for variables, that exist in old list of variables but don't exist
         *                                                                                                   in current
         *
         * @param {array} newVariables - array of current variables
         * @param {array} oldVariables - array of old variables
         * @param {object} variablesValues variablesValues - object contains variables values
         *                                                   {'someVariable': [1, 2, 3]}
         * @returns {object}
         */
        function checkListOfVariablesChanges(newVariables, oldVariables, variablesValues) {
            if (newVariables !== null) {
                for(let variable of newVariables) {
                    if (!(variable in variablesValues)) {
                        variablesValues[variable] = [];
                    }
                }

                if (oldVariables !== null && oldVariables !== undefined) {
                    let deletedVariables = arrayDiff(oldVariables, newVariables);

                    for (let deletedVariable of deletedVariables) {
                        delete variablesValues[deletedVariable];
                    }
                }
            }

            return variablesValues;
        }

        function getFunctionArgs(variablesValues) {
            let functionArgs = [];
            let variations = 1;
            angular.forEach(variablesValues, (value, key) => {
                variations *= value.length;
            });
            for(let i = 0; i < variations; i++) {
                functionArgs.push({});
                angular.forEach(variablesValues, (value, key) => {
                    functionArgs[i][key] = 0;
                });
            }
            let loop = variations;
            angular.forEach(variablesValues, (values, key) => {
                loop /= values.length;
                let index = 0;
                for(let j = 0; j<(variations/values.length)/loop; j++) {
                    for (let value of values) {
                        for (let i = 0; i < loop; i++) {
                            functionArgs[index][key] = value;
                            index++;
                        }
                    }
                }
            });

            return functionArgs;

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
