const User = require('../models/user')



const getUserById = async (req, res)=>{
 try {
  const {id} = req.params,
   user = await User.findById(id)
  if (!user) {
   return res.status(400).send({
    happy: false,
    error: `not found a user with ${id}`
  })
  }
  return res.status(200).send({
   happy: true,
   profile: user
  })
 } catch (error) {
  return res.status(400).send({
   happy: false,
   error: error.message
  })
 }
}


const getUsers = async (req, res)=>{
 res.send('hi')
}

module.exports = {
 getUsers,
 getUserById
}