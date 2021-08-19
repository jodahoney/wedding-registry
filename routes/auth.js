const express = require("express")
const router = express.Router()

router.post("/login", async (req, res, next) => {
    try {
        // taking the users email and pass and attempting to authenticate them
    } catch(err) {
        next(err)
    }
})

router.post("/register", async (req, res, next) => {
    try {
        // take the users email, pass, rsvp status, and the number of guests
        // and create a new user in our database
    } catch(err) {
        next(err)
    }
})

module.exports = router