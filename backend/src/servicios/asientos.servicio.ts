import { baseDatos } from "../configuracion/base-datos";
import { Asiento } from "../entidades/asiento";
import { EstadoReserva } from "../entidades/reserva";

export class AsientosServicio {
  async listarDisponibles(): Promise<Array<{ id: string; disponible: boolean }>> {
    const asientos = await baseDatos.getRepository(Asiento)
      .createQueryBuilder("asiento")
      .leftJoin("asiento.reservas", "reserva", "reserva.estado <> :cancelada", {
        cancelada: EstadoReserva.Cancelada
      })
      .where("reserva.id IS NULL")
      .orderBy("asiento.fila", "ASC")
      .addOrderBy("asiento.numero", "ASC")
      .getMany();

    return asientos.map((asiento) => ({
      id: `${asiento.fila}${asiento.numero}`,
      disponible: true
    }));
  }
}
