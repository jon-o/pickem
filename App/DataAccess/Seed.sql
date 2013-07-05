-- phpMyAdmin SQL Dump
-- version 2.11.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 01, 2013 at 04:43 PM
-- Server version: 5.1.57
-- PHP Version: 5.2.17

--SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: a9885975_pickem
--

-- --------------------------------------------------------

--
-- Table structure for table games
--

DROP TABLE IF EXISTS games;

DROP TYPE IF EXISTS result;
CREATE TYPE result AS ENUM ('HOME', 'AWAY', 'DRAW');

CREATE TABLE games (
  Id serial NOT NULL,
  DateAndTime timestamp WITH time zone NOT NULL,
  HomeTeamId integer NOT NULL,
  AwayTeamId integer NOT NULL,
  Result result DEFAULT NULL,
  RoundId integer NOT NULL,
  Score varchar(255) DEFAULT NULL,
  PRIMARY KEY (Id)
);

--
-- Dumping data for table games
--

INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES('2013-02-16 15:00:00 +00:00', 1, 2, 'DRAW', 1, '1 - 1');
INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES('2013-02-23 18:00:00 +00:00', 3, 4, NULL, 2, NULL);
INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES('2013-02-23 13:30:00 +00:00', 5, 6, 'HOME', 2, '2 - 3');
INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES('2013-02-16 15:00:00 +00:00', 3, 6, NULL, 1, NULL);
INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES('2014-02-23 15:00:00 +00:00', 1, 2, NULL, 5, NULL);
INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES('2014-02-23 18:00:00 +00:00', 3, 4, NULL, 5, NULL);
INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES('2014-02-23 13:30:00 +00:00', 5, 6, NULL, 5, NULL);
INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES('2014-02-24 15:00:00 +00:00', 7, 8, NULL, 5, NULL);
INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES('2014-02-24 12:00:00 +00:00', 9, 10, NULL, 5, NULL);

-- --------------------------------------------------------

--
-- Table structure for table leagues
--

DROP TABLE IF EXISTS leagues;
CREATE TABLE leagues (
  Id serial NOT NULL,
  League varchar(255) NOT NULL,
  SportId integer NOT NULL,
  PRIMARY KEY (Id)
);

--
-- Dumping data for table leagues
--

INSERT INTO leagues (League, SportId) VALUES('English Premier League', 1);

-- --------------------------------------------------------

--
-- Table structure for table picks
--

DROP TABLE IF EXISTS picks;

DROP TYPE IF EXISTS pick;
CREATE TYPE pick AS ENUM ('HOME', 'AWAY', 'DRAW');

CREATE TABLE picks (
  UserId integer NOT NULL,
  GameId integer NOT NULL,
  Pick pick DEFAULT NULL,
  PRIMARY KEY (UserId,GameId)
);

--
-- Dumping data for table picks
--

INSERT INTO picks VALUES(1, 1, 'DRAW');
INSERT INTO picks VALUES(2, 1, 'DRAW');
INSERT INTO picks VALUES(1, 7, 'DRAW');
INSERT INTO picks VALUES(1, 2, 'AWAY');
INSERT INTO picks VALUES(1, 5, 'DRAW');
INSERT INTO picks VALUES(1, 6, 'AWAY');
INSERT INTO picks VALUES(1, 9, 'DRAW');
INSERT INTO picks VALUES(1, 8, 'DRAW');
-- --------------------------------------------------------

--
-- Table structure for table rounds
--

DROP TABLE IF EXISTS rounds;
CREATE TABLE rounds (
  Id serial NOT NULL,
  SeasonId integer NOT NULL,
  RoundStartDate timestamp WITH time zone DEFAULT NULL,
  Round integer NOT NULL,
  Text varchar(255) NOT NULL,
  PRIMARY KEY (Id)
);

--
-- Dumping data for table rounds
--

INSERT INTO rounds (SeasonId, RoundStartDate, Round, Text) VALUES(1, '2013-02-10 00:00:00 +00:00', 1, 'week 1');
INSERT INTO rounds (SeasonId, RoundStartDate, Round, Text) VALUES(1, '2013-02-17 00:00:00 +00:00', 2, 'week 2');
INSERT INTO rounds (SeasonId, RoundStartDate, Round, Text) VALUES(1, '2013-02-24 00:00:00 +00:00', 3, 'week 3');
INSERT INTO rounds (SeasonId, RoundStartDate, Round, Text) VALUES(1, '2013-03-03 00:00:00 +00:00', 4, 'week 4');
INSERT INTO rounds (SeasonId, RoundStartDate, Round, Text) VALUES(1, '2013-03-10 00:00:00 +00:00', 5, 'week 5');

-- --------------------------------------------------------

--
-- Table structure for table seasons
--

DROP TABLE IF EXISTS seasons;
CREATE TABLE seasons (
  Id serial NOT NULL,
  Name varchar(255) NOT NULL,
  LeagueId integer NOT NULL,
  PRIMARY KEY (Id)
);

--
-- Dumping data for table seasons
--

INSERT INTO seasons (Name, LeagueId) VALUES('English Premier League 2012 / 2013', 1);

-- --------------------------------------------------------

--
-- Table structure for table sports
--

DROP TABLE IF EXISTS sports;
CREATE TABLE sports (
  Id serial NOT NULL,
  Name varchar(255) NOT NULL,
  AllowDraw smallint NOT NULL,
  PRIMARY KEY (Id)
);

--
-- Dumping data for table sports
--

INSERT INTO sports (Name, AllowDraw) VALUES('Football', 1);
INSERT INTO sports (Name, AllowDraw) VALUES('Tennis', 0);

-- --------------------------------------------------------

--
-- Table structure for table teams
--

DROP TABLE IF EXISTS teams;
CREATE TABLE teams (
  Id serial NOT NULL,
  Name varchar(255) NOT NULL,
  PRIMARY KEY (Id)
);

--
-- Dumping data for table teams
--

INSERT INTO teams (Name) VALUES('Queens Park Rangers');
INSERT INTO teams (Name) VALUES('Norwich');
INSERT INTO teams (Name) VALUES('Arsenel');
INSERT INTO teams (Name) VALUES('Newcastle United');
INSERT INTO teams (Name) VALUES('West Bromwich Albion');
INSERT INTO teams (Name) VALUES('Everton');
INSERT INTO teams (Name) VALUES('Chelsea');
INSERT INTO teams (Name) VALUES('Manchester United');
INSERT INTO teams (Name) VALUES('Southampton');
INSERT INTO teams (Name) VALUES('Wigan Athletic');
-- --------------------------------------------------------

--
-- Table structure for table users
--

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  Id serial NOT NULL,
  ThirdPartyId varchar(30) NOT NULL,
  FacebookId integer NOT NULL,
  PRIMARY KEY (Id)
);

--
-- Dumping data for table users
--

INSERT INTO users (ThirdPartyId, FacebookId) VALUES('test', 1000000);
INSERT INTO users (ThirdPartyId, FacebookId) VALUES('test2', 2000000);
INSERT INTO users (ThirdPartyId, FacebookId) VALUES('test3', 3000000);