// TODO: Return an array with the message
const validate_post_upload = (Schema) => {
    const mediaTypes = [ "image", "video", "none" ]
    return async(req, res, next) => {
        try {
            if(req.body.date === undefined) {
                return res.status(400).send({ error: "Date must not be empty" })
            }

            if(req.body.mediaType === undefined) {
                return res.status(400).send({ error: "Media type must not be empty" })
            }

            if(mediaTypes.includes(req.body.mediaType) === false) {
                return res.status(400).send({ error: "Invalid media type" })
            }
            // make sure the date is valid
            if(!validateDate(req.body.date)) {
                console.log(req.body.date)
                return res.status(400).send({ error: "Invalid date" })
            }
            // make sure that no other post has been uploaded for that same day
            // if(!check_duplicate_date(date, Schema)) {
            //     return res.status(400).send({ error: "Duplicate date" })
            // }
            // check absurd date values
            if(!check_absurd_date(req.body.date)) {
                return res.status(400).send({ error: "Invalid Date" })
            }
            // Make sure that date is not later than today
            if(!check_future_date(req.body.date, Schema)) {
                return res.status(400).send({ error: "Date must not be a future date" })
            }
            // TODO: Make sure that the date is not before the DOB in the user
            // check_DOB_validity()

            // TODO: Make sure tags array is not empty

            next()
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    }
}

/**
 * @param {string} date 
 */
const validateDate = (date) => {
    const numbers = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ]
    if(date.length < 3) {
        return false
    }
    if(date[4] != "-" || date[7] != "-"){
        return false
    }
  
    for(let i = 0; i <= date.length -1; i++) {
        if(numbers.includes(date[i]) === false && i !== 4 && i !== 7) {
            return false
        }
    }
  
  
  return true
}

const check_duplicate_date = async(date, Schema) => {
    const post = await Schema.findOne({ date: date })

    if(post !== null) {
        return true
    } else {
        return false
    }
}

const check_future_date = (date) => {
    // const today = "2023-01-28"  // TODO: Find a way to get today's date
    var datetime = new Date();
    const today = `${datetime.getFullYear()}-${datetime.getMonth() + 1}-${datetime.getDate()}`
    console.log(`Today is ${today}`)
    const dateArr = date.split("-")
    const todayArr = today.split("-")
    
    
    if(parseInt(dateArr[0]) > parseInt(todayArr[0])) {
        console.log("Year must not be greater than current year")
        return false
    } else if(parseInt(dateArr[0]) === parseInt(todayArr[0])) {
        if(parseInt(dateArr[1]) > parseInt(todayArr[1])) {
            console.log("Month must not be greater than current month")
            return false
        } else if(parseInt(dateArr[1]) === parseInt(todayArr[1])) {
            if(parseInt(dateArr[2]) > parseInt(todayArr[2]) + 1) {
                console.log("Day must not be greater than current day")
                return false
            } else if(parseInt(dateArr[2]) === parseInt(todayArr[2])) {
                return true
            } else {
                return true
            }
        }else {
            return true
        }
    } else {
        return true
    }
}

const check_absurd_date = (date) => {
    const dateArr = date.split("-")
    const months_with_30_days = [ 9, 4, 6, 11 ]
    const months_with_31_days = [ 1, 3, 5, 7, 8, 10, 12 ]
    
    // Month validity check
    if(parseInt(dateArr[1]) < 1 || parseInt(dateArr[1]) > 12) {
        console.log("Month must be between 1 and 12")
        return false
    }
    
    // day validity check
    // checks if less than expexted
    if(parseInt(dateArr[2]) < 1) {
        console.log("Day must not be less than 1")
        return false
    }
    // validates months with 30 days
    if(months_with_30_days.includes(parseInt(dateArr[1])) && parseInt(dateArr[2]) > 30) {
        console.log(`Day in month ${parseInt(dateArr[1])} must not exceed 30`)
        return false
    }
    
    // validates months with 31 days
    if(months_with_31_days.includes(parseInt(dateArr[1])) && parseInt(dateArr[2]) > 31) {
        console.log(`Day in month ${parseInt(dateArr[1])} must not exceed 31`)
        return false
    }
    
    // validates leap year feburary
    if(parseInt(dateArr[0]) % 4 === 0 && parseInt(dateArr[1]) === 2 && parseInt(dateArr[2]) > 29) {
        console.log(`Day in month ${parseInt(dateArr[1])} must not exceed 29 in a leap year`)
        return false
    }
    
    // validates non-leap year feburary
    if(parseInt(dateArr[0]) % 4 !== 0 && parseInt(dateArr[1]) === 2 && parseInt(dateArr[2]) > 28) {
        console.log(`Day in month ${parseInt(dateArr[1])} must not exceed 28`)
        return false
    }
    
    
    return true
  }

const check_DOB_validity = () => {

}

module.exports = {
    validate_post_upload
}