export const ticketIdPattern = /^ticket\d+$|^\d{5,}$/
export const ZAMMAD_URL = 'https://zammad.login.no/#ticket/zoom'
export const DISCORD_URL = 'https://discord.com/channels'
export const MAX_CHANNELS = 50
export const GITLAB_API = "https://gitlab.login.no/api/v4/"
export const GITLAB_BASE = "https://gitlab.login.no"
export const INFRA_PROD_CLUSTER = 149
export const UNKNOWN_VERSION = "unknown version"
export const SUCCESS = "success"
export const DISCORD_MAX_INLINE_EMBED_FIELD_LENGTH = 37
export const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14
export const EDIT_INTERVAL_SECONDS = 1

export const FALLBACK_TAG = {
    name: "No version released.",
    commit: {
        short_id: "Unknown.",
        created_at: 0,
        title: "Manual commit history unimplemented.",
        author_name: "Unknown.",
        author_email: "Unknown.",
        web_url: `${GITLAB_BASE}/tekkom`
    }
}

export const FALLBACK_PIPELINE = {
    id: 0,
    iid: 0,
    project_id: 0,
    sha: "",
    ref: "unknown version",
    status: "0.0.0",
    source: "unknown",
    created_at: new Date(0).toLocaleTimeString(),
    updated_at: new Date(0).toLocaleTimeString(),
    web_url: GITLAB_BASE,
    name: null
}
