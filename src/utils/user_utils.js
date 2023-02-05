


const hide_props_in_js_object = (jsObject, fields) => {
    for(let prop of fields) {
        delete jsObject[prop]
    }

    return jsObject
}

/**
 * 
 * @param {string} currentUserId 
 * @param {string} otherUserId 
 * @param {Array} currentUserArr 
 * @param {Array} otherUserArr 
 */
const addIDsToArray_double = (currentUserId, otherUserId, currentUserArr, otherUserArr) => {
    otherUserArr.push(currentUserId.toString())
    currentUserArr.push(otherUserId.toString())
}


/**
 * 
 * @param {string} userId 
 * @param {Array} array 
 */
const addIDsToArray = (userId, array) => {
    array.push(userId.toString())
}

/**
 * 
 * @param {string} currentUserId 
 * @param {string} otherUserId 
 * @param {Array?} currentUserArr 
 * @param {Array?} otherUserArr 
 */
const removeIDsFromArray_double = (currentUserId, otherUserId, currentUserArr, otherUserArr) => {
    
    const currentUserIndex = otherUserArr !== null ? otherUserArr.indexOf(currentUserId.toString()) : -1
    const otherUserIndex = currentUserArr !== null ? currentUserArr.indexOf(otherUserId.toString()) : -1

    if(currentUserIndex != -1 || otherUserIndex != -1) {
        if(otherUserArr != null) {
            otherUserArr.splice(currentUserIndex, 1)
        }
        if(currentUserArr != null) {
            currentUserArr.splice(otherUserIndex, 1)
        }
    }
}

const removeIDFromArray = (id, arr) => {
    
    const currentUserIndex = arr !== null ? arr.indexOf(id.toString()) : -1

    if(currentUserIndex != -1) {
        if(arr != null) {
            arr.splice(currentUserIndex, 1)
        }
    }
}

const findIndexOfObj = (val, arr) => {
    for(let i=0; i < arr.length; i++){
        if(val === arr[i]._id.toString()){
            return i
        }
    }

    return -1
}

const findObj = (val, arr) =>{
    for(let item of arr){
        if(val === item._id.toString()){
            return item
        }
    }
    
    return false
}

const hidePropsInArray = (collection, fields, optional = null) => {
    let collectionObjArr = []
    for(let item of collection){
        let itemObj = item.toObject()
        

        for(let prop of fields){
            delete itemObj[prop]

        }
        if(optional && itemObj[optional.bool] === true){
            for(let boolProp of optional.boolProps){
                delete itemObj[boolProp]
            }
        }
        collectionObjArr.push(itemObj)
    }
    return collectionObjArr
}

module.exports =  {
    hide_props_in_js_object,
    addIDsToArray_double,
    removeIDsFromArray_double,
    addIDsToArray,
    findObj,
    removeIDFromArray,
    findIndexOfObj,
    hidePropsInArray
}