CREATE TABLE `mahjong_analyses` (
	`id` varchar(128) NOT NULL,
	`matchId` varchar(96) NOT NULL,
	`turn` int NOT NULL,
	`seat` int NOT NULL,
	`policy` varchar(32) NOT NULL,
	`analysisJson` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mahjong_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mahjong_events` (
	`id` varchar(128) NOT NULL,
	`matchId` varchar(96) NOT NULL,
	`sequence` int NOT NULL,
	`eventType` varchar(48) NOT NULL,
	`actorSeat` int,
	`actionJson` json,
	`stateJson` json NOT NULL,
	`stateHash` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mahjong_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mahjong_matches` (
	`id` varchar(96) NOT NULL,
	`ownerUserId` int,
	`ruleSet` varchar(32) NOT NULL DEFAULT 'riichi',
	`seed` int NOT NULL,
	`phase` varchar(32) NOT NULL DEFAULT 'waiting',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mahjong_matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mahjong_review_moments` (
	`id` varchar(128) NOT NULL,
	`matchId` varchar(96) NOT NULL,
	`turn` int NOT NULL,
	`category` varchar(32) NOT NULL,
	`title` varchar(160) NOT NULL,
	`originalActionJson` json NOT NULL,
	`analysisJson` json,
	`stateHash` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mahjong_review_moments_id` PRIMARY KEY(`id`)
);
