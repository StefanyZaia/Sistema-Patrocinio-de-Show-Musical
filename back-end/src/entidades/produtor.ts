import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from
    "typeorm";
import Usuario from "./usuario";
import Show from "./show";
export enum Atuacao { TECNICO = "tecnico", CRIATIVO = "criativo" };
@Entity()
export default class Produtor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "enum", enum: Atuacao })
    atuacao: Atuacao;
    @Column()
    anos_experiencia: number;
    @OneToMany(() => Show, (show) => show.produtor)
    show: Show[];
    @OneToOne(() => Usuario, (usuario) => usuario.produtor, { onDelete: "CASCADE" })
    @JoinColumn()
    usuario: Usuario;
}