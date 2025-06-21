import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Patrocinador from "./patrocinador";
import Show from "./show";
@Entity()
export default class Prioridade extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nivel_prioridade: number;
    @Column()
    justificativa: string;
    @CreateDateColumn()
    data_avaliacao: Date;
    @ManyToOne(() => Show, (show) => show.prioridades, { onDelete: "CASCADE" })
    show: Show;
    @ManyToOne(() => Patrocinador, (patrocinador) => patrocinador.prioridades, { onDelete: "CASCADE" })
    patrocinador: Patrocinador;
}