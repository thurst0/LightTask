# LightTask

Technical Specifications
------------------------
The goal of this project was to create a lightweight project/task managment application.  One that has a framework in place to allow a development team to quickly make changes to support their processes.  I have found working with a handful of project management solutions over the years that they either try to force you into their way of thinking.  One size fits all is not a valid answer for most companies.  On the other end of the spectrum you have bloated applications that have too many forms attempting to give you control over how you use the application.  This can take a lot of maintenance, and frustration to keep running.

The other goal of this project was to be able to bill and invoice clients using the entered data.

This is a AngularJS web application, with a MySQL database, and NodeJS web hosting and express web services.  I generally gravitates towards Microsoft SQL, however I was dissapointed to learn that 'mssql' Node module doesn't support SQL 2016 at this time.  The Microsoft authored and supported module 'node-sqlserver' does, however it has some prerequisites I wanted to avoid.

## Default Schemas

I used a custom version of this application https://github.com/thurst0/Angular-Schema-Editor to write the schema meta data

Agents.  
Clients.  
Projects - Client has many projects.  
Tasks - Project has many tasks.  
Entries - Can be against a project or task.  

## File Structure

components - small reusable html components ( buttons, etc.)
scripts
  > controllers - angular controllers
    > FormController.js - Same controller for all schema implementations
templates - Our angular html templates
index.html - Our main menu, and references.
server.js - This is our web server, and our web services for CRUD operations in MySQL
start_server.js, start_server.cmd - This specifies the port and directory to serve from.  Can spin up multiple instances at one time.
LT_InitDB_MySQL.sql - Create and intialize MySQL database.

## TODOs

Convert to MicrsoftSQL possibly.  Lack of T-SQL features like INSTEAD OF triggers is a setback.
Status schema.  Can be different per project.  Also different status for project or task.
Fix date conrols
Invoice schema - Printing from app.

Client Reference
---------------------
