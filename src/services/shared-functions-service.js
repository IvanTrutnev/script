(function(angular){
    "use strict";
    angular.module('mathApp')
        .factory('sharedFunctionsService', SharedFunctionsService);

    function SharedFunctionsService($firebaseArray, $firebaseAuth, $q){
        let functionImagesRef = firebase.storage().ref('images/functions/'),
            sharedFunctionsRef = firebase.database().ref('functions/shared'),
            sharedFunctions = $firebaseArray(sharedFunctionsRef),
            //functionImages = $firebaseArray(functionImagesRef),
            auth = $firebaseAuth(),
            user = null;

        auth.$onAuthStateChanged((firebaseUser) => {user = firebaseUser});

        return {
            shareFunction,
            getSharedFunctions,
            getSharedFunction,
            likeSharedFunction
        };

        function getSharedFunctions() {
            return $q((resolve, reject) => {
                sharedFunctions.$loaded()
                    .then(sharedFunctions => {
                        sharedFunctions.forEach((sharedFunction) => {
                            if (!sharedFunction.userLikeItId) {
                                sharedFunction.userLikeItId = [];
                            }
                        });
                        resolve(sharedFunctions);
                    })
                    .catch(error => {
                        console.error(error);
                        reject({message: 'Oops. Unable to load shared functions. Try later'});
                    })
            });
        }

        function getSharedFunction(key) {
            return $q((resolve, reject) => {
                getSharedFunctions()
                    .then(() => {
                        let sharedFunction = sharedFunctions.$getRecord(key);
                        if (sharedFunction !== null) {
                            if (!sharedFunction.userLikeItId) {
                                sharedFunction.userLikeItId = [];
                            }
                            resolve(sharedFunction);
                        }
                        reject({message: 'Unable to load shared function'});
                    })
                    .catch(() => {
                        reject({message: 'Unable to load shared function'});
                    });
            });
        }

        function shareFunction(rawFormula, formulaTex, variablesValues, user, chartConfig = null) {
            return $q((resolve, reject) => {
                let sharedFunction = {
                    userId: user.uid,
                    imageId: null,
                    userLikeItId: [],
                    userProfile: {
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    dateCreated: math.floor(Date.now()/1000),
                    rawFormula,
                    formulaTex,
                    variablesValues,
                    chartConfig
                };


                if (chartConfig === null) {
                    sharedFunctions.$add(sharedFunction)
                        .then(successShare(resolve))
                        .catch((error) => {
                            console.error(error); failedShare(reject);
                        });
                }
                else {
                    document.getElementById("line").toBlob((blob) => {
                        let image = blob;
                        let uploadTask = functionImagesRef.child(`${+Date.now()}${user.uid}.jpg`).put(image);
                        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                            () => {}, //nothing to do during uploading
                            (error) => {
                                console.error(error);
                                sharedFunctions.$remove(sharedFunction);
                                failedShare(reject);
                            },
                            () => {
                                sharedFunction.imageURL = uploadTask.snapshot.downloadURL;
                                sharedFunctions.$add(sharedFunction)
                                    .then((response) => {
                                        successShare(resolve);
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        failedShare(reject)
                                    });
                            }
                        );
                    });
                }
            });
        }

        function likeSharedFunction(sharedFormula) {
            return $q((resovle, reject) => {
                if (user === null) {
                    reject({message: 'You should be login in to like it!'});
                    return;
                }

                if (!sharedFormula.userLikeItId) {
                    sharedFormula.userLikeItId = [];
                }


                if (sharedFormula.userLikeItId.includes(user.uid)) {
                    let index = sharedFormula.userLikeItId.indexOf(user.uid);
                    delete sharedFormula.userLikeItId[index];

                    sharedFunctions.$save(sharedFormula)
                        .then(() => {
                            resovle({sharedFormula, message: null});
                        })
                        .catch((error) => {
                            console.error(error);
                            reject({message: 'Oops. Try unlike it later'});
                        });
                }
                else {
                    sharedFormula.userLikeItId.push(user.uid);

                    sharedFunctions.$save(sharedFormula)
                        .then(() => {
                            if (sharedFormula.userLikeItId.includes(sharedFormula.userId) && sharedFormula.userId === user.uid) {
                                resovle({sharedFormula, message: 'Самолайк хуже пидарастии!'})
                            }
                            resovle({sharedFormula, message: null});
                        })
                        .catch((error) => {
                            console.error(error);
                            reject({message: 'Oops. Try like it later'});
                        });
                }
            });
        }

        function failedShare(reject) {
            reject(({message: 'Oops. Error during sharing. Try later!'}));
        }
        function successShare(resolve) {
            resolve(({message: 'Formula successfully shared!'}));
        }
    }

})(angular);