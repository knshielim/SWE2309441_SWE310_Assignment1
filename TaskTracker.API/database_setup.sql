IF DB_ID('TaskTrackerDB') IS NULL
BEGIN
    CREATE DATABASE TaskTrackerDB;
END
GO

USE TaskTrackerDB;
GO

IF OBJECT_ID('dbo.ProjectUpdates', 'U') IS NOT NULL DROP TABLE dbo.ProjectUpdates;
IF OBJECT_ID('dbo.Comments', 'U') IS NOT NULL DROP TABLE dbo.Comments;
IF OBJECT_ID('dbo.Tasks', 'U') IS NOT NULL DROP TABLE dbo.Tasks;
IF OBJECT_ID('dbo.Projects', 'U') IS NOT NULL DROP TABLE dbo.Projects;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

CREATE TABLE dbo.Users (
    UserId    INT IDENTITY(1,1) PRIMARY KEY,
    Name      NVARCHAR(100) NOT NULL,
    Email     NVARCHAR(150) NOT NULL UNIQUE,
    Role      NVARCHAR(50)  NOT NULL DEFAULT 'Member',
    CreatedAt DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.Projects (
    ProjectId   INT IDENTITY(1,1) PRIMARY KEY,
    Name        NVARCHAR(150) NOT NULL,
    Description NVARCHAR(500) NULL,
    OwnerId     INT NULL,
    Status      NVARCHAR(50) NOT NULL DEFAULT 'Not Started',
    CreatedAt   DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Project_User FOREIGN KEY (OwnerId) REFERENCES dbo.Users(UserId)
);
GO

CREATE TABLE dbo.Tasks (
    TaskId       INT IDENTITY(1,1) PRIMARY KEY,
    Title        NVARCHAR(200) NOT NULL,
    Description  NVARCHAR(1000) NULL,
    Status       NVARCHAR(50) NOT NULL DEFAULT 'To Do',
    Priority     NVARCHAR(50) NOT NULL DEFAULT 'Medium',
    DueDate      DATETIME2 NULL,
    ProjectId    INT NOT NULL,
    AssignedTo   INT NULL,
    CreatedAt    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Task_Project FOREIGN KEY (ProjectId) REFERENCES dbo.Projects(ProjectId) ON DELETE CASCADE,
    CONSTRAINT FK_Task_User FOREIGN KEY (AssignedTo) REFERENCES dbo.Users(UserId)
);
GO

CREATE TABLE dbo.Comments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    TaskId    INT NOT NULL,
    UserId    INT NOT NULL,
    Content   NVARCHAR(1000) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Comment_Task FOREIGN KEY (TaskId) REFERENCES dbo.Tasks(TaskId) ON DELETE CASCADE,
    CONSTRAINT FK_Comment_User FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
);
GO

CREATE TABLE dbo.ProjectUpdates (
    UpdateId   INT IDENTITY(1,1) PRIMARY KEY,
    ProjectId  INT NOT NULL,
    UserId     INT NOT NULL,
    Title      NVARCHAR(200) NOT NULL,
    Content    NVARCHAR(1000) NOT NULL,
    CreatedAt  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Update_Project FOREIGN KEY (ProjectId) REFERENCES dbo.Projects(ProjectId) ON DELETE CASCADE,
    CONSTRAINT FK_Update_User FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
);
GO

INSERT INTO dbo.Users (Name, Email, Role, CreatedAt) VALUES
('Jordan Mitchell', 'jordan.mitchell@techcorp.com', 'Project Manager', SYSUTCDATETIME()),
('Sarah Lim', 'sarah.lim@techcorp.com', 'Lead Developer', SYSUTCDATETIME()),
('Daniel Tan', 'daniel.tan@techcorp.com', 'Backend Developer', SYSUTCDATETIME()),
('Priya Nair', 'priya.nair@techcorp.com', 'Frontend Developer', SYSUTCDATETIME()),
('Marcus Wong', 'marcus.wong@techcorp.com', 'Frontend Developer', SYSUTCDATETIME()),
('Aisha Rahman', 'aisha.rahman@techcorp.com', 'QA Engineer', SYSUTCDATETIME()),
('Tom Hendricks', 'tom.hendricks@techcorp.com', 'DevOps Engineer', SYSUTCDATETIME()),
('Chloe Park', 'chloe.park@techcorp.com', 'UI/UX Designer', SYSUTCDATETIME()),
('Ryan Chong', 'ryan.chong@techcorp.com', 'Backend Developer', SYSUTCDATETIME()),
('Natasha Cruz', 'natasha.cruz@techcorp.com', 'Business Analyst', SYSUTCDATETIME());
GO

