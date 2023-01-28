const current_user_props_to_hide = [ "password" ]
const props_to_hide = [ ...current_user_props_to_hide, "blocked", "likedSecrets", "followRequests", "blockedBy", "savedPosts", "email" ]
const allowed_updates = [ "username", "password", "private", "gender" ]
const private_data = [ ...props_to_hide, "secrets", "followers", "following" ]

module.exports = {
    current_user_props_to_hide,
    props_to_hide,
    allowed_updates,
    private_data
}