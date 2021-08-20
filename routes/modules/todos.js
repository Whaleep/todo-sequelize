const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

// create
router.get('/new', (req, res) =>
  res.render('new')
)

router.post('/', (req, res) =>
  Todo.create({ name: req.body.name, UserId: req.user.id })
    .then(() => res.redirect('/'))
    .catch(error => res.status(422).json(error))
)

// detail
router.get('/:id', (req, res) => {  
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => res.status(422).json(error))
})

// edit
router.get('/:id/edit', (req, res) =>
  Todo.findOne({ where: { id: req.params.id, UserId: req.user.id } })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => res.status(422).json(error))
)

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findOne({ where: { id, UserId: req.user.id } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => res.status(422).json(error))
})

// delete
router.delete('/:id', (req, res) => {
  Todo.findOne({ where: { id: req.params.id, UserId: req.user.id } })
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(error => res.status(422).json(error))
})

module.exports = router
