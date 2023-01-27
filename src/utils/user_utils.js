


const hide_props_in_js_object = (jsObject, fields) => {
    for(let prop of fields) {
        delete jsObject[prop]
    }

    return jsObject
}

module.exports =  {
    hide_props_in_js_object
}