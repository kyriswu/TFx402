CREATE DATABASE IF NOT EXISTS snatchit;
USE snatchit;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  avatar_url VARCHAR(512),
  email VARCHAR(100),
  social_platform VARCHAR(50),
  social_platform_user_id VARCHAR(256),
  stat TINYINT NOT NULL DEFAULT 1 COMMENT '1:正常, 0:封禁',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_social_platform (social_platform, social_platform_user_id),
  INDEX idx_stat (stat),
  INDEX idx_created_at (created_at)
);

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  uuid CHAR(66) NOT NULL UNIQUE COMMENT 'hex编码的唯一标识',
  seller_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  img VARCHAR(512) NOT NULL,
  product_desc TEXT,
  price BIGINT NOT NULL,
  ticket_price BIGINT NOT NULL,
  number_digits INT NOT NULL COMMENT '1-5位',
  difficulty_level TINYINT COMMENT '1:简单, 2:中级, 3:困难',
  deadline TIMESTAMP NOT NULL,
  stat TINYINT NOT NULL DEFAULT 0 COMMENT '0:竞猜中, 1:已成交, 2:已下架, 3:流局',
  total_guess_time INT NOT NULL DEFAULT 0 COMMENT '累计竞猜次数',
  winner_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_seller_id (seller_id),
  INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE guess_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  guess_number INT NOT NULL,
  result_detail VARCHAR(50),
  is_correct BOOLEAN NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

