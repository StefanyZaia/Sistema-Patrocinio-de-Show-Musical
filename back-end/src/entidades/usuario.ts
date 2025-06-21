import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn } from "typeorm";
import Produtor from "./produtor";
import Patrocinador from "./patrocinador";
export enum Perfil { PATROCINADOR = "patrocinador", PRODUTOR = "produtor" };
export enum Status { PENDENTE = "pendente", ATIVO = "ativo" };
export enum Cores {
    AMARELO = "yellow", ANIL = "indigo", AZUL = "blue", AZUL_PISCINA = "cyan",
    CINZA_ESCURO = "bluegray", LARANJA = "orange", ROSA = "pink", ROXO = "purple", VERDE = "green",
    VERDE_AZULADO = "teal"
};
@Entity()
export default class Usuario extends BaseEntity {
    @PrimaryColumn()
    cpf: string;
    @Column({ type: "enum", enum: Perfil })
    perfil: Perfil;
    @Column({ type: "enum", enum: Status, default: Status.PENDENTE })
    status: Status;
    @Column()
    nome: string;
    @Column()
    email: string;
    @Column()
    senha: string;
    @Column()
    questao: string;
    @Column()
    resposta: string;
    @Column({ type: "enum", enum: Cores })
    cor_tema: string;
    @OneToOne(() => Produtor, (produtor) => produtor.usuario)
    produtor: Produtor;
    @OneToOne(() => Patrocinador, (patrocinador) => patrocinador.usuario)
    patrocinador: Patrocinador;
    @CreateDateColumn()
    data_criacao: Date;
}