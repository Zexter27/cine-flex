import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Asiento } from "./asiento";
import { Funcion } from "./funcion";

@Entity({ name: "salas" })
export class Sala {
  @PrimaryGeneratedColumn({ name: "id_sala" })
  id!: number;

  @Column({ name: "nombre", type: "varchar", length: 100, unique: true })
  nombre!: string;

  @OneToMany(() => Asiento, (asiento) => asiento.sala)
  asientos!: Asiento[];

  @OneToMany(() => Funcion, (funcion) => funcion.sala)
  funciones!: Funcion[];
}
