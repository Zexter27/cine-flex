import { mockStore } from "../mocks/mock-datos";

export class AsientosServicio {
  async listarDisponibles(): Promise<Array<{ id: string; disponible: boolean }>> {
    return mockStore.asientos
      .filter((asiento) => asiento.estado === "disponible")
      .map((asiento) => ({ id: asiento.id, disponible: true }));
  }
}
