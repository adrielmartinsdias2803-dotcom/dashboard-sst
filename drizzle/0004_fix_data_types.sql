-- Fixing data types in rotas_agendadas and alert_contacts tables
ALTER TABLE `rotas_agendadas` MODIFY `data_rota` date NOT NULL;
ALTER TABLE `rotas_agendadas` MODIFY `hora_rota` time NOT NULL;
ALTER TABLE `alert_contacts` MODIFY `is_active` tinyint NOT NULL DEFAULT 1;
