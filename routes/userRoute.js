const fs = require('fs')
const { join } = require('path')

const filePath = join(__dirname, 'users.json')

const getUsers = () => {
    const data = fs.existsSync(filePath)
        ? fs.readFileSync(filePath)
        : []

    try {
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

const saveUser = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'))

const userRoute = (app) => {
    app.route('/users/:id?')
        .get((req,res) => {
            const users = getUsers()

            res.send({ users })
        })
        .post((req, res) => {
            const users = getUsers()
	
            const { email, name } = req.body

            if (email.slice(-10) === "@gmail.com" || email.slice(-12) === "@outlook.com" || email.slice(-12) === "@hotmail.com") {
                users.push(req.body)
                saveUser(users)

                res.status(201).send('Succesfully sent')
            } else {
                res.status(400).send('Write an valid email')
            }
        })
        .put((req, res) => {
            const users = getUsers()

	        saveUser(users.map(user => {
		        if (user.id === req.params.id) {
		            return {
			            ...user,
			            ...req.body
    		        }
		        }	 

                return user
	        }))

	        res.status(200).send("ok")
        })
	    .delete((req, res) => {
    	    const users = getUsers()
            
	        saveUser(users.filter(user => user.id !== req.params.id))
		
    	    res.status(200).send("ok")
	    })
}

module.exports = userRoute
