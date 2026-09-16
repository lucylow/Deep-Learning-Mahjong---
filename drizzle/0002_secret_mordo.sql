CREATE TABLE `mahjong_ai_decisions` (
	`id` varchar(128) NOT NULL,
	`matchId` varchar(96) NOT NULL,
	`turn` int NOT NULL,
	`seat` int NOT NULL,
	`policy` varchar(32) NOT NULL,
	`actionJson` json NOT NULL,
	`rationale` text NOT NULL,
	`objective` varchar(32) NOT NULL,
	`confidence` int NOT NULL,
	`contributionsJson` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mahjong_ai_decisions_id` PRIMARY KEY(`id`)
);
