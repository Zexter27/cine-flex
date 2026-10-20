import { listarAsientosOcupadosPorFuncion, mockStore } from "../mocks/mock-datos";

export class AsientosServicio {
  async listarDisponibles(funcionId?: number): Promise<Array<{ id: string; disponible: boolean }>> {
    const ocupados = funcionId ? listarAsientosOcupadosPorFuncion(funcionId) : new Set<string>();

    return mockStore.asientos
      .filter((asiento) => asiento.estado === "disponible" || asiento.estado === "reservado")
      .map((asiento) => ({
        id: asiento.id,
        disponible: !ocupados.has(asiento.id) && asiento.estado !== "ocupado"
      }));
  }

  registrarOcupacion(funcionId: number, asientos: string[]): Set<string> {
    const ocupados = new Set(listarAsientosOcupadosPorFuncion(funcionId));
    for (const asientoId of asientos) {
      ocupados.add(asientoId);
    }

    return new Set(Array.from(ocupados));
  }
}
