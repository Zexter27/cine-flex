import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Pelicula } from "./pelicula";
import { Reserva } from "./reserva";
import { Sala } from "./sala";

@Entity({ name: "funciones" })
export class Funcion {
  @PrimaryGeneratedColumn({ name: "id_funcion" })
  id!: number;

  @ManyToOne(() => Pelicula, (pelicula) => pelicula.funciones, { nullable: false })
  pelicula!: Pelicula;

  @ManyToOne(() => Sala, (sala) => sala.funciones, { nullable: false })
  sala!: Sala;

  @Column({ name: "fecha_hora_inicio", type: "datetime" })
  fechaHoraInicio!: Date;

  @Column({ name: "precio", type: "decimal", precision: 10, scale: 2 })
  precio!: string;

  @OneToMany(() => Reserva, (reserva) => reserva.funcion)
  reservas!: Reserva[];
}
