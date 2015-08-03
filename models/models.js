var path = require('path');

// Postgres DATABASE_URL = postgress://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var host = (url[4] || null);
var port = (url[5] || null);
var DB_name = (url[6] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{ dialect: dialect,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage,	// solo SQLite (.env)
	 	omitNull: true		// solo Postgres
	}
);

// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definición de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

// Relación 1:N entre Quiz y Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment; // exportar definición de tabla Comment

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count === 0){
			Quiz.create({ pregunta: 'Capital de Italia', respuesta: 'Roma', tema: 'humanidades'});
			Quiz.create({ pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema: 'humanidades'});
		}
	});
});
