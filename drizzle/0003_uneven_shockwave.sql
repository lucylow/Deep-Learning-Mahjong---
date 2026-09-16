CREATE TABLE `mahjong_benchmark_runs` (
	`id` varchar(128) NOT NULL,
	`seedsJson` json NOT NULL,
	`metricsJson` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mahjong_benchmark_runs_id` PRIMARY KEY(`id`)
);