INSERT INTO dbo.Projects (Name, Description, OwnerId, Status, CreatedAt) VALUES
('Company Website Redesign', 'Update the main company website with a fresh look', 1, 'In Progress', SYSUTCDATETIME()),
('Staff Leave Tracker', 'Let staff apply for leave and managers approve it', 9, 'In Progress', SYSUTCDATETIME()),
('Internal Chat Tool', 'A simple messaging app for the office team', 2, 'In Progress', SYSUTCDATETIME()),
('Inventory Management', 'Track office supplies and equipment stock levels', 4, 'In Progress', SYSUTCDATETIME()),
('Weekly Report Generator', 'Auto-generate weekly progress reports for each team', 10, 'Not Started', SYSUTCDATETIME()),
('Customer Feedback Portal', 'Collect and analyze user feedback from clients', 6, 'Completed', SYSUTCDATETIME()),
('Payroll Dashboard', 'Visualize payroll trends and monthly summaries', 3, 'Not Started', SYSUTCDATETIME()),
('Knowledge Base Revamp', 'Improve internal documentation and searchability', 5, 'Not Started', SYSUTCDATETIME()),
('Onboarding Workflow', 'Digitize onboarding checklists for new hires', 7, 'Not Started', SYSUTCDATETIME()),
('API Performance Monitor', 'Track endpoint latency and error rates in real time', 9, 'Completed', SYSUTCDATETIME());
GO

INSERT INTO dbo.Tasks (Title, Description, Status, Priority, DueDate, ProjectId, AssignedTo, CreatedAt) VALUES
('Gather content from marketing team', NULL, 'Completed', 'High', '2026-04-05', 1, 10, SYSUTCDATETIME()),
('Design new homepage layout in Figma', NULL, 'Completed', 'High', '2026-04-10', 1, 8, SYSUTCDATETIME()),
('Build homepage in HTML and CSS', NULL, 'In Progress', 'High', '2026-05-20', 1, 4, SYSUTCDATETIME()),
('Test website on mobile devices', NULL, 'To Do', 'Medium', '2026-05-26', 1, 6, SYSUTCDATETIME()),
('Deploy website to production server', NULL, 'To Do', 'High', '2026-05-30', 1, 7, SYSUTCDATETIME()),
('Design leave request form', NULL, 'Completed', 'Medium', '2026-04-12', 2, 8, SYSUTCDATETIME()),
('Build leave submission form', NULL, 'Completed', 'High', '2026-04-18', 2, 3, SYSUTCDATETIME()),
('Build manager approval dashboard', NULL, 'In Progress', 'High', '2026-05-22', 2, 9, SYSUTCDATETIME()),
('Send email notification on approval', NULL, 'To Do', 'Medium', '2026-05-27', 2, 3, SYSUTCDATETIME()),
('Test full leave request workflow', NULL, 'To Do', 'Medium', '2026-05-29', 2, 6, SYSUTCDATETIME()),
('Set up chat room database schema', NULL, 'Completed', 'High', '2026-04-15', 3, 2, SYSUTCDATETIME()),
('Build send and receive message API', NULL, 'In Progress', 'High', '2026-05-21', 3, 9, SYSUTCDATETIME()),
('Build chat UI with message bubbles', NULL, 'In Progress', 'Medium', '2026-05-24', 3, 5, SYSUTCDATETIME()),
('Add online or offline user status', NULL, 'To Do', 'Low', '2026-05-29', 3, 5, SYSUTCDATETIME()),
('Test chat with multiple users at once', NULL, 'To Do', 'Medium', '2026-05-31', 3, 6, SYSUTCDATETIME()),
('List all inventory items in a table', NULL, 'Completed', 'Medium', '2026-04-20', 4, 4, SYSUTCDATETIME()),
('Add form to add and edit stock items', NULL, 'In Progress', 'Medium', '2026-05-23', 4, 4, SYSUTCDATETIME()),
('Show low stock warning when qty below 5', NULL, 'To Do', 'Low', '2026-05-28', 4, 5, SYSUTCDATETIME()),
('Export inventory list to Excel', NULL, 'To Do', 'Low', '2026-05-30', 4, 10, SYSUTCDATETIME()),
('Auto-generate weekly summary from tasks', NULL, 'To Do', 'High', '2026-05-31', 5, 2, SYSUTCDATETIME());
GO

