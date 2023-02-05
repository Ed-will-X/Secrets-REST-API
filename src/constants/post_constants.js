const allowed_post_updates = [ "entryTitle", "entryBody", "tags", "isPublic", "NSFW", "date" ]
const props_to_hide = [ "savedBy", "shadowBan", "createdAt", "updatedAt" ]
const props_to_hide_query = [ ...props_to_hide, "comments", "likes", "__v", "entryMediaVersion", "uploadTimestamp", ]

module.exports = {
    allowed_post_updates,
    props_to_hide,
    props_to_hide_query
}