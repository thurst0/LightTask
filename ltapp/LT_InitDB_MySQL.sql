DROP DATABASE LTApp;

CREATE DATABASE LTApp;

USE LTApp;

CREATE TABLE tProduct (
	ID varchar(30) NOT NULL PRIMARY KEY
	, Name varchar(100)
	, Repo varchar(30)
	, RepoOwner varchar(30)
	, StatusID varchar(30)
);

CREATE TABLE tClient (
	ID varchar(10) NOT NULL PRIMARY KEY
	, Name varchar(100)
	, StatusID varchar(30)
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
	, ProductID varchar(30)
	, StatusID varchar(30)
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
	, StatusID varchar(30)
	, PRIMARY KEY (ID, ProjectID)
);

CREATE TABLE tAgent (
	ID varchar(10) NOT NULL PRIMARY KEY 
	, Name varchar(30) NOT NULL
	, AddrLine1 varchar(255)
	, AddrLine2 varchar(255)
	, City varchar (100)
	, Country varchar (30)
	, State varchar (30)
	, Postal varchar(12)
    , StatusID varchar(30)
);

CREATE TABLE tEntry (
	PK int PRIMARY KEY AUTO_INCREMENT
	, AgentID varchar(30) NOT NULL
	, OwnerID varchar(30) NOT NULL
	, EntityID varchar(30) NOT NULL
	, ActualHours decimal (5, 2)
	, BillableHours decimal (5, 2)
	, Notes varchar(1000)
	, EntryDate datetime NOT NULL
	, InvoiceID varchar(30)
	, PeriodID varchar(30)
);

CREATE TABLE tEntityType (
	ID varchar(10) NOT NULL PRIMARY KEY
	, Name varchar(100) NOT NULL
);

CREATE TABLE tPeriod (
	ID varchar(30) PRIMARY KEY
	, Name varchar(100)
	, StartDate  datetime NOT NULL
	, EndDate datetime NOT NULL
	, StatusID varchar(30)
);

CREATE TABLE tStatus (
	ID varchar (30) PRIMARY KEY
	, Name varchar (100)
	, EntityID varchar(30) NOT NULL
);

CREATE TABLE tInvoice (
	ID varchar(10) PRIMARY KEY
);

CREATE TABLE tEntityLink (
	EntityID varchar(30) NOT NULL
	, ToEntityID varchar(30) NOT NULL
	, Parms varchar(1000) NOT NULL
	, Name varchar(100)
);

CREATE TABLE tUI (
	ID varchar(30) PRIMARY KEY
	, Name varchar(100)
	, OptionsJSON varchar(5000)
	, Visible int DEFAULT 1
	, Seq int DEFAULT 0
);

CREATE TABLE tSchema (
	UIID varchar(30) PRIMARY KEY
	, SchemaJSON varchar(5000)
);

-- UIs, Schema

INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'agent', 'Agents', '{"object":"tagent","pk":"ID","title":"Agents"}', 10;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'agent', '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name","required":1},{"name":"Address Line 1","field":"AddrLine1","caption":"Address Line 1"},{"name":"Address Line 2","field":"AddrLine2","caption":"Address Line 2"},{"name":"City","field":"City","caption":"City"},{"name":"State","field":"State","caption":"State"},{"name":"Country","field":"Country","caption":"Country"},{"name":"Postal","field":"Postal","caption":"Postal"}]';

INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'client', 'Clients', '{"object":"tclient","pk":"ID","title":"Clients"}', 20;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'client', '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Address Line 1","field":"AddrLine1","caption":"Address Line 1"},{"name":"Address Line 2","field":"AddrLine2","caption":"Address Line 2"},{"name":"City","field":"City","caption":"City"},{"name":"State","field":"State","caption":"State"},{"name":"Country","field":"Country","caption":"Country"},{"name":"Postal","field":"Postal","caption":"Postal"}]';

INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'entry', 'Entries', '{"object":"tentry","title":"Entries","pk":"PK","controller":"EntryController","template":"templates/entry.html"}', 80;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'entry', '[{"name":"Agent ID","field":"AgentID","read_only":1,"required":1,"type":"text","lookup":{"object":"tagent","cols":"ID,Name"}},{"name":"ID","field":"OwnerID","read_only":1,"required":1,"type":"text","lookup":{"object":"ventity","cols":"ID,Type","sets":"OwnerID,EntityID"}},{"name":"Entity ID","field":"EntityID","read_only":1,"required":1,"type":"text","lookup":{"object":"tentitytype","cols":"Name"}},{"name":"Actual Hours","field":"ActualHours","type":"number"},{"name":"Billable Hours","field":"BillableHours","type":"number"},{"name":"Notes","field":"Notes","type":"longtext"},{"name":"Invoice ID","field":"InvoiceID","type":"text"},{"name":"Entry Date","field":"EntryDate","type":"date", "required":1},{"name":"Period","field":"PeriodID","read_only":0,"required":0,"type":"text","lookup":{"object":"tPeriod","cols":"ID"}}]';
	
INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'project', 'Projects', '{"object":"tproject","pk":"ID","title":"Projects"}', 60;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'project', '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Client ID","field":"ClientID","caption":"Client ID","required":1, "lookup":{"object":"tclient","cols":"ID,Name"}},{"name":"Product ID","field":"ProductID","caption":"Product ID","required":0, "lookup":{"object":"tproduct","cols":"ID,Name"}}]';
	
INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'product', 'Products', '{"object":"tproduct","pk":"ID","title":"Products"}', 30;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'product', '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Repo","field":"Repo","caption":"Repo","required":0},{"name":"Repo Owner","field":"RepoOwner","caption":"Repo Owner"}]'
	
INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'period', 'Periods', '{"object":"tperiod","pk":"ID","title":"Periods"}', 40;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'period', '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Start Date","field":"StartDate","type":"date"},{"name":"End Date","field":"EndDate","type":"date"}]';
	
INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'status', 'Statuses', '{"object":"tStatus","pk":"ID","title":"Statuses"}', 50;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'status', '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Entity ID","field":"EntityID","read_only":1,"required":1,"type":"text","lookup":{"object":"tentitytype","cols":"Name"}}]';
	
INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'task', 'Tasks', '{"object":"ttask","pk":"ID","title":"Tasks"}', 70;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'task', '[{"name":"ID","field":"ID","required":1},{"name":"Name","field":"Name"},{"name":"Description","field":"Description","type":"longtext"},{"name":"Project ID","field":"ProjectID","caption":"Project ID","lookup":{"object":"tproject","cols":"ID,Name"}},{"name":"Agent","field":"AgentID","caption":"Agent ID","lookup":{"object":"tagent","cols":"ID,Name"}},{"name":"Est Hours","field":"EstHours","required":0,"type":"number"},{"name":"Status ID","field":"StatusID","caption":"Status","lookup":{"object":"tstatus","cols":"ID,Name"}}]';
	
INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'gitcommit', 'Git Commits', '{"object":"","title":"Git Commits","controller":"GitCommentController"}', 90;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'gitcommit', '[{"name":"Agent","field":"user","type":"cookie","required":1,"lookup":{"object":"tagent","cols":"ID,Name"}},{"name":"Repo","field":"repo","required":1}]';

INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'ui', 'Screens', '{"object":"tui","pk":"ID","title":"Screens"}', 100;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'ui', '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Title","field":"Name","caption":"Title"},{"name":"Options JSON","field":"OptionsJSON","caption":"Options JSON","type":"longtext"}]';

INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'schema', 'Schemas', '{"object":"tschema","pk":"UIID","title":"Schemas"}', 110;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'schema', '[{"name":"Screen ID","field":"UIID","caption":"Screen ID","required":1},{"name":"Schema JSON","field":"SchemaJSON","caption":"Schema JSON","type":"longtext"}]';

INSERT INTO tUI (ID, Name, OptionsJSON, Seq) SELECT 'entitylink', 'Entity Links', '{"object":"tentitylink","pk":"EntityID,ToEntityID","title":"Shortcuts"}', 120;
INSERT INTO tSchema (UIID, SchemaJSON) SELECT 'entitylink', '[{"name":"Object","field":"FromEntityID","caption":"Object","required":1},{"name":"UI","field":"ToEntityID","caption":"Screen","type":"text"},{"name":"Parms","field":"Parms","caption":"Parms","type":"text","required":1},{"name":"Name","field":"Name","caption":"Title","type":"text"}]';

-- entity types

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

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tProject', 'product', '{"ProductID":"ID"}', 'Product';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tProduct', 'project', '{"ID":"ProductID"}', 'Project(s)';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tPeriod', 'entry', '{"ID":"PeriodID"}', 'Entrie(s)';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tUI', 'schema', '{"ID":"UIID"}', 'Schema';