INSERT INTO dbo.Comments (TaskId, UserId, Content, CreatedAt) VALUES
(3, 1, 'Homepage layout approved by marketing. Please use the latest brand colours.', SYSUTCDATETIME()),
(3, 4, 'Started on the hero section. Will push a draft by Friday.', SYSUTCDATETIME()),
(8, 9, 'Manager dashboard is about 60% done. Need API spec for approval endpoint.', SYSUTCDATETIME()),
(8, 1, 'I will share the approval flow document this afternoon.', SYSUTCDATETIME()),
(12, 9, 'Message API endpoints are ready for testing on localhost.', SYSUTCDATETIME()),
(12, 2, 'Great work. QA will pick this up next sprint.', SYSUTCDATETIME()),
(17, 4, 'Low stock alert triggers correctly when quantity is below 5.', SYSUTCDATETIME()),
(1, 10, 'All copy from marketing has been uploaded to the shared folder.', SYSUTCDATETIME()),
(4, 6, 'Mobile testing blocked until staging build is deployed.', SYSUTCDATETIME()),
(13, 5, 'Chat bubbles styled. Need feedback on spacing for long messages.', SYSUTCDATETIME()),
(20, 2, 'Report generator should pull completed tasks from the last 7 days only.', SYSUTCDATETIME()),
(7, 3, 'Leave form validation done. Ready for integration with approval dashboard.', SYSUTCDATETIME());
GO

INSERT INTO dbo.ProjectUpdates (ProjectId, UserId, Title, Content, CreatedAt) VALUES
(1, 1, 'Website Redesign Kickoff', 'Project officially started. Team assigned and initial planning complete.', SYSUTCDATETIME()),
(1, 8, 'Design Phase Complete', 'All UI/UX designs have been approved and handed off to development team.', SYSUTCDATETIME()),
(2, 9, 'Leave Tracker Milestone', 'Core functionality for leave requests is now complete. Moving to approval workflow.', SYSUTCDATETIME()),
(3, 2, 'Chat Tool Beta Release', 'Internal chat tool is ready for beta testing within the team.', SYSUTCDATETIME()),
(4, 4, 'Inventory System Update', 'Added barcode scanning feature for faster stock management.', SYSUTCDATETIME()),
(5, 10, 'Report Generator Design', 'Weekly report templates have been finalized and approved by management.', SYSUTCDATETIME()),
(6, 6, 'Feedback Portal Launch', 'Customer feedback portal is now live and collecting user responses.', SYSUTCDATETIME()),
(7, 3, 'Payroll Integration', 'Payroll system successfully integrated with HR database.', SYSUTCDATETIME()),
(8, 5, 'Knowledge Base Migration', 'Legacy documentation has been migrated to the new knowledge base system.', SYSUTCDATETIME()),
(9, 7, 'Onboarding Automation', 'Automated onboarding workflows have been implemented for new hires.', SYSUTCDATETIME()),
(10, 9, 'API Monitoring Dashboard', 'Real-time API performance monitoring dashboard is now operational.', SYSUTCDATETIME());
GO