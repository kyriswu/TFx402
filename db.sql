CREATE DATABASE IF NOT EXISTS snatchit;
USE snatchit;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  avatar_url VARCHAR(512),
  email VARCHAR(100),
  social_platform VARCHAR(50),
  social_platform_user_id VARCHAR(256),
  is_approved TINYINT NOT NULL DEFAULT 0 COMMENT '0:不同意授权, 1:同意授权',
  wallet_address VARCHAR(256) COMMENT '热钱包地址',
  public_key TEXT COMMENT '公钥',
  private_key_encrypted TEXT COMMENT 'AES加密后的私钥',
  stat TINYINT NOT NULL DEFAULT 1 COMMENT '1:正常, 0:封禁',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE INDEX idx_wallet_address (wallet_address),
  INDEX idx_social_platform (social_platform, social_platform_user_id),
  INDEX idx_stat (stat),
  INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `agent_spending_keys` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '关联的主账户/用户ID',
  
  -- 基础身份信息
  `name` varchar(64) NOT NULL COMMENT '智能体名称/用途 (e.g. "AutoGPT-Shopping")',
  `access_key` varchar(64) NOT NULL COMMENT '支付凭证 sk-xxxx (需建立唯一索引)',
  `status` enum('ACTIVE', 'FROZEN', 'EXPIRED', 'DEPLETED') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态: 启用/冻结/过期/额度耗尽',
  
  -- 资金风控核心 (Money & Budget)
  `currency` varchar(10) NOT NULL DEFAULT 'USDT' COMMENT '币种',
  `budget_limit` decimal(40, 18) NOT NULL DEFAULT '0.000000' COMMENT '总预算上限',
  `budget_usage` decimal(40, 18) NOT NULL DEFAULT '0.000000' COMMENT '已使用额度',
  `budget_period` enum('TOTAL', 'MONTHLY', 'DAILY') NOT NULL DEFAULT 'TOTAL' COMMENT '预算重置周期: 终身/月度/日度',
  `last_budget_reset_at` timestamp NULL DEFAULT NULL COMMENT '上次额度重置时间(用于周期性预算)',

  -- 支付模式与阈值 (Mode & Thresholds)
  `approval_mode` enum('AUTO', 'MANUAL_ALWAYS', 'HYBRID') NOT NULL DEFAULT 'HYBRID' COMMENT '支付方式: 自动/总是需确认/混合模式',
  `auto_approve_limit` decimal(40, 18) DEFAULT '0.000000' COMMENT '小额免密阈值 (混合模式下，低于此值自动付，高于需确认)',
  
  -- 技术风控限制 (Technical Limits)
  `rate_limit_max` int(11) NOT NULL DEFAULT '-1' COMMENT '周期内最大调用次数 (-1为无限制)',
  `rate_limit_period` enum('DAILY', 'HOURLY') NOT NULL DEFAULT 'DAILY' COMMENT '频次限制周期',
  `current_rate_usage` int(11) NOT NULL DEFAULT '0' COMMENT '当前周期已调用次数',
  
  -- 黑白名单与技能 (Lists & Skills - 使用 JSON 存储以保持灵活)
  `allowed_addresses` json DEFAULT NULL COMMENT '地址白名单 (JSON数组, NULL代表不限)',
  `blocked_addresses` json DEFAULT NULL COMMENT '地址黑名单 (JSON数组)',
  `allowed_skills` json DEFAULT NULL COMMENT '允许调用的Skill/工具白名单 (e.g. ["search_api_pay", "aws_bill_pay"])',
  `allowed_merchant_categories` json DEFAULT NULL COMMENT '允许的商户类别 (e.g. ["SaaS", "Cloud", "Travel"])',

  -- 安全与审计
  `alert_threshold_percent` tinyint(3) unsigned DEFAULT '80' COMMENT '余额耗尽告警百分比 (e.g. 80%)',
  `expires_at` timestamp NULL DEFAULT NULL COMMENT '令牌过期时间 (NULL为永不过期)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_access_key` (`access_key`),
  KEY `idx_user_status` (`user_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AgentPay 支付授权/消费密钥表';

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

