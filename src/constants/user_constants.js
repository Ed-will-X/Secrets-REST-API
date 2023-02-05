const current_user_props_to_hide = [ "password" ]
const props_to_hide = [ ...current_user_props_to_hide, "blocked", "likedSecrets", "followRequests", "blockedBy", "savedPosts", "email", "posts_commented_on", "viewedSecrets", "likedComments", "profileImage" ]
const allowed_user_updates = [ "username", "password", "private", "gender" ]
const search_data_to_hide = [ ...props_to_hide, "NSFW", "private", "gender", "createdAt", "updatedAt", "customEntrySort", "tokens", "followers", "following", "__v" ]
const private_data = [ ...props_to_hide, "secrets", "followers", "following" ]

module.exports = {
    current_user_props_to_hide,
    props_to_hide,
    allowed_user_updates,
    private_data,
    search_data_to_hide
}