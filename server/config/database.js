import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    ssl: {
        rejectUnauthorized: false
    }
}

console.log(`Database connection details: Host=${config.host}, User=${config.user}, Database=${config.database}, Port=${config.port}`)

export const pool = new pg.Pool(config)
