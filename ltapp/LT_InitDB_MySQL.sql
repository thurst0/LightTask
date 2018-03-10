DROP DATABASE LTApp;

CREATE DATABASE LTApp;

USE LTApp;

CREATE TABLE tProduct (
	ID varchar(10) NOT NULL PRIMARY KEY
	, Name varchar(100) NOT NULL
);

CREATE TABLE tClient (
	ID varchar(10) NOT NULL PRIMARY KEY
	, Name varchar(100)
	, AddrLine1 varchar(255)
	, AddrLine2 varchar(255)
	, City varchar (100)
	, Country varchar (30)
	, State varchar (30)
	, Postal varchar(12)
);

CREATE TABLE tProject (
	ID varchar(30) NOT NULL
	, Name varchar(100)
	, ClientID varchar(30) NOT NULL
	, PRIMARY KEY (ID, ClientID)
);

CREATE TABLE tTask (
	ID varchar(30) NOT NULL
	, Name varchar(100)
	, Description varchar(1000)
	, ProjectID varchar(30) NOT NULL
	, EstHours decimal (5,2)
	, ProductID varchar(30)
	, AgentID varchar(10)
	, PRIMARY KEY (ID, ProjectID)
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
    , Active tinyint DEFAULT 1
);
CREATE TABLE tEntry (
	PK int PRIMARY KEY AUTO_INCREMENT
	, AgentID varchar(10) NOT NULL
	, OwnerID varchar(30) NOT NULL
	, EntityID varchar(30) NOT NULL
	, ActualHours decimal (5, 2)
	, BillableHours decimal (5, 2)
	, Notes varchar(1000)
	, EntryDate datetime NOT NULL
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

INSERT INTO tEntityType (ID, Name) SELECT 'tClient', 'Client';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tTask', 'project', '{"ProjectID":"ID"}', 'Project(s)';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tProject', 'client', '{"ClientID":"ID"}', 'Client(s)';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tTask', 'entry', '{"ID":"OwnerID","Task":"EntityID"}', 'Entry';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tClient', 'project', '{"ID":"ClientID"}', 'Project(s)';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tProject', 'task', '{"ID":"ProjectID"}', 'Task(s)';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tProject', 'entry', '{"ID":"OwnerID","Project":"EntityID"}', 'Entry';

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
    
delimiter //
CREATE TRIGGER tr_tAgent_DEL
BEFORE DELETE
ON tAgent
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Agent has entries';
	IF (SELECT 1=1 FROM tEntry e WHERE e.AgentID = OLD.ID) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
	END IF;
END;

delimiter //
CREATE TRIGGER tr_tTask_DEL
BEFORE DELETE
ON tTask
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Task has entries';
	IF (SELECT 1=1 FROM tEntry e WHERE e.OwnerID = OLD.ID AND e.EntityID = 'Task') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
END;

delimiter //
CREATE TRIGGER tr_tProject_DEL
BEFORE DELETE
ON tProject
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Project has entries';
	IF (SELECT 1=1 FROM tEntry e WHERE e.OwnerID = OLD.ID AND e.EntityID = 'Project') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Project has tasks';
    IF (SELECT 1=1 FROM tTask e WHERE e.ProjectID = OLD.ID) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
END;

delimiter //
CREATE TRIGGER tr_tClient_DEL
BEFORE DELETE
ON tClient
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Client has projects';
	IF (SELECT 1=1 FROM tProject e WHERE e.ClientID = OLD.ID) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
	END IF;
END;
