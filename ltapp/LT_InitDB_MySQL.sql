DROP DATABASE LTApp;

CREATE DATABASE LTApp;

USE LTApp;

CREATE TABLE tProduct (
	ID varchar(10) NOT NULL PRIMARY KEY
	, Name varchar(100) NOT NULL
);


CREATE TABLE tClient (
	ID varchar(10) NOT NULL PRIMARY KEY
	, Name varchar(100) NOT NULL 
	, AddrLine1 varchar(255)
	, AddrLine2 varchar(255)
	, City varchar (100)
	, Country varchar (30)
	, State varchar (30)
	, Postal varchar(12)
);

CREATE TABLE tProject (
	ID varchar(10) NOT NULL PRIMARY KEY
	, Name varchar(100) NOT NULL
	, ClientID varchar(30) NOT NULL
);

CREATE TABLE tTask (
	ID varchar(10) NOT NULL PRIMARY KEY
	, Name varchar(100) NOT NULL
	, Description varchar(1000)
	, ProjectID varchar(30) NOT NULL
	, EstHours decimal (5,2)
	, ProductID varchar(30)
	, AgentID varchar(10)
);

CREATE TABLE tAgent (
	ID varchar(10) NOT NULL PRIMARY KEY 
	, Name varchar(10) NOT NULL
	, AddrLine1 varchar(255)
	, AddrLine2 varchar(255)
	, City varchar (100)
	, Country varchar (30)
	, State varchar (30)
	, Postal varchar(12)
);

CREATE TABLE tEntry (
	OwnerID varchar(30) NOT NULL
	, EntityID varchar(30) NOT NULL
	, ActualHours decimal (5, 2) NOT NULL
	, BillableHours decimal (5, 2) NOT NULL
	, Notes varchar(1000)
	, EntryDate datetime
	, InvoiceID varchar(30)
);

CREATE TABLE tEntityType (
	ID varchar(10) NOT NULL PRIMARY KEY
	, Name varchar(100) NOT NULL
);

CREATE TABLE tPeriod (
	StartDate  datetime NOT NULL
	, EndDate datetime NOT NULL
	, StatusID varchar(30)
);

CREATE TABLE tStatus (
	ID varchar (30) PRIMARY KEY
	, Name varchar (100)
	, OwnerID varchar(30)
	, EntityID varchar(30)
);

CREATE TABLE tInvoice (
	ID varchar(10) NOT NULL PRIMARY KEY
);

CREATE TABLE tEntityLink (
	EntityID varchar(30) NOT NULL
	, ToEntityID varchar(30) NOT NULL
	, Parms varchar(1000) NOT NULL
	, Name varchar(100)
);

INSERT INTO tEntityType (ID, Name) SELECT  'tTask', 'Task';

INSERT INTO tEntityType (ID, Name) SELECT 'tProject', 'Project';

INSERT INTO tEntityType (ID, Name) SELECT 'tProduct', 'Product';

INSERT INTO tEntityType (ID, Name) SELECT 'tEntry', 'Entry';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tTask', 'project', '{"ProjectID":"ID"}', 'Project(s)';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tProject', 'client', '{"ClientID":"ID"}', 'Client(s)';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tTask', 'entry', '{"ID":"OwnerID","Task":"EntityID"}', 'Entry';

CREATE VIEW vProject 
AS 
SELECT p.Name, p.ID, c.Name as ClientName, c.ID as ClientID
	FROM tProject p
	JOIN tClient c ON p.ClientID = c.ID;
    
CREATE VIEW vClient 
AS 
SELECT c.ID, c.Name, c.AddrLine1, c.AddrLine2, c.City, c.Postal, c.Country
	FROM tClient c;

	
CREATE VIEW vEntity
AS
SELECT ID, 'Project' AS Type FROM tProject
UNION
SELECT ID, 'Task' AS Type FROM tTask;
 
    
