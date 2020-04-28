const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

  const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (req, res) => {
    const user = { ...req.body };
    if (req.params.id) user.id = req.params.id;

    if (!req.originalUrl.startsWith("/users")) user.admin = false;
    if (!req.user || !req.user.admin) user.admin = false;

    try {
      existsOrError(user.nome, "Nome não informado");
      existsOrError(user.email, "E-mail não informado");
      existsOrError(user.password, "Senha não informada");
      existsOrError(user.confirmPassword, "Confirmação de senha inválida");
      equalsOrError(user.password, user.confirmPassword, "Senhas não conferem");

      const userFromDB = await app
        .db("users")
        .where({ email: user.email })
        .first();
      if (!user.id) {
        notExistsOrError(userFromDB, "Usuário já cadastrado");
      }
    } catch (msg) {
      return res.status(400).send(msg);
    }

    user.password = encryptPassword(user.password);
    delete user.confirmPassword;

    if (user.id) {
      app
        .db("users")
        .update(user)
        .where({ id: user.id })
        .whereNull("deletedAt")
        .then((_) => res.status(204).send("Usuário atualizado com sucesso"))
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("users")
        .insert(user)
        .then((_) => res.status(204).send("Usuário cadastrado com sucesso"))
        .catch((err) => res.status(500).send(err));
    }
  };

  // const limit = 3; //usado para paginação
  // const get = async (req, res) => {
  //   const page = req.query.page || 1;

  //   const result = await app.db("users").count("id").first();
  //   const count = parseInt(result.count);
  //   app
  //     .db("users")
  //     .select("id", "nome", "email", "admin")
  //     .limit(limit)
  //     .offset(page * limit - limit)
  //     .whereNull("deletedAt")
  //     .then((users) => res.json({ data: users, count, limit }))
  //     .catch((err) => res.status(500).send(err));
  // };

  const get = (req, res) => {
    app
      .db("users")
      .select("id", "nome", "email", "admin")
      .whereNull("deletedAt")
      .then((users) => res.json(users))
      .catch((err) => res.status(500).send(err));
  };
  const getById = (req, res) => {
    app
      .db("users")
      .select("id", "nome", "email", "admin")
      .where({ id: req.params.id })
      .whereNull("deletedAt")
      .first()
      .then((user) => res.json(user))
      .catch((err) => res.status(500).send(err));
  };

  const remove = async (req, res) => {
    try {
      const temArticles = await app
        .db("articles")
        .where({ userId: req.params.id });
      notExistsOrError(temArticles, "Usuário possui artigos publicados.");

      const rowsUpdated = await app
        .db("users")
        .update({ deletedAt: new Date() })
        .where({ id: req.params.id });
      existsOrError(rowsUpdated, "Usuário não foi encontado");

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  // Deleta do banco - minha implementação
  // const remove = async (req, res) => {
  //     try {
  //         existsOrError(req.params.id, 'Id de usuário não informado.')

  //          const temArticles = await app.db('articles')
  //             .where({ userId: req.params.id })
  //         notExistsOrError(temArticles, 'Usuário possui artigos publicados.')

  //         const rowsDeleted = await app.db('users')
  //             .where({ id: req.params.id }).del()
  //         existsOrError(rowsDeleted, 'Usuário não foi encontado')

  //         res.status(204).send()
  //     } catch(msg) {
  //         res.status(400).send(msg)
  //     }
  // }

  return { save, remove, get, getById };
};
