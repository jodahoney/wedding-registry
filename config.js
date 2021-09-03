require("dotenv").config()
require("colors")

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001

function getDatabaseUri() {
    const dbUser = process.env.DATABASE_USER || "postgres"
    const dbPass = process.env.DATABASE_PASS ? encodeURI(process.env.DATABASE_PASS) : "postgres"
    const dbHost = process.env.DATABASE_HOST || "localhost"
    const dbPort = process.env.DATABASE_PORT || "5432"
    const dbName = process.env.DATABASE_NAME || "wedding_registration"

    // if the DATABASE_URL env variable, use that, otherwise, create the db connection string ourselvese
    return process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`

}

console.log("Wedding registration Config:".red)
console.log("PORT:".blue, PORT)
console.log("---")

module.exports = {
    PORT,
    getDatabaseUri,
}