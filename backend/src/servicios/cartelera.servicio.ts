import { mockStore } from "../mocks/mock-datos";

export class CarteleraServicio {
  async listar(): Promise<Array<{ id: number; titulo: string; sinopsis: string; generos: string[]; duracionMinutos: number; clasificacion: string; poster: string }>> {
    return mockStore.peliculas.map((pelicula) => ({
      id: pelicula.id,
      titulo: pelicula.titulo,
      sinopsis: pelicula.sinopsis,
      generos: pelicula.generos,
      duracionMinutos: pelicula.duracionMinutos,
      clasificacion: pelicula.clasificacion,
      poster: pelicula.poster
    }));
  }
}
