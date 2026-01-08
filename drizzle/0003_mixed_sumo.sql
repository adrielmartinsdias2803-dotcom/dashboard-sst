CREATE TABLE `rotas_agendadas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`data_rota` varchar(10) NOT NULL,
	`hora_rota` varchar(5) NOT NULL,
	`setor` varchar(255) NOT NULL,
	`tecnico_sst` varchar(255) NOT NULL,
	`representante_manutencao` varchar(255) NOT NULL,
	`representante_producao` varchar(255) NOT NULL,
	`convidados` text,
	`observacoes` text,
	`status` enum('pendente','confirmada','concluida','cancelada') NOT NULL DEFAULT 'pendente',
	`responsavel_confirmacao` varchar(255),
	`data_confirmacao` timestamp,
	`observacoes_confirmacao` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rotas_agendadas_id` PRIMARY KEY(`id`)
);
