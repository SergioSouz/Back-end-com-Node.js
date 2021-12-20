const { request } = require("express");
const express = require("express");
const {uuid} = require('uuidv4')
const app = express() ; 

app.use(express.json());

/*
  Metodos HTTP

  GET : Buscar informaçoes do back-end
  POST: Criar uma informações no back-end
  PUT/PATCH : alterar uma informaçao no back-end
  DELETE: deletar uma informaçoes back-end 
*/

/* 
  Tipos de parametros :

  Query params : Filtros e paginação
  Route params :  Indentificar recursos ( Atuallizar/Deletar )
  Request body:  Conteudo na hora criar ou editar um recurso
*/


/* 
  Middleware:

  Interceptador de  requisicoes que interromper totalmente a requisições 
  ou alterar dados da requisicoes */

const projects = [];

function logRequests( request, response, next){
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);
  return next(); // proximo Middleware
}
app.use(logRequests);



/* rotas get exemplo  */
app.get('/projects',(resquest, response)=> {
    const { title} = resquest.query;

    const results =  title
        ? projects.filter(project => project.title.includes(title))
        : projects;
    
    return response.json(results);
});

/* rotas post exemplo  */
app.post('/projects',(resquest, response)=> {

    const {title, owner } = resquest.body;
    const project = { id: uuid(), title , owner };

    projects.push(project);
    return response.json(project);
});


/* rotas put exemplo  */
app.put('/projects/:id',(resquest, response)=> {
    const { id }  = resquest.params;
    const {title , owner } = resquest.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0 ){
        return response.status(400).json({ ERROR: "Project not found."})
    }

    const project = {
        id,
        title,
        owner,
    }
    projects[projectIndex] = project;

    return response.json( project );
});

/* rotas delete exemplo  */
app.delete('/projects/:id',(resquest, response)=> {
    const { id }  = resquest.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0 ){
        return response.status(400).json({ ERROR: "Project not found."})
    }

    projects.splice(projectIndex,1)
    return response.status(204).send();
});


app.listen(3333 , () => {
    console.log('Back-end started 🚀🚀🚀');
});