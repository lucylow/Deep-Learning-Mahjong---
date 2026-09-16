ALTER TABLE `mahjong_ai_decisions` ADD `ownerUserId` int;--> statement-breakpoint
ALTER TABLE `mahjong_analyses` ADD `ownerUserId` int;--> statement-breakpoint
ALTER TABLE `mahjong_events` ADD `ownerUserId` int;--> statement-breakpoint
ALTER TABLE `mahjong_review_moments` ADD `ownerUserId` int;