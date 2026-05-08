-- ═══════════════════════════════════════════════════════════════
-- CricketPro — MySQL Production Schema
-- Run this against MySQL when deploying to production.
-- In dev, JPA auto-creates tables from entities (ddl-auto=update).
-- ═══════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS cricketpro_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cricketpro_db;

-- ── Users ──
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('ADMIN','ORGANIZER','TEAM_OWNER','PLAYER','SCORER','SPECTATOR') NOT NULL,
    avatar_icon VARCHAR(50),
    location VARCHAR(200),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- ── Players ──
CREATE TABLE IF NOT EXISTS players (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    jersey_number VARCHAR(5),
    player_role ENUM('BATSMAN','BOWLER','ALL_ROUNDER','WICKET_KEEPER') NOT NULL,
    location VARCHAR(200),
    batting_style VARCHAR(50),
    bowling_style VARCHAR(50),
    total_matches INT DEFAULT 0,
    total_runs INT DEFAULT 0,
    total_wickets INT DEFAULT 0,
    total_catches INT DEFAULT 0,
    motm_count INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Tournaments ──
CREATE TABLE IF NOT EXISTS tournaments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(50) UNIQUE,
    organizer_id BIGINT NOT NULL,
    location VARCHAR(300),
    description TEXT,
    status ENUM('DRAFT','REGISTRATION_OPEN','AUCTION_PHASE','IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'DRAFT',
    team_count INT DEFAULT 8,
    players_per_team INT DEFAULT 11,
    budget_per_team BIGINT DEFAULT 50000,
    team_ownership_fee BIGINT DEFAULT 5000,
    bid_timer_seconds INT DEFAULT 15,
    min_bid_increment BIGINT DEFAULT 100,
    overs_per_match INT DEFAULT 20,
    start_date DATE,
    end_date DATE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id),
    INDEX idx_tournament_status (status),
    INDEX idx_tournament_slug (slug)
) ENGINE=InnoDB;

-- ── Teams ──
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_icon VARCHAR(50),
    tournament_id BIGINT NOT NULL,
    owner_id BIGINT NOT NULL,
    budget_remaining BIGINT DEFAULT 50000,
    players_bought INT DEFAULT 0,
    version BIGINT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
    FOREIGN KEY (owner_id) REFERENCES users(id),
    UNIQUE KEY uk_team_tournament_name (tournament_id, name),
    INDEX idx_team_tournament (tournament_id)
) ENGINE=InnoDB;

-- ── Team-Player Junction ──
CREATE TABLE IF NOT EXISTS team_players (
    team_id BIGINT NOT NULL,
    player_id BIGINT NOT NULL,
    PRIMARY KEY (team_id, player_id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (player_id) REFERENCES players(id)
) ENGINE=InnoDB;

-- ── Auction Sessions ──
CREATE TABLE IF NOT EXISTS auction_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tournament_id BIGINT NOT NULL UNIQUE,
    status ENUM('SETUP','READY','ACTIVE','PAUSED','COMPLETED') DEFAULT 'SETUP',
    current_player_id BIGINT,
    current_highest_bid BIGINT DEFAULT 0,
    current_highest_team_id BIGINT,
    timer_seconds_remaining INT DEFAULT 15,
    total_auction_pot BIGINT DEFAULT 0,
    started_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
    FOREIGN KEY (current_player_id) REFERENCES players(id),
    FOREIGN KEY (current_highest_team_id) REFERENCES teams(id)
) ENGINE=InnoDB;

