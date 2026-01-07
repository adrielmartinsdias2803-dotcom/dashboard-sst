CREATE TABLE `sst_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`total_riscos` int NOT NULL DEFAULT 0,
	`riscos_altos` int NOT NULL DEFAULT 0,
	`riscos_medias` int NOT NULL DEFAULT 0,
	`riscos_criticos` int NOT NULL DEFAULT 0,
	`acoes_concluidas` int NOT NULL DEFAULT 0,
	`acoes_pendentes` int NOT NULL DEFAULT 0,
	`last_synced_at` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sst_metrics_id` PRIMARY KEY(`id`)
);
