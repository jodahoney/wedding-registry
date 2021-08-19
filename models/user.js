const { UnauthorizedError } = require("../utils/errors")

class User {
    static async login(credentials) {
        // User should submit their email and password
        // if any of these are missing, throw an error
        //
        // lookup the user in the db by email
        // if a user is found, compare the submitted password
        // with the password in the db
        // if there is a match, return the user
        // 
        // if any of this goes wrong, throw an error
        throw new UnauthorizedError("Invalid email/password combo")
    }

    static async register(credentials) {
        // user should submit their email, pass, rsvp status, and # of guests
        // if any of these are missing, throw an error
        // 
        // make sure no user already exists in db with that email
        // if one does, throw an error
        //
        // then, take the users pass and hash it
        // take the users email and lowercase it
        // 
        // create a new user in the db with all their info
        // return the user
    }
}

module.exports = User