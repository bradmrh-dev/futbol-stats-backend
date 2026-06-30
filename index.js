// 1. Se cargan las variables de entorno de mi archivo .env
// DOTENV es un paquete que permite cargar variables de entorno desde un archivo .env a process.env
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

//2. Se lee la URL y la llave publica desde process.env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;   

//3. Se creo el cliente de conexcion a la base de datos de Supabase
// En este se puede hacer cualquier consulta a la base de datos
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Conexion a la base de datos exitosa.");


// Funcion 1. para traer los partidos de la base de datos 
async function obtenerPartidos() {
    const { data: partidos, error } = await supabase
    .from('partidos')
    .select(`
        id,
        fecha_partido,
        goles_local, 
        goles_visitante,
        id_local( nombre_equipo ),
        id_visitante( nombre_equipo )
        `);

    if (error) {
        console.error("Error al obtener los partidos:", error);
        return;
    }

    //console.log("Conexion exitosa, tus partidos son:");
    //console.log(data);

// Funcion 2. Aqui se guardan las estadisticas de los equipos en la base de datos, se ejecuta cada vez que se inserta un partido
const tablaPosiciones = {};

// Se recorre cada partido para calcular los puntos y goles de cada equipo
partidos.forEach(partido => {
    // Se limpian los nombres de los equipos por si tienen salto de linea 
    const local = partido.id_local.nombre_equipo.trim();
    const visitante = partido.id_visitante.nombre_equipo.trim();

    const gl = partido.goles_local;
    const gv = partido.goles_visitante;

    // SI el equipo no existe en la tabla de posiciones, se inicializa con 0 puntos y 0 goles
    if (!tablaPosiciones[local]) {
        tablaPosiciones[local] = {equipo: local, pts: 0, pj:0, gf:0, gc:0, dg:0};
}
if (!tablaPosiciones[visitante]) {
    tablaPosiciones[visitante] = {equipo: visitante, pts: 0, pj:0, gf:0, gc:0, dg:0};
}

// Vamos a sumar partidos jugados, goles a favor y goles en contra 
tablaPosiciones[local].pj += 1;
tablaPosiciones[local].gf += gl;
tablaPosiciones[local].gc += gv;

tablaPosiciones[visitante].pj += 1;
tablaPosiciones[visitante].gf += gv;
tablaPosiciones[visitante].gc += gl;

// REGLA: Asignacion de puntos segun el resultado del partido
if (gl > gv) {
    tablaPosiciones[local].pts += 3; // Gana el local
} else if (gl < gv) {
    tablaPosiciones[visitante].pts += 3; // Gana el visitante
} else {
    tablaPosiciones[local].pts += 1; // Empate
    tablaPosiciones[visitante].pts += 1; // Empate
}

// Se recalcula la diferencia de goles para cada equipo
tablaPosiciones[local].dg = tablaPosiciones[local].gf - tablaPosiciones[local].gc;
tablaPosiciones[visitante].dg = tablaPosiciones[visitante].gf - tablaPosiciones[visitante].gc;
});

// Convertimos el objeto en un arreglo y lo ordenamos por puntos, de mayor a menor
const tablaOrdenada = Object.values(tablaPosiciones).sort((a, b) => b.pts - a.pts || b.dg - a.dg);

console.log("\n Tabla de posiciones ");
console.table(tablaOrdenada); 
// .table es una funcion de consola que permite mostrar un arreglo de objetos 
// en forma de tabla
}

// Ejecutamos la funcion CONTROL
obtenerPartidos();

// Funcion 3. para insertar un partido en la base de datos desde el codigo 
async function insertarPartido() {
    const { data, error } = await supabase 
    .from('partidos')
    .insert([
        {
            id_local: 1,
            id_visitante: 2,
            goles_local: 4,
            goles_visitante: 1,
            fecha_partido: '2026-06-28'
        }
    ])
    .select();

    if (error) {
        console.error("Error al insertar el partido:", error);
        return;
    }

    console.log("Partido insertado exitosamente desde Node.js:");
    console.log(data);
}

// Apagamos por un momento la de obtner y ejecutamos la de insertar 
// insertarPartido(); // CONTROL: Descomentar esta linea para insertar un partido en la base de datos



