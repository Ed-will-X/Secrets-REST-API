const current_user_props_to_hide = [ "password" ]
const props_to_hide = [ ...current_user_props_to_hide, "blocked" ]
const allowed_updates = [ "username", "password", "private", "gender" ]

module.exports = {
    current_user_props_to_hide,
    props_to_hide,
    allowed_updates
}