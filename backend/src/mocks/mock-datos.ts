export interface UsuarioMock {
  id: number;
  nombres: string;
  apellidos: string;
  correoElectronico: string;
  contrasena: string;
}

export interface PeliculaMock {
  id: number;
  titulo: string;
  sinopsis: string;
  generos: string[];
  duracionMinutos: number;
  clasificacion: string;
  poster: string;
}

export interface FuncionMock {
  id: number;
  peliculaId: number;
  salaId: number;
  fechaHoraInicio: string;
  precio: number;
}

export interface SalaMock {
  id: number;
  nombre: string;
  filas: string[];
  columnas: number;
}

export interface AsientoMock {
  id: string;
  salaId: number;
  fila: string;
  numero: number;
  estado: "disponible" | "ocupado" | "reservado";
  precio: number;
}

export const CREDENCIALES_MOCK = Object.freeze({
  usuario: "edwin@gmail.com",
  contrasena: "edwin1234567"
});

const titulosPeliculas = [
  "Dune: Parte dos", "Misión imposible: Sentencia final", "Inside Out 2", "Kung Fu Panda 4",
  "Oppenheimer", "Wicked", "A Quiet Place: Day One", "The Batman", "Avatar: El sentido del agua",
  "Wonka", "Napoleón", "Bob Marley: One Love", "Madame Web", "The Hunger Games: Balada de pájaros cantores y serpientes",
  "La Monja II", "Matrix Resurrections", "The Flash", "The Marvels", "The Little Mermaid", "Shrek 5",
  "Spider-Man: Across the Spider-Verse", "Spider-Man: No Way Home", "Guardians of the Galaxy Vol. 3",
  "Barbie", "Elemental", "Kung Fu Panda 3", "Trolls Band Together", "The Super Mario Bros. Movie",
  "Toy Story 4", "Zootopia", "Ratatouille", "Coco", "Encanto", "Moana", "Frozen II", "Incredibles 2",
  "Lightyear", "Turning Red", "Soul", "Luca", "Inside Out", "The Good Dinosaur", "Cars", "Up",
  "The Avengers", "Titanic", "Interstellar", "Inception", "Tenet", "Dunkirk", "Arrival", "Blade Runner 2049",
  "Ex Machina", "Her", "La La Land", "No Time to Die", "Skyfall", "Casino Royale", "Indiana Jones y el dial del destino",
  "Indiana Jones y la última cruzada", "Jurassic World Dominion", "Jurassic Park", "Jurassic World", "The Lion King",
  "The Jungle Book", "Beauty and the Beast", "Aladdin", "Mulan", "Frozen", "Tangled", "Brave", "Big Hero 6",
  "Coco", "ParaNorman", "Hotel Transylvania", "Minions", "Despicable Me 4", "Despicable Me", "Sing", "Sing 2",
  "Transformers: El despunte de las bestias", "Transformers: Age of Extinction", "Avatar", "Avatar 2", "Star Wars: El ascenso de Skywalker",
  "Star Wars: El despertar de la Fuerza", "Star Wars: Los últimos Jedi", "Star Wars: El regreso del Jedi", "Star Trek: Beyond",
  "Star Trek: Into Darkness", "Star Trek", "John Wick 4", "John Wick 3", "John Wick 2", "John Wick",
  "The Equalizer 3", "The Equalizer 2", "The Equalizer", "Nope", "Us", "Get Out", "Parasite",
  "The Batman", "The Dark Knight", "The Dark Knight Rises", "Batman Begins", "Hacksaw Ridge", "1917",
  "The Greatest Showman", "Bohemian Rhapsody", "Rocketman", "Whiplash", "La forma del agua", "The Shape of Water"
];

const sinopsisBase = [
  "Un viaje épico lleno de tensión, emoción y decisiones inesperadas.",
  "Una historia intensa sobre coraje, sacrificio y descubrimiento personal.",
  "La aventura comienza cuando cada detalle cambia la vida de los personajes.",
  "Una experiencia cinematográfica profunda, visualmente impactante y emocionalmente intensa.",
  "Un relato contemporáneo con giros narrativos, acción y una gran carga humana.",
  "Una odisea moderna llena de misterio, valentía y transformaciones sorprendentes.",
  "Cuando la realidad se altera, el destino exige respuestas imposibles.",
  "Una aventura moderna que combina emoción, riesgo y un enorme sentido de identidad."
];

const generosCatalogo = [
  "Acción", "Drama", "Ciencia ficción", "Animación", "Aventura", "Comedia", "Suspenso",
  "Fantasía", "Romance", "Crimen", "Terror", "Musical", "Documental"
];

const salas: SalaMock[] = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  nombre: `Sala ${index + 1}`,
  filas: ["A", "B", "C", "D", "E"],
  columnas: 10
}));

export const usuariosMock: UsuarioMock[] = [
  {
    id: 1001,
    nombres: "Edwin",
    apellidos: "Martinez",
    correoElectronico: "edwin@gmail.com",
    contrasena: "edwin1234567"
  }
];

export const peliculasMock: PeliculaMock[] = Array.from({ length: 120 }, (_, index) => {
  const titulo = titulosPeliculas[index % titulosPeliculas.length];
  const generos = [
    generosCatalogo[index % generosCatalogo.length],
    generosCatalogo[(index + 2) % generosCatalogo.length],
    generosCatalogo[(index + 5) % generosCatalogo.length]
  ];
  const duracion = 90 + ((index * 13) % 95);

  return {
    id: index + 1,
    titulo: `${titulo}${index > titulosPeliculas.length - 1 ? ` ${Math.floor(index / titulosPeliculas.length) + 1}` : ""}`,
    sinopsis: `${sinopsisBase[index % sinopsisBase.length]} Una narrativa moderna con ritmo intenso para el público que disfruta la experiencia de cine en sala.`,
    generos,
    duracionMinutos: duracion,
    clasificacion: index % 3 === 0 ? "PG-13" : index % 2 === 0 ? "PG" : "R",
    poster: `https://images.example.com/posters/${String(index + 1).padStart(3, "0")}.jpg`
  };
});

export const funcionesMock: FuncionMock[] = Array.from({ length: 120 }, (_, index) => {
  const peliculaId = (index % peliculasMock.length) + 1;
  const salaId = (index % salas.length) + 1;
  const horaBase = new Date();
  horaBase.setHours(12 + (index % 10), (index * 11) % 60, 0, 0);
  horaBase.setDate(horaBase.getDate() + (index % 6));

  return {
    id: index + 1,
    peliculaId,
    salaId,
    fechaHoraInicio: horaBase.toISOString(),
    precio: 18000 + ((index * 3750) % 16000)
  };
});

export const asientosMock: AsientoMock[] = salas.flatMap((sala) =>
  sala.filas.flatMap((fila) =>
    Array.from({ length: sala.columnas }, (_, numero) => {
      const numeroAsiento = numero + 1;
      const index = ((sala.id - 1) * sala.filas.length * sala.columnas) + ((sala.filas.indexOf(fila) * sala.columnas) + numeroAsiento);
      const estado = index % 11 === 0 ? "ocupado" : index % 7 === 0 ? "reservado" : "disponible";
      return {
        id: `${fila}${numeroAsiento}`,
        salaId: sala.id,
        fila,
        numero: numeroAsiento,
        estado,
        precio: 20000 + ((sala.id * 1000) % 7000)
      };
    })
  )
);

export const mockStore = Object.freeze({
  usuarios: usuariosMock,
  peliculas: peliculasMock,
  salas,
  funciones: funcionesMock,
  asientos: asientosMock
});
