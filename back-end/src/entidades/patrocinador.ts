import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn }
    from "typeorm";
import Usuario from "./usuario";
import Prioridade from "./prioridade";
export enum Tipo { F = "Financeiro", P = "Produtos" };
@Entity()
export default class Patrocinador extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "enum", enum: Tipo })
    tipo: Tipo;
    @Column()
    ano_inicio_patrocinio: number;
    @Column({ type: "date" })
    data_inicio_empresa: Date;
    @Column()
    telefone: string;
    @OneToMany(() => Prioridade, (prioridade) => prioridade.patrocinador)
    prioridades: Prioridade[];
    @OneToOne(() => Usuario, usuario => usuario.patrocinador, { onDelete: "CASCADE" })
    @JoinColumn()
    usuario: Usuario;
}