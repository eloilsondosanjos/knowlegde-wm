# Projeto Final - Web Moderno - Knowlegde

# Backend em NodeJS

Para executar comece instalando todas as dependências do projeto,
acesse o terminal e navegue até a pasta backend, em seguida execute

    npm i

Instale de forma global o Knex.js que é um construtor de consultas SQL.

    npm i -g knex

Instale os banco de dados Postgres e o mongoDB

Crie uma nova base de dados no postgres com o nome: knowlegde ou com o nome de sua preferência e altere o arquivo **knexfile.js** na pasta backend com suas credenciais de acesso ao banco.

Já para o mongoDB basta startar um instância e a aplicação se encarrega de criar a base de dados, caso queira alterar essasinformações, acesse o arquivo **mongodb.js** na pasta config dentro do backend.

Agora tudo pronto para executar a aplicação, execute:

    npm start

Se tudo ocorreu bem, já conseguirá acessar a API da aplicação via http://localhost:3000, caso a porta 3000 esteja ocupada na sua máquina, pode alterá-la o arquivo **index.js** na pasta backend, e executar o comando anterior novamente.

# Frontend em VueJS

Em desenvolvimento...
