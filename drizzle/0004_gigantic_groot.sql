ALTER TABLE `alert_contacts` MODIFY COLUMN `is_active` tinyint NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `rotas_agendadas` MODIFY COLUMN `data_rota` date NOT NULL;--> statement-breakpoint
ALTER TABLE `rotas_agendadas` MODIFY COLUMN `hora_rota` time NOT NULL;