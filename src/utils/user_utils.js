


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


module.exports =  {
    hide_props_in_js_object,
    addIDsToArray_double,
    removeIDsFromArray_double
}