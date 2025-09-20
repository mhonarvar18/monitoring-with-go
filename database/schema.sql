-- ActionLog Table
CREATE TABLE IF NOT EXISTS ActionLog (
    old_id INTEGER,
    model TEXT NOT NULL,
    action TEXT NOT NULL,
    note TEXT,
    "userInfo" JSON,
    "changedFields" JSON,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" TEXT,  -- UUID as TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    model_id TEXT,  -- UUID as TEXT
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- Alarm Table
CREATE TABLE IF NOT EXISTS Alarm (
    old_id INTEGER,
    code INTEGER NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL,  -- ENUM replaced with TEXT
    protocol TEXT NOT NULL,  -- ENUM replaced with TEXT
    description TEXT,
    action TEXT DEFAULT 'NONE' NOT NULL,  -- ENUM replaced with TEXT
    "old_panelTypeId" INTEGER,
    "categoryId" TEXT,  -- UUID as TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    "panelTypeId" TEXT,  -- UUID as TEXT
    version INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "deletedAt" TIMESTAMP
);

-- AlarmCategory Table
CREATE TABLE IF NOT EXISTS AlarmCategory (
    old_id INTEGER,
    label TEXT NOT NULL,
    code INTEGER NOT NULL,
    "needsApproval" BOOLEAN DEFAULT false NOT NULL,
    priority TEXT DEFAULT 'NONE' NOT NULL,  -- ENUM replaced with TEXT
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- AppSetting Table
CREATE TABLE IF NOT EXISTS AppSetting (
    old_id INTEGER,
    key TEXT NOT NULL,
    value TEXT,
    "isVisible" BOOLEAN DEFAULT true NOT NULL,
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- AuthLog Table
CREATE TABLE IF NOT EXISTS AuthLog (
    old_id INTEGER,
    ip TEXT,
    "loginTime" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "logoutTime" TIMESTAMP NOT NULL,
    "userId" TEXT,  -- UUID as TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- Branch Table
CREATE TABLE IF NOT EXISTS Branch (
    old_id INTEGER,
    name TEXT NOT NULL,
    "old_locationId" INTEGER,
    code INTEGER NOT NULL,
    address TEXT,
    "phoneNumber" TEXT,
    "destinationPhoneNumber" TEXT,
    "imgUrl" TEXT,
    "panelIp" TEXT,
    "panelCode" INTEGER,
    "emergencyCall" TEXT,
    "old_panelTypeId" INTEGER,
    "old_receiverId" INTEGER,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    "receiverId" TEXT,  -- UUID as TEXT
    "panelTypeId" TEXT,  -- UUID as TEXT
    "mainPartitionId" TEXT,  -- UUID as TEXT
    "locationId" TEXT,  -- UUID as TEXT
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- Employee Table
CREATE TABLE IF NOT EXISTS Employee (
    old_id INTEGER,
    "localId" INTEGER NOT NULL,
    name TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "nationalCode" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "branchId" TEXT,  -- UUID as TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- Equipment Table
CREATE TABLE IF NOT EXISTS Equipment (
    old_id INTEGER,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    "imgUrl" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "branchId" TEXT,  -- UUID as TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- Event Table
CREATE TABLE IF NOT EXISTS Event (
    "originalZoneId" TEXT,
    "originalPartitionId" TEXT,
    "referenceId" TEXT,
    "time" TEXT NOT NULL,
    date TEXT NOT NULL,
    "originalEmployeeId" TEXT,
    "originalBranchCode" TEXT,
    ip TEXT,
    description TEXT,
    "confirmationStatus" TEXT,  -- ENUM replaced with TEXT
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "alarmId" TEXT,  -- UUID as TEXT
    "branchId" TEXT,  -- UUID as TEXT
    "zoneId" TEXT,  -- UUID as TEXT
    "partitionId" TEXT,  -- UUID as TEXT
    "employeeId" TEXT,  -- UUID as TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    old_id INTEGER,
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP,
    "dedupHash" TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_event_deduphash_active
ON "Event"("dedupHash")
WHERE "deletedAt" IS NULL;

-- Location Table
CREATE TABLE IF NOT EXISTS Location (
    old_id INTEGER,
    label TEXT NOT NULL,
    "old_parentId" INTEGER,
    type TEXT NOT NULL,  -- ENUM replaced with TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    "parentId" TEXT,  -- UUID as TEXT
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP,
    sort INTEGER
);

-- Meta Table
CREATE TABLE IF NOT EXISTS Meta (
    old_id INTEGER,
    key TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    value TEXT,
    "expiresAt" INTEGER NOT NULL,
    "timeElapsed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- PanelType Table
CREATE TABLE IF NOT EXISTS PanelType (
    old_id INTEGER,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    code INTEGER NOT NULL,
    delimiter TEXT NOT NULL,
    "eventFormat" TEXT[],  -- Text array
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- Partition Table
CREATE TABLE IF NOT EXISTS Partition (
    old_id INTEGER,
    label TEXT NOT NULL,
    "localId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "old_branchDefaultId" INTEGER,
    "branchId" TEXT,  -- UUID as TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    "branchDefaultId" TEXT,  -- UUID as TEXT
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- Permission Table
CREATE TABLE IF NOT EXISTS Permission (
    action TEXT NOT NULL,  -- ENUM replaced with TEXT
    model TEXT NOT NULL,
    field TEXT,
    description TEXT,
    old_id INTEGER,
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- PersonalSetting Table
CREATE TABLE IF NOT EXISTS PersonalSetting (
    old_id INTEGER,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "userId" TEXT,  -- UUID as TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- Receiver Table
CREATE TABLE IF NOT EXISTS Receiver (
    old_id INTEGER,
    token TEXT NOT NULL,
    model TEXT NOT NULL,
    protocol TEXT NOT NULL,  -- ENUM replaced with TEXT
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- User Table
CREATE TABLE IF NOT EXISTS User (
    old_id INTEGER,
    fullname TEXT NOT NULL,
    username TEXT NOT NULL,
    "nationalityCode" TEXT NOT NULL,
    password TEXT NOT NULL,
    type TEXT NOT NULL,  -- ENUM replaced with TEXT
    "personalCode" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "fatherName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    address TEXT NOT NULL,
    ip TEXT NOT NULL,
    status TEXT DEFAULT 'OFFLINE' NOT NULL,  -- ENUM replaced with TEXT
    "old_locationId" INTEGER,
    "ConfirmationTime" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    "locationId" TEXT,  -- UUID as TEXT
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- UserPermission Table
CREATE TABLE IF NOT EXISTS UserPermission (
    old_id INTEGER,
    "modelId" INTEGER,
    "userId" TEXT,  -- UUID as TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    "old_permissionId" INTEGER,
    "permissionId" TEXT,  -- UUID as TEXT
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- UserSetting Table
CREATE TABLE IF NOT EXISTS UserSetting (
    old_id INTEGER,
    "alarmColor" TEXT,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "alarmCategoryId" TEXT,  -- UUID as TEXT
    "userId" TEXT,  -- UUID as TEXT
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- Zone Table
CREATE TABLE IF NOT EXISTS Zone (
    old_id INTEGER,
    "localId" INTEGER NOT NULL,
    label TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    "zoneTypeId" TEXT,  -- UUID as TEXT
    "partitionId" TEXT,  -- UUID as TEXT
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);

-- ZoneType Table
CREATE TABLE IF NOT EXISTS ZoneType (
    old_id INTEGER,
    label TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    id TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,  -- Auto-generated UUID (TEXT)
    version INTEGER DEFAULT 0 NOT NULL,
    "deletedAt" TIMESTAMP
);
