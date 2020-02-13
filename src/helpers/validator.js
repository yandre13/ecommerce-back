const userSignupValidator = (req, res, next)=>{
 req.check('name', 'Name is require').notEmpty()
 req.check('email', 'Email must be between 6 to 32 characters')
  .matches(/.+\@.+\..+/)
  .withMessage('Email must contain @')
  .isLength({
   min: 6, max: 32
  })
  req.check('password', 'Password is required').notEmpty()
  req.check('password')
   .withMessage('Password must contain at least 6 characters')
   .isLength({ min: 6 })
   .matches(/\d/)
   .withMessage('Password must contain a number')

   const errors = req.validationErrors()
   if (errors) {
    const firstError = errors.map(e=>e.msg)[0]
    return res.status(400).send({error: firstError})
   }
   next()
}

module.exports = {userSignupValidator}