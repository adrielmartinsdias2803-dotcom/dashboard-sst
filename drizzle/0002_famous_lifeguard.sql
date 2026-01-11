CREATE TABLE `alert_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`is_active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alert_contacts_id` PRIMARY KEY(`id`),
	CONSTRAINT `alert_contacts_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `sync_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`status` enum('success','error','pending') NOT NULL,
	`message` text,
	`error_details` text,
	`records_processed` int DEFAULT 0,
	`last_synced_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sync_logs_id` PRIMARY KEY(`id`)
);
