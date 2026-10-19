import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Funcion } from "./funcion";

@Entity({ name: "peliculas" })
export class Pelicula {
  @PrimaryGeneratedColumn({ name: "id_pelicula" })
  id!: number;

  @Column({ name: "titulo", type: "varchar", length: 200 })
  titulo!: string;

  @Column({ name: "sinopsis", type: "text", nullable: true })
  sinopsis!: string | null;

  @Column({ name: "duracion_minutos", type: "smallint", unsigned: true })
  duracionMinutos!: number;

  @OneToMany(() => Funcion, (funcion) => funcion.pelicula)
  funciones!: Funcion[];
}
