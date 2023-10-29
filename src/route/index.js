// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
// Пишем код, которій будет сохранять созданное

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  // Создаем статический метод create, который принимает уже созданный user и сохраняет в частную переменную list
  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    let index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    let user = this.getById(id)

    if (user) {
      //   // С помощью Object.assign() добавляем новые данные
      //   Object.assign(user, { email })

      if (email) {
        this.update(user, data)
      }
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  let list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// Создаем новый эндпоинт, но с помощью post (т.к. ипользуется метод POST, который мы указали в файле index.hbs в <form>) вместо
router.post('/user-create', function (req, res) {
  let { email, login, password } = req.body

  // Содаем нового пользователя, куда передаем необходимые данные

  let user = new User(email, login, password)

  User.add(user)

  // Т.к. list это частная переменная, то мы ее не можем никак вызвать, по этому через User.getList() смотрим что в середине массива
  console.log(User.getList())
  res.render('success-info', {
    style: 'success-info',

    info: 'Пользователь создан',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// Создаем новый эндпоинт, для перехода после использования команды удалить
router.get('/user-delete', function (req, res) {
  let { id } = req.query

  console.log(typeof id)

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',

    info: 'Пользователь удален',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-update', function (req, res) {
  let { email, password, id } = req.body

  let result = false

  let user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  //   console.log(email, password, id)

  res.render('success-info', {
    style: 'success-info',

    info: result ? 'Почта обновлена' : 'Ошибка',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
