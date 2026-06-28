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
