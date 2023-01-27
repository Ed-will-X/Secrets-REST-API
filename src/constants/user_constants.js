const current_user_props_to_hide = [ "password" ]
const props_to_hide = [ ...current_user_props_to_hide, "blocked" ]

module.exports = {
    current_user_props_to_hide,
    props_to_hide
}