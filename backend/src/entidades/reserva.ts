import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { Asiento } from "./asiento";
import { Funcion } from "./funcion";
import { Usuario } from "./usuario";

export enum EstadoReserva {
  Pendiente = "pendiente",
  Confirmada = "confirmada",
  Cancelada = "cancelada"
}

@Entity({ name: "reservas" })
@Unique("uq_reserva_funcion_asiento", ["funcion", "asiento"])
export class Reserva {
  @PrimaryGeneratedColumn({ name: "id_reserva" })
  id!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas, { nullable: false })
  usuario!: Usuario;

  @ManyToOne(() => Funcion, (funcion) => funcion.reservas, { nullable: false })
  funcion!: Funcion;

  @ManyToOne(() => Asiento, (asiento) => asiento.reservas, { nullable: false })
  asiento!: Asiento;

  @Column({
    name: "estado",
    type: "enum",
    enum: EstadoReserva,
    default: EstadoReserva.Pendiente
  })
  estado!: EstadoReserva;

  @CreateDateColumn({ name: "fecha_creacion", type: "timestamp" })
  fechaCreacion!: Date;
}
