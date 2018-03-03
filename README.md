# LightTask

Technical Specifications
------------------------
The goal of this project was to create a lightweight project/task managment application.  One that has a framework in place to allow a development team to quickly make changes to support their processes.  I have found working with a handful of project management solutions over the years that they either try to force you into their way of thinking.  One size fits all is not a valid answer for most companies.  On the other end of the spectrum you have bloated applications that have too many forms attempting to give you control over how you use the application.  This can take a lot of maintenance, and frustration to keep running.

The other goal of this project was to be able to bill and invoice clients using the entered data.

This is a AngularJS web application, with a MySQL database, and NodeJS web hosting and express web services.  I generally gravitates towards Microsoft SQL, however I was dissapointed to learn that 'mssql' Node module doesn't support SQL 2016 at this time.  The Microsoft authored and supported module 'node-sqlserver' does, however it has some prerequisites I wanted to avoid.

This project is WIP

## Default Schemas

I used a custom version of this application https://github.com/thurst0/Angular-Schema-Editor to write the schema meta data

Agents.  
Clients.  
Projects - Client has many projects.  
Tasks - Project has many tasks.  
Entries - Can be against a project or task.  

## File Structure

ltapp  
  
- components - small reusable html components ( buttons, etc.).  
- scripts  
  - app.js - Schema JSON, routes, basecontroller for reused functions relating to scope.
  - services.js - HTTP calls, and resued service functions
  - controllers - angular controllers.  
    - FormController.js - Same controller for all schema implementations.  
- templates - Our angular html templates.  
- index.html - Our main menu, and references.  
- server.js - This is our web server, and our web services for CRUD operations in MySQL.  
- start_server.js, start_server.cmd - This specifies the port and directory to serve from.  Can spin up multiple instances at one time. 
- LT_InitDB_MySQL.sql - Create and intialize MySQL database. 

node_modules - i've included all node modules used 

## TODOs

Convert to MicrsoftSQL possibly.  Lack of T-SQL features like INSTEAD OF triggers is a setback.  
Status schema.  Can be different per project.  Also different status for project or task.  
Fix date conrols.  
Invoice schema - Printing from app.  
Remove uneeded node modules. 
Database triggers for referential interegrity.  I.E - Can't delete a project with tasks, a task with entries, etc. 
Assigning periods or "milestones" to tasks.  
Hour estimates on task, and progress bar.  vTask for read & tTask for write.
Clean up entity tables.  
Long text type for descriptions, and notes.  Update UI for bigger fields.
Schema - Projects and tasks should have multi part PK.

Client Reference
---------------------
On opening screen we load all data for that entity.  
'Load' will filter loaded data on from controls.  
'Create' will create row using form controls. 
Editable fields can be modified directly in the grid.  
Link button will pull a list of linked entities and filter the data in the linked screen.  
