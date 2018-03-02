CREATE TABLE tProduct (
	RP uniqueidentifier PRIMARY KEY
	, ProductID varchar(10) NOT NULL
	, ProductName varchar(100) NOT NULL
)

CREATE TABLE tClients (
	RP uniqueidentifier PRIMARY KEY
	, ClientID varchar(10) NOT NULL
	, ClientName varchar(100) NOT NULL 
	, AddrLine1 varchar(255)
	, AddrLine2 varchar(255)
	, City varchar (100)
	, Country varchar (30)
	, Postal varchar(12)
)

CREATE TABLE tProjects (
	RP uniqueidentifier PRIMARY KEY
	, ProjectID varchar(10) NOT NULL
	, ProjectName varchar(100) NOT NULL
	, ClientRP uniqueidentifier NOT NULL
)

CREATE TABLE tTask (
	RP uniqueidentifier PRIMARY KEY
	, TaskID varchar(10) NOT NULL
	, TaskName varchar(100) NOT NULL
	, Descrition varchar(MAX)
	, ProjectRP uniqueidentifier NOT NULL
	, EstHours decimal (5,2)
	, ProductRP uniqueidentifier NOT NULL
)

CREATE TABLE tAgent (
	RP uniqueidentifier PRIMARY KEY
	, AgentID varchar(10) NOT NULL 
	, AgentName varchar(10) NOT NULL
	, AddrLine1 varchar(255)
	, AddrLine2 varchar(255)
	, City varchar (100)
	, Country varchar (30)
	, Postal varchar(12)
)

CREATE TABLE tEntry (
	, RP uniqueidentifier PRIMARY KEY
	, OwnerRP uniqueidentifier NOT NULL
	, EntityTypeRP varchar(100) NOT NULL
	, ActualHours decimal (5, 2) NOT NULL
	, BillableHours decimal (5, 2) NOT NULL
	, Notes varchar(max)
	, EntryDate datetime
)

CREATE TABLE tEntityType (
	RP uniqueidentifier PRIMARY KEY
	, EntityID varchar(10) NOT NULL
	, EntityName varchar(100) NOT NULL
)

CREATE TABLE tPeriod (
	RP uniqueidentifier PRIMARY KEY
	, StartDate  datetime NOT NULL
	, EndDate datetime NOT NULL
	, StatusKey int
)

CREATE TABLE tStatus (
	RP uniqueidentifier PRIMARY KEY
	, StatusID varchar (30)
	, StatusName varchar (100)
	, OwnerRP uniqueidentifier NOT NULL
	, EntityTypeRP varchar(100) NOT NULL
)

INSERT INTO tEntityType SELECT newid(), 'tTask', 'Task'

INSERT INTO tEntityType SELECT newid(), 'tProject', 'Project'

INSERT INTO tEntityType SELECT newid(), 'tProduct', 'Product'

GO

USE master

CREATE LOGIN LTAdmin WITH PASSWORD = 'LT123'

ALTER SERVER ROLE sysadmin ADD MEMBER LTAdmin