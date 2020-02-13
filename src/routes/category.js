const Category = require('../models/category')




const getCategories = async(req, res)=>{
 try {
  const categories = await Category.find({active: true}).populate('user', 'name email role').sort('name'),
   count = await Category.countDocuments({active: true})
  if (!categories) {
   return res.status(400).send({
    happy: false,
    error: `Something went wrong`
   })
  }
  return res.status(200).send({
   happy: true,
   categories,
   count
  })
 } catch (error) {
  return res.status(400).send({
   happy: false,
   error: error.message
  })
 }
}

const postCategory = async(req,res)=>{
 try {
  const category = new Category(req.body)
   category.user = req.params.userId
  await category.save()
  return res.status(200).send({
   happy: true,
   category
  })
 } catch (error) {
  return res.status(400).send({
   happy: false,
   error: error.message
  })
 }
}

const getCategoryById = async(req, res)=>{
 try {
  const {id} = req.params,
   category = await Category.findById(id)
   if (!category) {
    return res.status(400).send({
     happy: false,
     error: `not found category with ${id}`
    })
   }
   return res.status(200).send({
    happy: true,
    category
   })
 } catch (error) {
  return res.status(400).send({
   happy: false,
   error: error.message
  })
 }
}

const putCategory = async(req, res)=>{
 try {
  const {id} = req.params,
   {body} = req,
   category = await Category.findByIdAndUpdate(id, body, {new: true})
   if (!category) {
    return res.status(400).send({
     happy: false,
     error: `not found category with id ${id}`
    })
   }
   return res.status(200).send({
    happy: true,
    category
   })
 } catch (error) {
  return res.status(400).send({
   happy: false,
   error: error.message
  })
 }
}


const deleteCategory = async(req, res)=>{
 try {
  const {id} = req.params,
   category = await Category.findByIdAndUpdate(id, {active: false}, {new: true})
   if (!category) {
    return res.status(400).send({
     happy: false,
     error: `not found category with ${id}`
    })
   }
   if (!category.active) {
    return res.status(400).send({
     happy: false,
     error: `already deleted`
    })
   }
   return res.status(200).send({
    happy: true,
    category,
    msg: 'deleted'
   })
 } catch (error) {
  return res.status(400).send({
   happy: false,
   error: error.message
  })
 }
}



module.exports = {getCategories, postCategory, getCategoryById, putCategory, deleteCategory}