INSERT INTO tEntityLink (EntityID, ToEntityID, Parms, Name) SELECT  'tSchema', 'ui', '{"UIID":"ID"}', 'Screen(s)';

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

CREATE VIEW vTask
AS 
SELECT t.ID, t.Name, SUM(e.ActualHours) AS ActualHours, t.EstHours, e.ActualHours / t.EstHours * 100 AS ProgressPercent
	, p.ID AS ProjectID, p.Name AS ProjectName
    FROM tTask t
    JOIN tProject p ON p.ID = t.ProjectID
	LEFT OUTER JOIN tEntry e ON e.OwnerID = t.ID AND e.EntityID = 'Task'
GROUP BY t.ID, t.Name, p.ID, p.Name

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
-- insert and update triggers

delimiter //
CREATE TRIGGER tr_tProject_UPD
BEFORE UPDATE
ON tProject
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Client does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tClient e WHERE e.ID = NEW.ClientID) AND (NEW.ClientID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Product does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tProduct e WHERE e.ID = NEW.ProductID) AND (NEW.ProductID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
END;

delimiter //
CREATE TRIGGER tr_tProject_INS
BEFORE INSERT
ON tProject
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Client does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tClient e WHERE e.ID = NEW.ClientID) AND (NEW.ClientID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Product does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tProduct e WHERE e.ID = NEW.ProductID) AND (NEW.ProductID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
END;

delimiter //
CREATE TRIGGER tr_tStatus_UPD
BEFORE UPDATE
ON tStatus
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Entity does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tEntityType e WHERE e.ID = NEW.EntityID) AND (NEW.EntityID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
END;

delimiter //
CREATE TRIGGER tr_tStatus_UPD
BEFORE INSERT
ON tStatus
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Entity does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tEntityType e WHERE e.Name = NEW.EntityID) AND (NEW.EntityID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
END;

delimiter //
CREATE TRIGGER tr_tTask_UPD
BEFORE UPDATE
ON tTask
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Project does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tProject e WHERE e.ID = NEW.ProjectID) AND (NEW.ProjectID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Agent does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tAgent e WHERE e.ID = NEW.AgentID) AND (NEW.AgentID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Status invalid';
	IF NOT EXISTS (SELECT 1 = 1 FROM tStatus e WHERE e.ID = NEW.StatusID AND e.EntityID = 'Task') AND (NEW.StatusID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
END;

delimiter //
CREATE TRIGGER tr_tTask_INS
BEFORE INSERT
ON tTask
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Project does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tProject e WHERE e.ID = NEW.ProjectID) AND (NEW.ProjectID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Agent does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tAgent e WHERE e.ID = NEW.AgentID) AND (NEW.AgentID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Status invalid';
	IF NOT EXISTS (SELECT 1 = 1 FROM tStatus e WHERE e.ID = NEW.StatusID AND e.EntityID = 'Task') AND (NEW.StatusID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
END;

delimiter //
CREATE TRIGGER tr_tEntry_INS
BEFORE INSERT
ON tEntry
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Project does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tProject e WHERE e.ID = NEW.OwnerID) AND (NEW.EntityID = 'Project') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Task does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tTask e WHERE e.ID = NEW.OwnerID) AND (NEW.EntityID = 'Task') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Entity invalid';
	IF NOT EXISTS (SELECT 1 = 1 FROM tEntityType e WHERE e.Name = NEW.EntityID) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
	SET msg = 'Agent does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tAgent e WHERE e.ID = NEW.AgentID) AND (NEW.AgentID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
END;

delimiter //
CREATE TRIGGER tr_tEntry_UPD
BEFORE UPDATE
ON tEntry
FOR EACH ROW
BEGIN
	DECLARE msg varchar(128);
    SET msg = 'Project does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tProject e WHERE e.ID = NEW.OwnerID) AND (NEW.EntityID = 'Project') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Task does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tTask e WHERE e.ID = NEW.OwnerID) AND (NEW.EntityID = 'Task') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
    SET msg = 'Entity invalid';
	IF NOT EXISTS (SELECT 1 = 1 FROM tEntityType e WHERE e.Name = NEW.EntityID) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
	SET msg = 'Agent does not exist';
	IF NOT EXISTS (SELECT 1 = 1 FROM tAgent e WHERE e.ID = NEW.AgentID) AND (NEW.AgentID IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg; 
	END IF;
END;
