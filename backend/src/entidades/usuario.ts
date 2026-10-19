import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Reserva } from "./reserva";

@Entity({ name: "usuarios" })
export class Usuario {
  @PrimaryGeneratedColumn({ name: "id_usuario" })
  id!: number;

  @Column({ name: "nombres", type: "varchar", length: 100 })
  nombres!: string;

  @Column({ name: "apellidos", type: "varchar", length: 100 })
  apellidos!: string;

  @Column({
    name: "correo_electronico",
    type: "varchar",
    length: 254,
    unique: true
  })
  correoElectronico!: string;

  @Column({ name: "contrasena_hash", type: "varchar", length: 60, select: false })
  contrasenaHash!: string;

  @Column({ name: "fecha_creacion", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fechaCreacion!: Date;

  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas!: Reserva[];
}