-- ── Auction Bids ──
CREATE TABLE IF NOT EXISTS auction_bids (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    player_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    amount BIGINT NOT NULL,
    bid_time DATETIME NOT NULL,
    FOREIGN KEY (session_id) REFERENCES auction_sessions(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    INDEX idx_bid_session_time (session_id, bid_time)
) ENGINE=InnoDB;

-- ── Auction Player Queue ──
CREATE TABLE IF NOT EXISTS auction_player_queue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    player_id BIGINT NOT NULL,
    queue_order INT NOT NULL,
    status ENUM('PENDING','INTRO','BIDDING','SOLD','UNSOLD') DEFAULT 'PENDING',
    sold_price BIGINT,
    sold_team_id BIGINT,
    base_price BIGINT DEFAULT 1000,
    FOREIGN KEY (session_id) REFERENCES auction_sessions(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (sold_team_id) REFERENCES teams(id),
    INDEX idx_queue_session_order (session_id, queue_order)
) ENGINE=InnoDB;

-- ── Matches ──
CREATE TABLE IF NOT EXISTS matches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tournament_id BIGINT NOT NULL,
    team1_id BIGINT NOT NULL,
    team2_id BIGINT NOT NULL,
    status ENUM('SCHEDULED','LIVE','COMPLETED','CANCELLED') DEFAULT 'SCHEDULED',
    toss_winner_id BIGINT,
    toss_decision VARCHAR(20),
    winner_id BIGINT,
    result VARCHAR(200),
    venue VARCHAR(200),
    match_date DATE,
    match_number INT,
    motm_player_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
    FOREIGN KEY (team1_id) REFERENCES teams(id),
    FOREIGN KEY (team2_id) REFERENCES teams(id),
    FOREIGN KEY (toss_winner_id) REFERENCES teams(id),
    FOREIGN KEY (winner_id) REFERENCES teams(id),
    FOREIGN KEY (motm_player_id) REFERENCES players(id)
) ENGINE=InnoDB;

-- ── Innings ──
CREATE TABLE IF NOT EXISTS innings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    match_id BIGINT NOT NULL,
    innings_number INT NOT NULL,
    batting_team_id BIGINT NOT NULL,
    bowling_team_id BIGINT NOT NULL,
    total_runs INT DEFAULT 0,
    total_wickets INT DEFAULT 0,
    total_balls INT DEFAULT 0,
    extras INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (batting_team_id) REFERENCES teams(id),
    FOREIGN KEY (bowling_team_id) REFERENCES teams(id)
) ENGINE=InnoDB;

-- ── Deliveries (Ball-by-ball) ──
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    innings_id BIGINT NOT NULL,
    over_number INT NOT NULL,
    ball_number INT NOT NULL,
    batsman_id BIGINT NOT NULL,
    bowler_id BIGINT NOT NULL,
    non_striker_id BIGINT,
    runs_off_bat INT DEFAULT 0,
    extra_runs INT DEFAULT 0,
    extras_type VARCHAR(15),
    is_wicket BOOLEAN DEFAULT FALSE,
    wicket_type ENUM('BOWLED','CAUGHT','LBW','RUN_OUT','STUMPED','HIT_WICKET','RETIRED_HURT'),
    fielder_id BIGINT,
    commentary_text VARCHAR(500),
    is_legal BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (innings_id) REFERENCES innings(id),
    FOREIGN KEY (batsman_id) REFERENCES players(id),
    FOREIGN KEY (bowler_id) REFERENCES players(id),
    FOREIGN KEY (non_striker_id) REFERENCES players(id),
    FOREIGN KEY (fielder_id) REFERENCES players(id),
    INDEX idx_delivery_innings (innings_id, over_number, ball_number)
) ENGINE=InnoDB;

-- ── Player Tournament Stats ──
CREATE TABLE IF NOT EXISTS player_tournament_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    tournament_id BIGINT NOT NULL,
    matches INT DEFAULT 0,
    innings INT DEFAULT 0,
    runs INT DEFAULT 0,
    balls_faced INT DEFAULT 0,
    fours INT DEFAULT 0,
    sixes INT DEFAULT 0,
    highest_score INT DEFAULT 0,
    not_outs INT DEFAULT 0,
    overs_bowled INT DEFAULT 0,
    balls_bowled INT DEFAULT 0,
    wickets INT DEFAULT 0,
    runs_conceded INT DEFAULT 0,
    maidens INT DEFAULT 0,
    catches INT DEFAULT 0,
    run_outs INT DEFAULT 0,
    stumpings INT DEFAULT 0,
    motm_count INT DEFAULT 0,
    hype_score INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
    UNIQUE KEY uk_player_tournament (player_id, tournament_id)
) ENGINE=InnoDB;
