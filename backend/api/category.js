module.exports = (app) => {
  const { existsOrError, notExistsOrError } = app.api.validation;

  const save = async (req, res) => {
    const category = {
      id: req.body.id,
      nome: req.body.nome,
      parentId: req.body.parentId,
    };

    if (req.params.id) category.id = req.params.id;

    try {
      existsOrError(category.nome, "Nome não informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    if (category.id) {
      app
        .db("categories")
        .update(category)
        .where({ id: category.id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("categories")
        .insert(category)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const remove = async (req, res) => {
    try {
      existsOrError(req.params.id, "Código da categoria não informado.");

      const subcategory = await app
        .db("categories")
        .where({ parentId: req.params.id });
      notExistsOrError(subcategory, "Categoria possui subcategorias.");

      const articles = await app
        .db("articles")
        .where({ categoryId: req.params.id });
      notExistsOrError(articles, "Categoria possui artigos.");

      const rowsDeleted = await app
        .db("categories")
        .where({ id: req.params.id })
        .del();
      existsOrError(rowsDeleted, "Categoria não foi encontada");

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const withPath = (categories) => {
    const getParent = (categories, parentId) => {
      const parent = categories.filter((parent) => parent.id === parentId);
      return parent.length ? parent[0] : null;
    };

    const categoriesWithPath = categories.map((category) => {
      let path = category.nome;
      let = parent = getParent(categories, category.parentId);

      while (parent) {
        path = `${parent.nome} > ${path}`;
        parent = getParent(categories, parent.parentId);
      }

      return { ...category, path };
    });

    categoriesWithPath.sort((a, b) => {
      if (a.path < b.path) return -1;
      if (a.path > b.path) return 1;
      return 0;
    });

    return categoriesWithPath;
  };

  const limit = 3; //usado para paginação

  const get = async (req, res) => {
    const page = req.query.page || 1;
    const result = await app.db("categories").count("id").first();
    const count = parseInt(result.count);

    app
      .db("categories")
      .select()
      .limit(limit)
      .offset(page * limit - limit)
      .then((categories) =>
        res.json(withPath({ data: categories, count, limit }))
      )
      .catch((err) => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db("categories")
      .where({ id: req.params.id })
      .first()
      .then((category) => res.json(category))
      .catch((err) => res.status(500).send(err));
  };

  const toTree = (categories, tree) => {
    if (!tree) tree = categories.filter((c) => !c.parentId);
    tree = tree.map((parentNode) => {
      const isClild = (node) => node.parentId == parentNode.id;
      parentNode.children = toTree(categories, categories.filter(isClild));
      return parentNode;
    });
    return tree;
  };

  const getTree = (req, res) => {
    app
      .db("categories")
      .then((categories) => res.json(toTree(categories)))
      .catch((err) => res.status(500).send(err));
  };

  return { save, remove, get, getById, getTree };
};
