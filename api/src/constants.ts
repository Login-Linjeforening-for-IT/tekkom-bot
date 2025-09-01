import dotenv from 'dotenv'

type Channel = { 
    name: string
    value: string
}

export const channels = [] as Channel[]

dotenv.config({path: '../.env'})

const {
    DB,
    DB_HOST,
    DB_USER,
    DB_PORT,
    DB_MAX_CONN,
    DB_IDLE_TIMEOUT_MS,
    DB_TIMEOUT_MS,
    DB_PASSWORD,
    AUTHENTIK_API_URL,
    DEFAULT_RESULTS_PER_PAGE,
} = process.env


const config = {
    USERINFO_URL: `${AUTHENTIK_API_URL}/application/o/userinfo/`,
    DB_PORT,
    DB_MAX_CONN,
    DB_IDLE_TIMEOUT_MS,
    DB_TIMEOUT_MS,
    DB,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DEFAULT_RESULTS_PER_PAGE: Number(DEFAULT_RESULTS_PER_PAGE) || 50
}

export default config 