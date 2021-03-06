# LightTask

Technical Specifications
------------------------
The goal of this project was to create a lightweight project/task managment application.  One that has a framework in place to allow a development team to quickly make changes to support their processes.  I have found working with a handful of project management solutions over the years that they either try to force you into their way of thinking.  One size fits all is not a valid answer for most companies.  On the other end of the spectrum you have bloated applications that have too many forms attempting to give you control over how you use the application.  This can take a lot of maintenance, and frustration to keep running.

The other goal of this project was to be able to bill and invoice clients using the entered data.

This is a AngularJS web application, with a MySQL database, and NodeJS web hosting and express web services.  I generally gravitate towards Microsoft SQL, however I was dissapointed to learn that 'mssql' Node module doesn't support SQL 2016 at this time.  The Microsoft authored and supported module 'node-sqlserver' does, however it has some prerequisites I wanted to avoid.

## Default Schemas

I used a custom version of this application https://github.com/thurst0/Angular-Schema-Editor to write the schema meta data.  It is actually built into the product.

Agents.  
Clients.  
Projects - Client has many projects.  
Tasks - Project has many tasks.  
Entries - Can be against a project or task.  
Git Commits - This is a very basic git integration.  Allows use to specify an Owner (in this case needs to be added as an agent), and a repo name.  Will pull a list of all comits for that repo with some details.  Ordered with most recent first.  By selecting one, it will bring you to the entry screen and default the notes for the entry to be the commit comment.  Note that web server that hosts this web application will need to be authenticated with git.
Login - Choose an agent to login as.
Products - Project can have a product. Project to product is many to 1.
Periods - A entry can have a period.  This can be a milestone, or a release, etc.  Can help to filter down release notes to the entries you want to see.  Future will allow assigning different entities such as projects or tasks to a period.
Statuses - Associated with an entity.  This allows you to setup different statuses for agents, tasks, projects, etc.
UI - These are screens that are shown on the index.  From here you can change some JSON options particular to that UI, and add or remove screens
Schema - UI to Schema is 1:1 currently.  You can modify a screens schema, and change how it's inputs and grid are rendered.
Entity Links - Shortcuts.  This defines the contextual links from one screen to another.

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

Convert to Angular 2
Convert to MicrsoftSQL possibly.  Lack of T-SQL features like INSTEAD OF triggers is a setback.  
Status schema.  Can be different per project.  Also different status for project or task.  
Invoice schema - Printing from app.  
Remove uneeded node modules. 
Assigning periods or "milestones" to tasks.  
Hour estimates on task, and progress bar.  vTask for read & tTask for write.
Clean up entity tables. 
Password and authentication
Git expansion - Add products.  Product can be associated with a task or project.  Product can be associated with a repo.  Then we can do a git commit lookup from the project or task and further automate the entry.

Client Reference
---------------------
On opening screen we load all data for that entity.  
'Load' will filter loaded data on from controls.  
'Create' will create row using form controls. 
Editable fields can be modified directly in the grid.  
Link button will pull a list of linked entities and filter the data in the linked screen.  
