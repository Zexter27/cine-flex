import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { Reserva } from "./reserva";
import { Sala } from "./sala";

@Entity({ name: "asientos" })
@Unique("uq_asiento_sala_fila_numero", ["sala", "fila", "numero"])
export class Asiento {
  @PrimaryGeneratedColumn({ name: "id_asiento" })
  id!: number;

  @ManyToOne(() => Sala, (sala) => sala.asientos, { nullable: false })
  sala!: Sala;

  @Column({ name: "fila", type: "varchar", length: 5 })
  fila!: string;

  @Column({ name: "numero", type: "smallint", unsigned: true })
  numero!: number;

  @OneToMany(() => Reserva, (reserva) => reserva.asiento)
  reservas!: Reserva[];
}
