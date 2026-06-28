// 1. Se cargan las variables de entorno de mi archivo .env
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

//2. Se lee la URL y la llave publica desde process.env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;   

//3. Se creo el cliente de conexcion a la base de datos de Supabase
// En este se puede hacer cualquier consulta a la base de datos
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Conexion a la base de datos exitosa.");


// Funcion para traer los partidos de la base de datos 
async function obtenerPartidos() {
    const { data, error } = await supabase
    .from('partidos')
    .select('*');

    if (error) {
        console.error("Error al obtener los partidos:", error);
        return;
    }

    console.log("Conexion exitosa, tus partidos son:");
    console.log(data);
}

// Ejecutamos la funcion 
obtenerPartidos();

// Funcion para insertar un partido en la base de datos desde el codigo 
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
    .select(); // El select es para que nos devuelva el partido creado 

    if (error) {
        console.error("Error al insertar el partido:", error);
        return;
    }

    console.log("Partido insertado exitosamente desde Node.js:");
    console.log(data);
}

// Apagamos por un momento la de obtner y ejecutamos la de insertar 
insertarPartido();