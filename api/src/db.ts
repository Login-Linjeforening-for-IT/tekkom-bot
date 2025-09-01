import pg from 'pg'
import config from '@constants'

const { 
    DB, 
    DB_USER, 
    DB_HOST,
    DB_PASSWORD, 
    DB_PORT, 
    DB_MAX_CONN, 
    DB_IDLE_TIMEOUT_MS, 
    DB_TIMEOUT_MS
} = config
const { Pool } = pg
const pool = new Pool({
    user: DB_USER || "tekkom",
    host: DB_HOST || "tekkom-bot_database",
    database: DB || "tekkom",
    password: DB_PASSWORD,
    port: Number(DB_PORT) || 5432,
    max: Number(DB_MAX_CONN) || 20,
    idleTimeoutMillis: Number(DB_IDLE_TIMEOUT_MS) || 5000,
    connectionTimeoutMillis: Number(DB_TIMEOUT_MS) || 3000
})

export default async function run(query: string, params: (string | number | null | boolean | string[])[]) {
    const client = await pool.connect()
    try {
        return await client.query(query, params)
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}
