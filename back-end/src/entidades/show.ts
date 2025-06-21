import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Produtor from "./produtor";
import Prioridade from "./prioridade";
export enum GeneroMusical { PH = "PostHardcore", MC = "Metalcore", PP = "PopPunk" };

@Entity()
export default class Show extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nome_show: string;
    @Column({ type: "enum", enum: GeneroMusical })
    genero_musical: GeneroMusical;
    @Column()
    localizacao: string;
    @Column({ type: "date" })
    data_show: Date;
    @Column()
    descricao: string;
    @Column()
    show_gratuito: boolean;
    @Column()
    categoria: string;
    @ManyToOne(() => Produtor, (produtor) => produtor.show, { onDelete: "CASCADE" })
    produtor: Produtor;
    @OneToMany(() => Prioridade, (prioridade) => prioridade.show)
    prioridades: Prioridade[];
}