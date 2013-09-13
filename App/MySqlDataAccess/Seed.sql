SET @@auto_increment_increment=1;

DROP TABLE IF EXISTS games;
CREATE TABLE games (
  Id int NOT NULL UNIQUE AUTO_INCREMENT,
  DateAndTime datetime NOT NULL,
  HomeTeamId int NOT NULL,
  AwayTeamId int NOT NULL,
  Result enum('HOME','AWAY','DRAW') DEFAULT NULL,
  RoundId int NOT NULL,
  Score varchar(255) DEFAULT NULL,
  PRIMARY KEY (Id)
);

INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES
    ('2013-02-16 15:00:00', 1, 2, 'AWAY', 1, '1 - 2'),
    ('2013-02-23 18:00:00', 3, 4, 'AWAY', 2, '4 - 0'),
    ('2013-02-23 13:30:00', 5, 6, 'HOME', 2, '2 - 3'),
    ('2013-02-16 15:00:00', 3, 6, 'HOME', 1, '1 - 3'),
    ('2014-02-23 15:00:00', 1, 2, NULL, 5, NULL),
    ('2014-02-23 18:00:00', 3, 4, NULL, 5, NULL),
    ('2014-02-23 13:30:00', 5, 6, NULL, 5, NULL),
    ('2014-02-24 15:00:00', 7, 8, NULL, 5, NULL),
    ('2014-02-24 12:00:00', 9, 10, NULL, 5, NULL),
    ('2014-02-15 12:00:00', 1, 5, NULL, 3, NULL),
    ('2014-02-25 18:00:00', 5, 1, NULL, 4, NULL),
    ('2014-12-24 15:00:00', 2, 4, NULL, 4, NULL);


DROP TABLE IF EXISTS leagues;
CREATE TABLE leagues (
  Id int NOT NULL UNIQUE AUTO_INCREMENT,
  League varchar(255) NOT NULL,
  SportId int NOT NULL,
  PRIMARY KEY (Id)
);

INSERT INTO leagues (League, SportId) VALUES
    ('English Premier League', 1);


DROP TABLE IF EXISTS picks;
CREATE TABLE picks (
  UserId int NOT NULL,
  GameId int NOT NULL,
  Pick enum('HOME','AWAY','DRAW') DEFAULT NULL,
  PRIMARY KEY (UserId,GameId)
);

INSERT INTO picks VALUES
    (1, 1, 'AWAY'),
    (2, 1, 'AWAY'),
    (1, 7, 'DRAW'),
    (1, 2, 'AWAY'),
    (1, 5, 'DRAW'),
    (1, 6, 'AWAY'),
    (1, 9, 'DRAW'),
    (1, 8, 'DRAW'),
    (1, 4, 'HOME'),
    (1, 3, 'HOME');


DROP TABLE IF EXISTS rounds;
CREATE TABLE rounds (
  Id int NOT NULL UNIQUE AUTO_INCREMENT,
  SeasonId int NOT NULL,
  RoundStartDate datetime DEFAULT NULL,
  Round int NOT NULL,
  Text varchar(255) NOT NULL,
  PRIMARY KEY (Id)
);

INSERT INTO rounds (SeasonId, RoundStartDate, Round, Text) VALUES
    (1, '2013-02-10 00:00:00', 1, 'week 1'),
    (1, '2013-02-17 00:00:00', 2, 'week 2'),
    (1, '2013-02-24 00:00:00', 3, 'week 3'),
    (1, '2013-03-03 00:00:00', 4, 'week 4'),
    (1, '2013-03-10 00:00:00', 5, 'week 5');


DROP TABLE IF EXISTS seasons;
CREATE TABLE seasons (
  Id int NOT NULL UNIQUE AUTO_INCREMENT,
  Name varchar(255) NOT NULL,
  LeagueId int NOT NULL,
  PRIMARY KEY (Id)
);

INSERT INTO seasons (Name, LeagueId) VALUES
    ('English Premier League 2012 / 2013', 1);


DROP TABLE IF EXISTS sports;
CREATE TABLE sports (
  Id int NOT NULL UNIQUE AUTO_INCREMENT,
  Name varchar(255) NOT NULL,
  AllowDraw tinyint(1) NOT NULL,
  PRIMARY KEY (Id)
);

INSERT INTO sports (Name, AllowDraw) VALUES
    ('Football', 1),
    ('Tennis', 0);


DROP TABLE IF EXISTS teams;
CREATE TABLE teams (
  Id int NOT NULL UNIQUE AUTO_INCREMENT,
  Name varchar(255) NOT NULL,
  PRIMARY KEY (Id)
);

INSERT INTO teams (Name) VALUES
    ('Manchester United'),
    ('Crystal Palace'),
    ('Aston Villa'),
    ('Newcastle'),
    ('Fulham'),
    ('West Bromwich(WBA)'),
    ('Hull City'),
    ('Cardiff City'),
    ('Stoke City'),
    ('Sunderland'),
    ('Manchester City'),
    ('Arsenal'),
    ('Tottenham Hotspur'),
    ('Norwich City'),
    ('Everton'),
    ('Chelsea FC'),
    ('Southampton'),
    ('West Ham United'),
    ('Swansea City'),
    ('Liverpool');

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  Id int NOT NULL UNIQUE AUTO_INCREMENT,
  ThirdPartyId varchar(30) NOT NULL UNIQUE,
  FacebookId varchar(20) NOT NULL UNIQUE,
  FacebookUsername varchar(100) NULL,
  Name varchar(100) NOT NULL,
  ShowInLeaderboard tinyint(1) NOT NULL,
  PRIMARY KEY (Id)
);

INSERT INTO users (ThirdPartyId, FacebookId, FacebookUsername, Name, ShowInLeaderboard) VALUES
    ('test', '1825801', 'allison.hider', 'Allison Hider', 1),
    ('test2', '2525801', 'ngchoyin', 'Brian Ng', 0),
    ('test3', '638734076', 'syringey', 'Ronald James Bacaoco Magan', 0);