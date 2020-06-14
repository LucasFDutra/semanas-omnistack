const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        // coloca uma consição and para as proximas condições
        { _id: { $ne: user } }, // pega os usuários que sejam o proprio usuário
        { _id: { $nin: loggedDev.likes } }, // E pega todos os usuários que não estejam na lista de lik
        { _id: { $nin: loggedDev.dislikes } } // E pega todos os usuários que não estejam na lista de dislikes
      ]
    });

    return res.json(users);
  },

  // métodos
  async store(req, res) {
    // pegando o objeto username direto do req.body
    // agora podemos escrever somente username ao em vez de req.body.username
    // username === req.body.username considerando a existencia do comando abaixo
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });

    if (userExists) {
      return res.json(userExists);
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return res.json(dev);
  }
};
