const db = require("../db")
const bcrypt = require("bcrypt")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")
const { BCRYPT_WORK_FACTOR } = require("../config")

class User {
    static async makePublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            rsvpStatus: user.rsvp_status,
            numGuests: user.num_guests,
            createdAt: user.created_at
        }
    }



    static async login(credentials) {
        // User should submit their email and password
        // if any of these are missing, throw an error
        //
        const requiredFields = ["email", "password"]
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })

        
        // lookup the user in the db by email
        const user = await User.fetchUserByEmail(credentials.email)

        // if a user is found, compare the submitted password
        // with the password in the db
        // if there is a match, return the user
        // 
        if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if (isValid) {
                return User.makePublicUser(user)
            }
        }
        // if any of this goes wrong, throw an error
        throw new UnauthorizedError("Invalid email/password combo")
    }

    static async register(credentials) {
        // user should submit their email, pass, rsvp status, and # of guests
        // if any of these are missing, throw an error
        const requiredFields = ["email", "password", "rsvpStatus", "numGuests"]
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })

        if (credentials.email.indexOf("@") <= 0) {
            throw new BadRequestError("invalid email.")
        }
        // 
        // make sure no user already exists in db with that email
        // if one does, throw an error
        const existingUser = await User.fetchUserByEmail(credentials.email)
        if (existingUser) {
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }
        //
        // then, take the users pass and hash it
        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)
        // take the users email and lowercase it
        const lowercasedEmail = credentials.email.toLowerCase()
        // 
        // create a new user in the db with all their info
        const result = await db.query(`
            INSERT INTO users (
                email,
                password,
                rsvp_status,
                num_guests
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, rsvp_status, num_guests, created_at;
        `, [lowercasedEmail, hashedPassword, credentials.rsvpStatus, credentials.numGuests])
        
        // return the user
        const user = result.rows[0]

        return User.makePublicUser(user)

    }

    static async fetchUserByEmail(email) {
        if (!email) {
            throw new BadRequestError("No email provided")
        }

        const query = `SELECT * FROM users WHERE email = $1`

        const result = await db.query(query, [email.toLowerCase()])

        const user = result.rows[0]

        return user
    }
}

module.exports = User