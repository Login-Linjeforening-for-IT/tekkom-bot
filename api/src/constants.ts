import dotenv from 'dotenv'

export const channels = [] as Channel[]
export const roles = [] as Role[]

dotenv.config({path: '../.env'})

const requiredEnvironmentVariables = [
    'AUTHENTIK_API_URL',
    'CLIENT_ID',
    'REDIRECT_URI',
    'CLIENT_SECRET',
    'QUEENBEE_URL',
    'DB_PASSWORD',
    'DB_HOST',
    'TEKKOM_BOT_API_TOKEN',
    'TEKKOM_BOT_BTG_TOKEN',
    'QUEENBEE_BTG_TOKEN'
]

const missingVariables = requiredEnvironmentVariables.filter(
    (key) => !process.env[key]
)

if (missingVariables.length > 0) {
    throw new Error(
        'Missing essential environment variables:\n' +
            missingVariables
                .map((key) => `${key}: ${process.env[key] || 'undefined'}`)
                .join('\n')
    )
}

const env = Object.fromEntries(
    requiredEnvironmentVariables.map((key) => [key, process.env[key]])
)

const AUTH_URL = `${env.AUTHENTIK_API_URL}/application/o/authorize/`
const TOKEN_URL = `${env.AUTHENTIK_API_URL}/application/o/token/`
const USERINFO_URL = `${env.AUTHENTIK_API_URL}/application/o/userinfo/`
const USER_ENDPOINT = `${env.AUTHENTIK_API_URL}/api/v3/core/users/`

const config = {
    USERINFO_URL: `${env.AUTHENTIK_API_URL}/application/o/userinfo/`,
    DB_PORT: env.DB_PORT,
    DB_MAX_CONN: env.DB_MAX_CONN,
    DB_IDLE_TIMEOUT_MS: env.DB_IDLE_TIMEOUT_MS,
    DB_TIMEOUT_MS: env.DB_TIMEOUT_MS,
    DB: env.DB,
    DB_HOST: env.DB_HOST,
    DB_USER: env.DB_USER,
    DB_PASSWORD: env.DB_PASSWORD,
    CLIENT_ID: env.CLIENT_ID,
    REDIRECT_URI: env.REDIRECT_URI,
    TOKEN_URL,
    CLIENT_SECRET: env.CLIENT_SECRET,
    QUEENBEE_URL: env.QUEENBEE_URL,
    AUTH_URL,
    DEFAULT_RESULTS_PER_PAGE: Number(env.DEFAULT_RESULTS_PER_PAGE) || 50,
    TEKKOM_BOT_API_TOKEN: env.TEKKOM_BOT_API_TOKEN,
    TEKKOM_BOT_BTG_TOKEN: env.TEKKOM_BOT_BTG_TOKEN,
    QUEENBEE_BTG_TOKEN: env.QUEENBEE_BTG_TOKEN
}

export default config
