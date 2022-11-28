CREATE TABLE IF NOT EXISTS jsond (
    -- `rowid` int primary key autoincrement
    `id` TEXT PRIMARY KEY,
    `title` TEXT NOT NULL,
    `desc` TEXT,
    `date` NUMERIC NOT NULL,
    `pid` TEXT NOT NULL,
    `link` TEXT,
    `read` INT DEFAULT 0,
    `_d` INT DEFAULT 0, /* 逻辑删除 */
);

CREATE TABLE IF NOT EXISTS html (
    `pid` TEXT PRIMARY KEY,
    `data` TEXT,
    `_d` INT DEFAULT 0,
);

CREATE TABLE IF NOT EXISTS migrate (
    `ver` TEXT,
    `date` NUMERIC,
);
