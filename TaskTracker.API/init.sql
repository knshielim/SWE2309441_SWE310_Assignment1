-- Seed Users

INSERT INTO Users (Name, Email, Role, CreatedAt) VALUES
    ('Jordan Mitchell',  'jordan.mitchell@techcorp.com',  'Project Manager', GETDATE()),
    ('Sarah Lim',        'sarah.lim@techcorp.com',        'Lead Developer',  GETDATE()),
    ('Daniel Tan',       'daniel.tan@techcorp.com',       'Backend Developer', GETDATE()),
    ('Priya Nair',       'priya.nair@techcorp.com',       'Frontend Developer', GETDATE()),
    ('Marcus Wong',      'marcus.wong@techcorp.com',      'Frontend Developer', GETDATE()),
    ('Aisha Rahman',     'aisha.rahman@techcorp.com',     'QA Engineer', GETDATE()),
    ('Tom Hendricks',    'tom.hendricks@techcorp.com',    'DevOps Engineer', GETDATE()),
    ('Chloe Park',       'chloe.park@techcorp.com',       'UI/UX Designer', GETDATE()),
    ('Ryan Chong',       'ryan.chong@techcorp.com',       'Backend Developer', GETDATE()),
    ('Natasha Cruz',     'natasha.cruz@techcorp.com',     'Business Analyst', GETDATE());

-- Seed Projects

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

-- Seed Tasks

INSERT INTO Tasks (Title, Status, Priority, DueDate, ProjectId, AssignedTo, CreatedAt) VALUES
    ('Gather content from marketing team',        'Completed',   'High',   '2026-04-05', 1, 10, GETDATE()),
    ('Design new homepage layout in Figma',       'Completed',   'High',   '2026-04-10', 1,  8, GETDATE()),
    ('Build homepage in HTML and CSS',            'In Progress', 'High',   '2026-05-20', 1,  4, GETDATE()),
    ('Test website on mobile devices',            'To Do',       'Medium', '2026-05-26', 1,  6, GETDATE()),
    ('Deploy website to production server',       'To Do',       'High',   '2026-05-30', 1,  7, GETDATE()),
    ('Design leave request form',                 'Completed',   'Medium', '2026-04-12', 2,  8, GETDATE()),
    ('Build leave submission form',               'Completed',   'High',   '2026-04-18', 2,  3, GETDATE()),
    ('Build manager approval dashboard',          'In Progress', 'High',   '2026-05-22', 2,  9, GETDATE()),
    ('Send email notification on approval',       'To Do',       'Medium', '2026-05-27', 2,  3, GETDATE()),
    ('Test full leave request workflow',          'To Do',       'Medium', '2026-05-29', 2,  6, GETDATE()),
    ('Set up chat room database schema',          'Completed',   'High',   '2026-04-15', 3,  2, GETDATE()),
    ('Build send and receive message API',        'In Progress', 'High',   '2026-05-21', 3,  9, GETDATE()),
    ('Build chat UI with message bubbles',        'In Progress', 'Medium', '2026-05-24', 3,  5, GETDATE()),
    ('Add online or offline user status',         'To Do',       'Low',    '2026-05-29', 3,  5, GETDATE()),
    ('Test chat with multiple users at once',     'To Do',       'Medium', '2026-05-31', 3,  6, GETDATE()),
    ('List all inventory items in a table',       'Completed',   'Medium', '2026-04-20', 4,  4, GETDATE()),
    ('Add form to add and edit stock items',      'In Progress', 'Medium', '2026-05-23', 4,  4, GETDATE()),
    ('Show low stock warning when qty below 5',   'To Do',       'Low',    '2026-05-28', 4,  5, GETDATE()),
    ('Export inventory list to Excel',            'To Do',       'Low',    '2026-05-30', 4, 10, GETDATE()),
    ('Auto-generate weekly summary from tasks',   'To Do',       'High',   '2026-05-31', 5,  2, GETDATE());

-- Seed Comments

INSERT INTO Comments (TaskId, UserId, Content, CreatedAt) VALUES
    (3, 1, 'Homepage layout approved by marketing. Please use the latest brand colours.', GETDATE()),
    (3, 4, 'Started on the hero section. Will push a draft by Friday.', GETDATE()),
    (8, 9, 'Manager dashboard is about 60% done. Need API spec for approval endpoint.', GETDATE()),
    (8, 1, 'I will share the approval flow document this afternoon.', GETDATE()),
    (12, 9, 'Message API endpoints are ready for testing on localhost.', GETDATE()),
    (12, 2, 'Great work. QA will pick this up next sprint.', GETDATE()),
    (17, 4, 'Low stock alert triggers correctly when quantity is below 5.', GETDATE()),
    (1, 10, 'All copy from marketing has been uploaded to the shared folder.', GETDATE()),
    (4, 6, 'Mobile testing blocked until staging build is deployed.', GETDATE()),
    (13, 5, 'Chat bubbles styled. Need feedback on spacing for long messages.', GETDATE()),
    (20, 2, 'Report generator should pull completed tasks from the last 7 days only.', GETDATE()),
    (7, 3, 'Leave form validation done. Ready for integration with approval dashboard.', GETDATE());

-- Seed ProjectUpdates

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
