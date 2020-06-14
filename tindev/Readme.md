Aqui colocarei o passo a passo que precisei executar para criar o backend da aplicação, com excessão da parte de socket. Que pretendo criar um tutorial específico.

> OBS.: não farei o tutorial das partes de frontend e mobile.

# SUMÁRIO

- [CRIANDO O BACKEND](#CRIANDO-O-BACKEND)
- [JSON](#JSON)
- [CONFIGURANDO PARA O SERVIDOR SER ATUALIZADO AUTOMATICAMENTE](#CONFIGURANDO-PARA-O-SERVIDOR-SER-ATUALIZADO-AUTOMATICAMENTE)
- [PARTICIONANDO O CÓDIGO](#PARTICIONANDO-O-CÓDIGO)
- [TRABALHANDO NO ARQUIVO ROUTES](#TRABALHANDO-NO-ARQUIVO-ROUTES)
- [METODO POST](#METODO-POST)
- [TESTANDO API](#TESTANDO-API)
- [BANCO DE DADOS](#BANCO-DE-DADOS)
- [ARMAZENANDO INFORMAÇÕES NO BANCO DE DADOS](#ARMAZENANDO-INFORMAÇÕES-NO-BANCO-DE-DADOS)
- [Model](Model)

# CRIANDO O BACKEND

- 1. Crie uma pasta chamada `backend`
- 2. Abra o terminal dentro dessa pasta
  - 2.1 Digite o comando `yarn init -y`

Um arquivo package.json foi criado dentro dessa pasta, esse pacote tem como função de listar todas as dependencias que precisam ser instaladas dentro do nosso projeto, isso é muito bom pois assim sempre saberemos quais softwares e suas versões utilizar para que tudo funcione corretamente

- 3. Digite no terminal o comando `yarn add express`
     O express é um micro framwork que vai nos ajudar a lidar com rotas dentro do node

- 4. Crie uma pastas `src` dentro da pasta `backend` e dentro dessa pasta crie um arquivo chamado `server.js`.

Agora podemos começar a programar.
Primeiramente vamos importar o pacote express com o comando

```JavaScript
const express = require("express");
```

Vamos carregar o servidor em uma variável

```JavaScript
const server = express(); // essa variável é o nosso servidor
```

Os servidores normalmente possuem 4 métodos, são eles:

- get: buscar informação da api
- post: criar informação
- put: editar informação
- delete: deletar informação

Agora adicionanmos o seguinte comando:

```JavaScript
server.get("/", (req, res) => {
  return res.send("Hello World");
});

server.listen(3333); // o servidor está ouvindo a porta 3333
```

Sendo que o parâmetro `/` é por onde o nosso servidor vai pegar uma informação, o `req` é o requerimento que o usuário está fazendo (pode ser a url) e o `res` é a resposta que o servidor está dando para esse requerimento.

Nesse caso a resposta é um `Hello world`.

Agora vamos setar em qual porta o nosso servidor vai operar

```JavaScript
server.listen(3333); // o servidor está ouvindo a porta 3333
```

Ou seja, ele vai operar na porta 3333, se você rodar no seu terminal o comando `node server.js` e abrir o navegador e digitar na barra de busca `localhost:3333` vai aparecer a mensagem `Hello World`.

Outra coisa que podemos fazer (e devemos) é utilizar o parametro `req`, vamos ver como podemos utilizá-lo.

Digite no navegador o seguinte endereço: `localhost:3333/?name=qualquer_coisa` ele vai dar um erro isso porque o parametro `?` indica que queremos fazer uma requisição, nesse caso que a variável `name` receba o valor `qualquer_coisa`, porém como você deve ter notado a variável name não existe, então podemos fazer o seguinte:

```JavaScript
server.get("/", (req, res) => {
  return res.send(`Hello ${req.query.name}`);
});
```

Utilizando o comando `query` podemos pegar todos os parametros que são enviados na url, logo se enviarmos `name` ele pagará o name e retornará para a gente. Logo se enviarmos varios parâmetros ele retornará vários parâmetros, porém utilizando `query.parâmetro` nós pegamos o parametro desejado. E claro, o query está dentro do req, afinal ele trabalha com a requisição. Então quando escrevemos `req.query.name` estamos pegando o `qualquer_coisa`. Pause o comando `node server.js` e rode ele novamente para atualizar a aplicação e depois digite no navegador `localhost:3333/?name=qualquer_coisa` e você vai ver o resultado.

E o mais legal de tudo, é que essa é a base de toda api com node. Temos uma rota, uma requisição, fazemos algo com essa requisição (cadastro de um usuário, encaminhar algo para outra api..) e devolvemos uma determinada resposta para o frontend.

# JSON

A saída da nossa api tem que ter um formato específico que o nosso frontend consiga entender, e no caso vamos utilizar o json, que aparentemente é a melhor opção. Ou seja, no final das contas estaremos retornando ou um objeto (`{}`) ou um vetor (`[]`).

Veja como ficaria para retornarmos algo no formato json:

```JavaScript
server.get("/", (req, res) => {
  return res.json({ mensagem: `Hello ${req.query.name}` });
});
```

Reinicie seu servidor ai e veja que tivemos como saída: `{"mensagem":"Hello lucas"}`

Agora vamos parar com essa coisa de ficar reiniciando o servidor a cada vez que quisermos ver o que está acontecendo com nossa aplicação. Para isso abra seu terminal, dentro da pasta `backend` e digite o comando `yarn add nodemon -D`

# CONFIGURANDO PARA O SERVIDOR SER ATUALIZADO AUTOMATICAMENTE

Depois que parar de rodar vá para dentro do packge.json e crie uma propriedade chamada `scripts` que será responsável por rodar alguma coisa que queremos, e nesse caso vamos colocar o nodemon para rodar o nosso arquivo server.js. Assim nosso arquivo packege.json fica da seguinte forma:

```JavaScript
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^1.19.1"
  }
}
```

Agora abra o terminal dentro da pasta backend e rode o comando `yarn dev` e pronto, agora nossa aplicação vai sempre ser atualizada automaticamente assim que salvarmos alguma modificação.

# PARTICIONANDO O CÓDIGO

Vamos dividir o código em alguns arquivos agora.

Vamos criar o arquivo `routes.js` que vai conter nossas rotas, Esse arquivo fica da seguinte forma:

```JavaScript
const express = require("express");

// ao em vez de usar o server usamos o routes que é expecífico para gerenciar rotas
const routes = express.Router();

routes.get("/", (req, res) => {
  return res.json({ mensagem: `Hello ${req.query.name}` });
});

// exportar a variável, ou seja as rotas
module.exports = routes;
```

E o arquivo `server.js` vai ficar da seguinte forma:

```JavaScript
const express = require("express");
const routes = require("./routes");

const server = express();

server.use(routes);

server.listen(3333); // o servidor está ouvindo a porta 3333
```

Veja que importamos o routes e depois mandamos o servidor utilizá-lo.

# TRABALHANDO NO ARQUIVO ROUTES

## METODO POST

Vamos criar o método post dentro do routes:

```JavaScript
routes.post("/devs", (req, res) => {
  return res.json({ ok: true });
});
```

## TESTANDO API

Instale um software chamado Insomnia, para pegar o instalador .deb clique [aqui](https://updates.insomnia.rest/downloads/ubuntu/latest) ou então instale a versão snap com o comando `sudo snap install insomnia`.

Dentro do Insomnia vá em `Insomnia -> create new workspace` de um nome pra ela.

<img src='./Readme_imagens/Figura_01.png' />

<img src='./Readme_imagens/Figura_02.png' />

Agora do lado esquerdo veja que apareceu um botão com um +, clique nele e clique em `new request`.

<img src='./Readme_imagens/Figura_03.png' />

De um nome pra ela e do lado selecione o método que esse request vai utilizar, nesse caso coloque o `post` e dentro de `no body` selecione o tipo de corpo da requisição (como a requisição vai enviar informações para o backend), selecione `JSON` e de um create.

<img src='./Readme_imagens/Figura_04.png' />

Agora na parte superior ao centro você verá que está pedindo para colocar um endereço, coloque `http://localhost:3333/devs` (pois é a rota que está no nosso exemplo). Aperte em `send` e veja que ele retorna a mensagem que queriamos (ou seja, "ok": true)

<img src='./Readme_imagens/Figura_05.png' />

Bom, mas agora você já deve ter notado que não é muito viável ficarmos passando informações via url, então vamos passar elas via json, afinal assim conseguiremos mandar muito mais coisas.

Sendo assim nosso server.js tem que ganhar a seguinte linha: `server.use(express.json());` que precisa vir antes da linha de rotas. Logo nosso arquivo ficará da seguinte forma:

```JavaScript
server.use(express.json());
server.use(routes);
```

E agora podemos passar o objeto para o nosso json, nesse caso vamos utilizar `req.body`, ou seja vamos passar o corpo da requisição.

Ficando com nosso arquivo `routes.js` da seguinte forma:

```JavaScript
const express = require("express");

// ao em vez de usar o server usamos o routes que é expecífico para gerenciar rotas
const routes = express.Router();

routes.get("/", (req, res) => {
  return res.json({ mensagem: `Hello ${req.query.name}` });
});

routes.post("/devs", (req, res) => {
  return res.json(req.body);
});

// exportar a variável, ou seja as rotas
module.exports = routes;
```

Se você prestar atenção no get temos um objeto sendo passado diretamente, já no post temos um sendo passado de forma indireta pelo método req.body. Pense da seguinte forma: Dentro de reque temos o nosso objeto, e quando chamamos body estamos chamando o que está escrito dentreo dele, sendo assim o que está dentro das chaves em `return res.json()` é o nosso objeto.

Pegando o Insomnia para testarmos, vamos mandar um json como sendo nossa requisição ao método post e ver o que ele retorna (nesse caso deve retornar algo identico ao que for mandado.)

<img src='./Readme_imagens/Figura_06.png' />

# BANCO DE DADOS

Vamos utilizar o mongoDB (mas tente trabalhar de começo com o sql pois ele é um banco relacional, já o mongo é um banco não relacional, mas como estou seguindo o tutorial da rockseat e eu não sei trabalhar com nenhum dos dois, então vou acompanhar com eles)

Baixe a versão gratuita do banco de dados chamada mongoDB atlas, que pode ser encontrado [aqui](https://www.mongodb.com/cloud/atlas)

Clique em `try free` e crie uma conta

<img src='./Readme_imagens/Figura_07.png' />

Você vai cair nessa tela aqui

<img src='./Readme_imagens/Figura_08.png' />

Role tudo para baixo e clique em create cluster (note que temos 512mb gratuitos para utilizarmos)

<img src='./Readme_imagens/Figura_09.png' />

Depois vai cair nessa tela abaixo e isso pode demorar um tempo

<img src='./Readme_imagens/Figura_10.png' />

Depois de criado vá em Database Access para criar um usuário e senha

<img src='./Readme_imagens/Figura_11.png' />

Vá em add new user

<img src='./Readme_imagens/Figura_12.png' />

Crie o usuário, e deixe marcada a opção Read and write to any database e adicione o usuário

<img src='./Readme_imagens/Figura_13.png' />

Vá em network access

<img src='./Readme_imagens/Figura_14.png' />

Crie um novo acesso em add ip address e depois permita que esse banco de dados seja acessado de qualquer lugar clicando em Allow access from anywhere

<img src='./Readme_imagens/Figura_15.png' />

Vá em clusters e clique em connect

<img src='./Readme_imagens/Figura_16.png' />

Selecione a opção connect to your application

<img src='./Readme_imagens/Figura_17.png' />

Agora deixe a tela seguinte com a configuração mostrada abaixo e clique em copy

<img src='./Readme_imagens/Figura_18.png' />

Agora dentro da pasta backend adicione o mongoose com o comando `yarn add mongoose`

O mongoose vai permitir que nos comuniquemos com o banco de dados utilizando apenas sintax javascrip. Isso faz com que não precisemos utilizar aqueles comando `INSERT, INTO..` que os bancos de dados precisam

Agora vamos importar o mongoose para o arquivo sever.js com a linha

```JavaScript
const mongoose = require("mongoose");
```

E antes das rotas coloque o seguinte comando:

```JavaScript
mongoose.connect('url de conexão', {useNewUrlParser: true});
```

A url de conexão é aquela que pegamos do mongoDB ao clicar em copy. Assim nosso código ficará da seguinte forma:

```JavaScript
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const server = express();

mongoose.connect(
  "mongodb+srv://lucasdatabase:lucasdatabase@cluster0-mtkkw.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

server.use(express.json());
server.use(routes);

server.listen(3333); // o servidor está ouvindo a porta 3333
```

Uma observação é que provavelmente você terá recebido esse url com `<username>` e `<password>` é só trocar pelo username e o password que você definiu no passo de criação da base de dados (lembre de retirar o sinal de <> também, veja meu exemplo).

> OBS.: O parametro `test` que está nessa url é o nome do banco de dados, porém se trocar esse nome e colocar qualquer outra coisa ele simplesmente criará esse novo banco de dados para você. Mas pode deixar teste mesmo (em algum lugar lá no começo provavelmente tinha um lugar para definir o nome do banco e eu não vi).

> OBS.: O comando `useNewUrlParser` é para identificar para o mongoose que estaremos utilizando o novo formato de url (evita um warning).

Pronto, nossa conexão com o banco de dados está feita

## ARMAZENANDO INFORMAÇÕES NO BANCO DE DADOS

Vamos criar duas pastas, a pasta models e a pasta controllers ambas dentro de src (pesquise sobre mvc)

Model: Abstração do banco de dados
Controller: Responsável por armazenar as informaçõs em uma primeira instancia

### Models

Vamos criar dentro dessa pasta um arquivo .js que será nosso arquivo model. Coloque o nome dele de acordo com a url que você quer usar para chegar nele. No caso da nossa aplicação teremos `Dev.js`, mas se fosse uma loja e quisessemos que esse url levasse aos produtos, iriamos colocar `Products.js`

Dentro de `Dev.js` importar duas coisas do mongoose, o `Schema` e o `model`, para isso digite a seguinte linha:

```JavaScript
const { Schema, model } = require('mongoose')
```

Agora vamos criar a estrutura do nosso banco de dados, ou seja o esquema dele. Considerando nossa aplicação vamos escrever o seguinte:

```JavaScript
const { Schema, model } = require("mongoose");

const DevSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    },
    bio: String,
    avatar: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Dev", DevSchema); // exporta o esquema
```

essa primeira chave se refere aos registros que nossa base de dados irá receber, que nesse caso são:

- name (nome): tem tipo string e é obrigatório (required: true)
- user (nome de usuário no github): tem tipo string e é obrigatório (required: true)
- bio (descrição): tem tipo string e não é obrigatório (então tem somente um parâmetro, por isso não precisa de chaves própria)
- avatar (endereço da foto no github): tem tipo string e é obrigatório (required: true)

Já a segunda chave, o `timestamps` serve para gerar automaticamente duas colunas para nós, uma chamada createdAt e outra chamada updatedAt em cada registro da base de dados.

- createdAt: Armazena a data de criação de cada registro
- updatedAt: Armazena a data da ultima alteração do registro

Agora pode fechar esse model, pois agora qualquer parte da aplicação que importar esse model já pode inserir, retirar, atualizar dados.

### Controllers

Os controllers serão responsáveis pela logica da aplicação, ou seja, por receber as requisiçõs e formularem uma resposta.

#### Controller de cadastro dos devs

Dentro da pasta vamos criar o controle de Dev, que é onde vamos definir a criação de novos desenvolvedores, modificações, remoção, listar... tudo que tem relação com os desenvolvedores cadastrados.

O nome desse controlador será `DevController.js`

O controller será um objeto a ser exportado, por isso ele será escrito da seguinte forma:

```JavaScript
module.exports = {
    // métodos
}
```

Agora vamos colocar um método somente para testar o controller. Veja como fica:

```JavaScript
module.exports = {
  // métodos
  store(req, res) {
    return res.json({ ok: true });
  }
};
```

Ou seja, estamos criando um método para retornar um json dizendo ok: true. Vamos testar isso adicionando esse controle às nossas rotas com a seguinte linha de código:

```JavaScript
const DevController = require('./controllers/DevController')
```

E dentro de post (que é a parte de criação de um novo desenvolvedor) vamos adicionar o controlador como sendo um dos nossos parametros, ficando da seguinte forma:

```JavaScript
routes.post("/devs", DevController.store);
```

Veja que antes tinhamos o seguinte comando:

```JavaScript
routes.post("/devs", (req, res) => {
  return res.json(req.body);
});
```

Então quer dizer que o DevControler.store substituiu o (req, res)...? sim.

Se você olhar dentro do arquivo DevControler.js verá que temos a função store, a qual tem exatamente a mesma estrutura que essa (req, res).. ou seja, nos agora só estamos trazendo aquela função para cá, ela irá trabalhar da mesma forma que a sua antecessóra, afinal nos sómente mudamos o lugar em que essa função de (req, res) está escrita (meio que copiamos e colamos a função ali, só que sem escrever ela toda, colocamos apenas um link para ela).

O código compelto fica:

```JavaScript
const express = require("express");
const DevController = require("./controllers/DevController");

// ao em vez de usar o server usamos o routes que é expecífico para gerenciar rotas
const routes = express.Router();

routes.post("/devs", DevController.store);

// exportar a variável, ou seja as rotas
module.exports = routes;
```

E utilizando o Insomnia podemos ver que a resposta foi exatamente o que esperavamos

<img src='./Readme_imagens/Figura_19.png' />

> OBS.: A outra rota que tinhamos (.get) foi retirada, pois agora não estamos mais utilizando ela.

##### Retornando o dados da api do github

Como queremos utilizar o username do github do dev então vamos precisar utilizar a api do github, e ele tem uma api publica, e para acessá-la digite em seu browser o caminho:

http://api.github.com/users/nome_do_usuário

e trocando o nome_do_usuário por algum usuário existente receberemos um json com as informações desse usuário.

Um exemplo, vamos utilizar o meu nome de usuário (coloque o seu ai também): https://api.github.com/users/LucasFDutra

O retorno será:

```JavaScript
{
  login: "LucasFDutra",
  id: 42756392,
  node_id: "MDQ6VXNlcjQyNzU2Mzky",
  avatar_url: "https://avatars2.githubusercontent.com/u/42756392?v=4",
  gravatar_id: "",
  url: "https://api.github.com/users/LucasFDutra",
  html_url: "https://github.com/LucasFDutra",
  followers_url: "https://api.github.com/users/LucasFDutra/followers",
  following_url: "https://api.github.com/users/LucasFDutra/following{/other_user}",
  gists_url: "https://api.github.com/users/LucasFDutra/gists{/gist_id}",
  starred_url: "https://api.github.com/users/LucasFDutra/starred{/owner}{/repo}",
  subscriptions_url: "https://api.github.com/users/LucasFDutra/subscriptions",
  organizations_url: "https://api.github.com/users/LucasFDutra/orgs",
  repos_url: "https://api.github.com/users/LucasFDutra/repos",
  events_url: "https://api.github.com/users/LucasFDutra/events{/privacy}",
  received_events_url: "https://api.github.com/users/LucasFDutra/received_events",
  type: "User",
  site_admin: false,
  name: null,
  company: null,
  blog: "",
  location: null,
  email: null,
  hireable: null,
  bio: null,
  public_repos: 11,
  public_gists: 0,
  followers: 1,
  following: 1,
  created_at: "2018-08-28T00:17:43Z",
  updated_at: "2019-08-03T19:30:16Z"
}
```

Veja que assim temos todas as informações das quais precisamos para a nossa aplicação.

Beleza, mas agora como vamos pegar isso e chamar para dentro da nossa aplicação? Bom, vamos utilizar o pacote chamado `axios`, então agora já deve ter entendido que precisamos adicionar ele com o yarn né? Então digite no seu teminal, dentro da pasta backend `yarn add axios` e import ele para dentro do controller. E também vamos utilizar esse pacote passando para ele o endereço da api do github e o nosso username. para isso vamos utilizar o comando:

```JavaScript
const response = axios.get(`https://api.github.com/users/${username}`);
```

Para testarmos vamos fazer o seguinte: Vamos colocar um `return res.json(response.data);` no lugar do `ok: true` para podermos ver o que está retornando para nós utilize o Insomnia para chamar o método post (não se desespere, pois vai dar erro mesmo, e era a intenção... continue lendo).

O código completo é esse aqui:

```JavaScript
const axios = require("axios");

module.exports = {
  // métodos
  store(req, res) {
    // pegando o objeto username direto do req.body
    // agora podemos escrever somente username ao em vez de req.body.username
    // username === req.body.username considerando a existencia do comando abaixo
    const { username } = req.body;

    const response = axios.get(`https://api.github.com/users/${username}`);

    return res.json(response.data);
  }
};
```

> OBS.: Por que não somente response? Bem, isso é porque o axios retorna a informação dentro de um objeto chamado data, logo precisamos adentrar nesse objeto para pegar os dados que queremos.

Agora que você não se desesperou com o erro que deu e seguiu lendo, vamos entender o que aconteceu. O método `get` é um método assincrono, ou seja, ele fica rodando em paralelo ao restante da aplicação, e isso faz com que chamemos o retorno e ainda não pegamos nada para o response, isso porque demora para o get buscar as informações na api do github. Pense da seguinte forma: O código chegou em `axios.get` e falou para ele ir buscar a informação na api, o get falou "blz, to indo, mas vai fazendo os outros trem ai" (ps.: sou mineiro kkk), então o store falou "blz, vai indo lá então, vou continuar meu serviço aqui" nisso o get foi e o store seguiu sua vida, nisso ele chegou em `return res...` e advinha?! o get ainda não voltou com a resposta, então deu errado, pois o return precisava do que o get estava trazendo, logo seria interessante se o store soubesse que ele não pode seguir antes que o get volte (por mais que o get insista) e para fazer isso vamos fazer o seguinte: vamos mandar ela esperar. Meio obvio né? kkkk, mas tá agora é sério, como vamos fazer isso? Ue, manda ela esperar em inglês kkk (pior que é sério). Veja o comando compelto abaixo:

```JavaScript
const response = await axios.get(`https://api.github.com/users/${username}`);
```

E pra quem não sabe nada de inglês, await significa aguardar/esperar/um monte de coisa que o google me falou.

Mas ok, uma coisa não é nada obvio, sempre que aparecer um `await` dentro da função precisamos indicar que essa função é assincrona, e para isso colocamos um `async` antes do nome dela. Ficando da seguinte forma:

```JavaScript
const axios = require("axios");

module.exports = {
  // métodos
  async store(req, res) {
    // pegando o objeto username direto do req.body
    // agora podemos escrever somente username ao em vez de req.body.username
    // username === req.body.username considerando a existencia do comando abaixo
    const { username } = req.body;

    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    return res.json(response.data);
  }
};
```

Agora rode novamente e veja o retorno indo muito bem:

<img src='./Readme_imagens/Figura_20.png' />

##### Salvando os dados no nosso banco de dados

Agora precisamos pegar essas informações que recebemos, filtrá-las conforme o que queremos e salvá-las no nosso banco de dados.

Para isso vamos primeiramente importar o nosso modelo para dentro do nosso controlador, ou seja, dentro de `DevController.ja` import o `Dev.js`

```JavaScript
const Dev = require("../models/Dev");
```

E agora vamos chamar a função Dev.create (que também é assincrona) e passar os parametros desejados em forma de um objeto.

```JavaScript
await Dev.create({
  name: response.data.name,
  user: username,
  bio: response.data.bio,
  avatar: response.data.avatar_url
});
```

Porém, para ficar mais fácil, maso encurtar response.data, com o comando:

```JavaScript
const { name, bio, avatar_url: avatar } = response.data;
```

Agora estamos dizendo que de response.data queremos apenas name, bio e avatar_url o qual eu já chamei de avatar. Assim podemos fazer a passagem da seguinte forma:

```JavaScript
await Dev.create({
  name,
  user: username,
  bio,
  avatar,
});
```

> OBS.: Como iriamos ter name: name, bio: bio e avatar: avatar, o JavaScript (node) já entende se fizermos direto do jeito que está acima, ou seja ele entende que `name: name, === name,`

Mas vamos melhorar isso um pouco, e vamos colocar essa função dentro de uma variável chamada dev, porque assim nos podemos retornar a variável dev (facilita né?)

Sendo assim nosso código ficará da seguinte forma:

```JavaScript
const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  // métodos
  async store(req, res) {
    // pegando o objeto username direto do req.body
    // agora podemos escrever somente username ao em vez de req.body.username
    // username === req.body.username considerando a existencia do comando abaixo
    const { username } = req.body;

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
```

E agora se testarmos isso no Insomnia teremos o seguinte resultado:

<img src='./Readme_imagens/Figura_21.png' />

Isso mesmo, um belo erro (na verdade ele vai ficar carregando para sempre), isso conteceu porque eu não tenho um nome no github, eu tenho apenas um username, e o nome é obrigatório (inclusive eu não sabia que eu não tinha registrado um nome kkkkk vou atualizar depois). Então para seguir com o tutorial vou utilizar o perfil de um amigo meu que possui todos os requisitos exceto o bio, mas o bio não é obrigatório (espero que ele não se importe de usar o perfil dele kkkk), O nome do meu amigo é Yle, sim, esse nome estranho mesmo, mas é muito gente boa. O username dele é yleseverino e colocando o isso no Insomnia teremos o seguinte resultado:

<img src='./Readme_imagens/Figura_22.png' />

E veja que agora o retorno é bem menor, e contem apenas as informações que foram selecionadas e salvas no nosso banco de dados.

##### Previnindo o cadastro duplicado de usuários

Como toda boa aplicação, precisamos previnir que o mesmo usuário não se cadastre duas vezes, ou que pelo menos ninguém tente utilizar o mesmo username. Então vamos melhorar um pouquinho o nosso controlador.

Vamos criar uma variável chamada `userExistes` que vai procurar um determinado usuário dentro do nosso banco de dados, e caso ele exista vamos retornar os dados que já temos em nosso banco de dados ao em vez de cadastrar ele novamente.

Para fazer isso vamos fazer o seguinte:

```JavaScript
const userExists = await Dev.findOne({ user: username });

if (userExists) {
  return res.json(userExists);
}
```

Você já deve ter imaginado que esse trecho de código deve vir antes do bloco que faz o registro do usuário. Mas ta ai o código completo:

```JavaScript
const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
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
```

Se quiser verificar que realmente não está salvando o mesmo usuário vá em [mongodb compass community](https://www.mongodb.com/products/compass) em que é possivel baixar uma aplicação que permitirá visualizar o seu banco de dados. É só clicar em `try now`

<img src='./Readme_imagens/Figura_23.png' />

Clique em tools escolha a melhor versão para você e clique em download

<img src='./Readme_imagens/Figura_24.png' />

Agora abra o mongoDB compass community e depois vá no mongoDB Atlas (onde configurou seu banco de dados) e vá em cluster e clic em connect novamente e depois escolha a opção connect with mongoDB compass

<img src='./Readme_imagens/Figura_25.png' />

Ai você clica em copy

<img src='./Readme_imagens/Figura_26.png' />

Volte para o mongoDB compass e ele automaticamente identificará que existe uma url copiada e perguntará se quer importar ela para dentro da aplicação. Clique em sim

<img src='./Readme_imagens/Figura_27.png' />

Coloque o username e o password conforme havia configurado antes, e em `Autentication Database` coloque `admin`. E clique em connect

<img src='./Readme_imagens/Figura_28.png' />

Veja que a base de dados de teste está presente

<img src='./Readme_imagens/Figura_29.png' />

E se entrarmos nela podemos ver o diretório devs

<img src='./Readme_imagens/Figura_30.png' />

E dentro de devs temos ai em formato de uma tabelo o meu amigo yle registrado

<img src='./Readme_imagens/Figura_31.png' />

E agora eu vou tentar adicionar ele novamente e não vai acontecer, eu somente receberei os dados referentes à ele e pronto. Veja na figura abaixo, que eu mandei um novo send com o username dele, mas que no mongoDB compass ele não foi adicionado

<img src='./Readme_imagens/Figura_32.png' />

Ai agora eu fui no meu github e coloquei meu nome, sendo assim agora eu posso puxar minhas informações para o nosso banco de dados. Veja que agora serei adicionado à lista do mongoDB.

<img src='./Readme_imagens/Figura_33.png' />

#### Controller de likes

Agora vamos fazer o sistema para que os devs deem likes/dislikes em outros desenvolvedores e precisamos também criar uma rota para listar os desenvolvedores já vistos, afinal não podemos ver novamente os mesmos devs que já vimos uma vez.

Então agora vamos criar um novo arquivo chamado `LikeController.js` dentro da pasta `controllers`

> OBS.: Por que não criar o controle de likes dentro do DevControler? Porque um tem uma "regra" (boa prática) que é não colocar mais do que os 5 métodos fundamentais que são
>
> - `INDEX`: Para fazer uma lista do recurso
> - `SHOW`: Para retornar um único recurso
> - `STORE`: Para armazenar um recurso
> - `UPDATE`: Para atualizar um recurso
> - `DELETE`: Para deletar um recurso
>   E o método like seria um novo método que possuiria esses métodos dentro dele, então deve-se criar o controller like separadamente.

O controller like também vai ser exportado na forma de um objeto, e também precisaremos armazenar dados no banco de dados mediante a esse controlador, logo ele terá o método store. Ficando com a estrutura básica da seguinte forma:

```JavaScript
const Dev = require("../models/Dev");

module.exports = {
  store(req, res) {

  }
};
```

> OBS.: Veja que já importei o modelo, isso porque eu vou jogar as informações para lá.

Porém, precisaremos modificar o nosso esquema do banco de dados, pois agora precisaremos de um campo para anotar que aquele dev recebeu um like ou um dislike. Sendo assim o nosso arquivo `Dev.js` dentro de `models` recebe um update e fica com essa cara aqui:

```JavaScript
const { Schema, model } = require("mongoose");

const DevSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    },
    bio: String,
    avatar: {
      type: String,
      required: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dev"
      }
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dev"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = model("Dev", DevSchema);
```

Ok, vamos entender um pouco melhor o que está acontecendo aqui. Vamos isolar do código essa parte nova:

```JavaScript
likes: [
  {
    type: Schema.Types.ObjectId,
    ref: "Dev"
  }
],
dislikes: [
  {
    type: Schema.Types.ObjectId,
    ref: "Dev"
  }
]
```

Veja que ambas são vetores, e dentro de cada vetor temos um objeto com dois atributos. Isso quer dizer que o modelo a ser seguido será objetos com esses atributos salvos dentro de um vetor. Isso é necessário pois mais de uma pessoa irá dar like ou dislike para esse dev, então precisamos registrar cada dev likezero dentro do atributo likes desse dev e cada dev dislikezero dentro do atributo dislikes desse dev, sendo assim precisaremos de vários espaços, por isso utilizamos um array.

Agora vamos olhar os atributos de cada objeto desse. `type: Schema.Types.ObjectId,` indica que o tipo será um objectid que é o formato de id que a api do github retorna para nós ("\_id": "5d4a4e8f47c7bc5fcccbf286"), e o `ref: "Dev"` indica que esse dislike está ligado a essa tabela de Dev.

Agora vamos construir esse controller. Precisamos saber duas coisas aqui, o dev que está dando o like e o que está recebendo o like.

Vamos então utilizar o Insomnia para poder fazer os testes. Vá até ele e crie uma nova rota chamada like do tipo post e que receba um json.

<img src='./Readme_imagens/Figura_34.png' />

Coloque o caminho da seguinte forma: `http://localhost:3333/devs/id_do_desenvolvedor_que_receberá_o_like/likes`. Um exemplo seria se eu fosse dar um like no yle, ficaria da seguinte forma: `http://localhost:3333/devs/5d4a434be297c65d415d8978/likes`.

O motivo disso ser desse jeito é que não da para dar likes em outra coisa que não seja um dev, logo precisariamos de colocar o id relacionado a devs. E o /like ajudará a entender que é para ligar isso à um like e não a um deslike.

Basicamente o que essa url consegue transmitir para mim é o seguinte.

Se você digitar essa url ai significa que você um desenvolvedor que efetuar uma ação no desenvolvedor com um determinado id e essa ação é um like.

Então agora precisamos modificar nossa rota. Para isso coloque a linha no arquivo routes.js

```JavaScript
routes.post("/devs/:devId/likes", LikeController.store);
```

Esse `:devId` tem a seguinte interpretação: Os `:` indica que virá um caracter externo, ou seja estamos esperando um valor dessa variável `devId`, e essa variável pode ter o nome que eu quiser. o LikeController.store segue exatamente a mesma ideia do DevController.store.

E também precisamos importar o controller para dentro das rotas.

```JavaScript
const LikeController = require("./controllers/LikeController");
```

O código completo fica:

```JavaScript
const express = require("express");
const DevController = require("./controllers/DevController");
const LikeController = require("./controllers/LikeController");

const routes = express.Router();

routes.post("/devs", DevController.store);
routes.post("/devs/:devId/likes", LikeController.store);

module.exports = routes;
```

Agora precisamos a partir do nosso controller acessar a informação de devId. Para isso vamos utilizar o seguinte `req.params.devId`, sendo que esse é um comando parente daquele `req.query` e `req.body`. O negocio é que esse pega uma informação no meio da nossa url (rota). Então vamos lá:

- req.query: Pega uma informação dentro da url no formato de /?algo=algumaCoisa
- req.body: Pega um json
- req.params.algumParametro: pega um determinado parametro que vem na url logo apos um `:`.

E agora precisamos saber quem é o usuário logado na aplicação e para isso vamos criar um `header` chamado user, e vamos obter o id desse usuário.

Para acessar essa informação vamos utilizar o comando `req.headers.user`. Vamos ver isso no Insomnia.

Vá na rota de like e click em header

<img src='./Readme_imagens/Figura_35.png' />

Depois configure a da seguinte maneira:

<img src='./Readme_imagens/Figura_36.png' />

Sendo que esse value é o meu id (no caso o id do usuário logado na aplicação)

Fazendo isso e adicionando um `console.log()` para mostrar os valores teremos o seguinte:

<img src='./Readme_imagens/Figura_37.png' />

Ou seja, o primeiro valor é o id da pessoa que recebeu o like e o segundo é o id de quem deu o like.

O código que está em `LikeController.js` nesse momento é:

```JavaScript
const Dev = require("../models/Dev");

module.exports = {
  store(req, res) {
    console.log(req.params.devId);
    console.log(req.headers.user);

    return res.json({ ok: true });
  }
};
```

Agora vamos fazer isso ficar utilizavel, vamos seguir a mesma ideia que fizemos para o cadastro do dev.

```JavaScript
const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { devId } = req.params
    const { user } = req.headers

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    return res.json({ ok: true });
  }
};
```

Agora temos aqui dois usuários o loggedDev e o targetDev, respectivamente o dev que está dando o like e o que está recebendo o like. E ambos são encontrados pelos seus id's.

Ou seja, o loggedDev tem tudo aquilo que um Dev tem, logo podemos fazer `loggedDev.avatar` e receberiamos o retorno.

Agora vamos verificar se o usuário logado está tentando dar like em um usuário que não existe. Para isso vamos utilizar um `if (!targetDev)` e vamos retornar um `status(400)` (esse 400 é um http code, que significa bad request) e dai retornaremos um json com uma informação de erro. Logo o código ficará da seguinte forma:

```JavaScript
const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { devId } = req.params
    const { user } = req.headers

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
        return res.status(400).json({ error: 'Dev not exists' })
    }

    return res.json({ ok: true });
  }
};
```

Então se eu tentar ir no Insomnia e colocar um id de target que não existe ele mostrará a mensagem de erro

<img src='./Readme_imagens/Figura_38.png' />

Mas ai se ele encontrou o desenvolvedor target vamos então pegar o desenvolvedor logado (o que deu like), e vamos adicionar o desenvolvedor target no seu campo de likes.

```JavaScript
loggedDev.likes.push(targetDev._id)
await loggedDev.save();
```

O método push vai adicionar no banco de dados e o `_id` é o jeito que o mongo salva o id do usuário. E o save ta ai porque o push não salva as coisas no banco, então logo após o push precisamos colocar o save.

E agora vamos retornar o dev logado para podermos ver no Insomnia o retorno com o id no campo de likes.

```JavaScript
return res.json(loggedDev);
```

<img src='./Readme_imagens/Figura_39.png' />

O código completo está abaixo:

```JavaScript
const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { devId } = req.params;
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      return res.status(400).json({ error: "Dev not exists" });
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
```

Mas agora temos que colocar um jeito de verificar se o dev target já deu um like no logged dev, ou seja, se tivemos um match. Para isso vamos buscar no banco de dados o dev target e vamos ver dentro do campo de likes dele se o loggedDev está por lá, se isso for verdade então temos um match.

```JavaScript
if (targetDev.likes.includes(loggedDev._id)) {
    console.log('DEU MATCH')
}
```

Por hora essa informação será tratada apenas com uma mensagem no console, mas mais para frente ela vai aparecer na interface (quando tivermos uma).

Mas vamos lá, vamos forçar esse match, como no meu campo de likes já está o id do yle, então agora vamos fazer o yle dar like em mim e assim veremos a mensagem no console.

<img src='./Readme_imagens/Figura_40.png' />

O código completo ficou da seguinte forma:

```JavaScript
const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { devId } = req.params;
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (targetDev.likes.includes(loggedDev._id)) {
      console.log("DEU MATCH");
    }

    if (!targetDev) {
      return res.status(400).json({ error: "Dev not exists" });
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
```

#### Controller de dislikes

Agora vamos criar o `DislikeController.js` que será muito parecido com o `LikeController.js` a ideia é exatamete a mesma, só muda onde iremos adicionar os id's e que agora não precisamos mais de nenhuma informação em caso de um dislike mútuo.

O código fica assim:

```JavaScript
const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { devId } = req.params;
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      return res.status(400).json({ error: "Dev not exists" });
    }

    loggedDev.dislikes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
```

E claro que também precisaremos modificar o arquivo de rotas `routes.js`

```JavaScript
const express = require("express");
const DevController = require("./controllers/DevController");
const LikeController = require("./controllers/LikeController");
const DislikeController = require("./controllers/DislikeController");

// ao em vez de usar o server usamos o routes que é expecífico para gerenciar rotas
const routes = express.Router();

routes.post("/devs", DevController.store);
routes.post("/devs/:devId/likes", LikeController.store);
routes.post("/devs/:devId/dislikes", DislikeController.store);

// exportar a variável, ou seja as rotas
module.exports = routes;
```

E se formos no Insomnia e cirarmos uma nova rota podemos testar o dislike

<img src='./Readme_imagens/Figura_41.png' />

E se fizermos o teste veremos que agora o campo do dislike foi preenchido

<img src='./Readme_imagens/Figura_42.png' />

Porém esse preenchimento foi feito com o mesmo id do like, ou seja, estamos permitindo que a mesma pessoa de like e dislike

#### Criando lista de possiveis devs

Agora vamos criar uma nova rota para fazer uma lista com todos os devs que ainda não estão na lista nem de likes e nem de dislikes, ou seja, pessoas ainda passíveis de avaliação.

E veja que essa nova rota é feita com o método get, pois estamos fazendo uma busca.

<img src='./Readme_imagens/Figura_43.png' />

a rota será `http://localhost:3333/devs`, veja que a rota é a mesma para o post e get, e isso não tem problema, pois são métodos diferentes. E novamente os dados do usuário logado será enviado pelo header da requisição.

Vamos criar um novo usuário agora. Um usuário chamado `filipedeschamps` (o youtuber mesmo... não tinho outro amigo que usa github e é ativo o suficiente para ter o cadastro completo kkkkk) e ele vai ser esse usuário que não apareceu para ninguem ainda.

<img src='./Readme_imagens/Figura_44.png' />

Ta ai, ele está cadastrado. Agora ele é um usuário que estará na lista de possibilidades para avaliação.

Agora vamos modificar a rota, ficando da seguinte forma:

```JavaScript
const express = require("express");
const DevController = require("./controllers/DevController");
const LikeController = require("./controllers/LikeController");
const DislikeController = require("./controllers/DislikeController");

const routes = express.Router();

routes.get('/devs', DevController.index);
routes.post("/devs", DevController.store);
routes.post("/devs/:devId/likes", LikeController.store);
routes.post("/devs/:devId/dislikes", DislikeController.store);

module.exports = routes;
```

E agora vamos criar o index dentro do DevController. Sendo que esse index ficará da seguinte forma:

```JavaScript
async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
        $and: [ // coloca uma consição and para as proximas condições
            { _id: { $ne: user } }, // pega os usuários que sejam o proprio usuário
            { _id: { $nin: loggedDev.likes } }, // E pega todos os usuários que não estejam na lista de lik
            { _id: { $nin: loggedDev.dislikes } } // E pega todos os usuários que não estejam na lista de dislikes
        ],
    })

    return res.json(users)
},
```

E comando Dev.find setado daquela maneira faz com com que tenhamos 3 condições diferentes ligadas por um and. Interpretando o que está ali, teremos o seguinte: "Faça uma varredura por toda a minha base de dados e retorne para users os usuários cujo id não seja igual meu proprio, e os usuários cujo id não estejam indexados nem na minha lista de likes e nem na de dislikes".

O código completo do DevController é:

```JavaScript
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

  async store(req, res) {
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
```

Agora vamos testar para o yle, que deve retornar um json somente com o id do Filipe.

<img src='./Readme_imagens/Figura_45.png' />

E não deu outra, voltou somente com o dele, ou seja, deu tudo certo então acabamos com o nosso backend por aqui. (por enquanto)

Mas primeiro vamos instalar mais uma coisa antes de começar a aplicação com react, vamos instalar o cors, ele permite que a aplicação seja acessada por qualquer endereço, ou seja isso permite que o react tente acessar a aplicação do backend. Então rode ai no seu terminal o comando `yarn add cors`.

E antes das rotas lá no server.js adicione a seguinte linha:

```JavaScript
server.use(cors());
```

ficando da seguinte forma:

```JavaScript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const server = express();

mongoose.connect(
  "mongodb+srv://lucasdatabase:lucasdatabase@cluster0-mtkkw.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(3333); // o servidor está ouvindo a porta 3333
```
