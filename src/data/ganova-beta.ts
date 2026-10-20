/**
 * La beta de Ganova: con qué Supabase habla la web y las opciones del
 * formulario. Lo usan el formulario (src/pages/ganova.astro) y el panel de
 * aspirantes (src/pages/ganova/beta/panel.astro), para que los dos digan lo mismo.
 *
 * Cada opción es [código, texto]. El código es lo que se guarda y lo que lee el
 * CRM; el texto es lo que ve la persona. Los códigos son los de
 * docs/registro-beta/registro.schema.json y los CHECK de la tabla
 * (C:\ganova\supabase\beta_registros.sql): si cambia uno, se cambia en los tres
 * lados. El texto se puede cambiar libre.
 */

export const SUPABASE = {
  url: 'https://voigbndxjzphuttdcula.supabase.co',
  // Llave pública (anon), la misma que trae la app. No da acceso a nada por sí
  // sola: el esquema `beta` está cerrado y solo se entra por sus funciones.
  anon: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvaWdibmR4anpwaHV0dGRjdWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTQxNjgsImV4cCI6MjA5ODIzMDE2OH0.ehXKnfveRLvrgn9OqnsDkO4DOgWXRD5bQfKDzrSXv_M',
};

export type Opcion = [codigo: string, texto: string];

// Chihuahua va primero porque la app está hecha ahí.
export const estadosMx = [
  'Chihuahua', 'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México',
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit',
  'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí',
  'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];

// Código ISO de dos letras; XX = "Otro país" (lo que escriba va en pais_nombre).
export const paises: Opcion[] = [
  ['MX', 'México'], ['US', 'Estados Unidos'], ['GT', 'Guatemala'], ['HN', 'Honduras'],
  ['SV', 'El Salvador'], ['NI', 'Nicaragua'], ['CR', 'Costa Rica'], ['PA', 'Panamá'],
  ['CO', 'Colombia'], ['VE', 'Venezuela'], ['EC', 'Ecuador'], ['PE', 'Perú'],
  ['BO', 'Bolivia'], ['PY', 'Paraguay'], ['UY', 'Uruguay'], ['AR', 'Argentina'],
  ['CL', 'Chile'], ['BR', 'Brasil'], ['ES', 'España'], ['XX', 'Otro país'],
];
export const ocupaciones: Opcion[] = [
  ['ganadero', 'Ganadero o ranchero'], ['vaquero', 'Vaquero o encargado'], ['veterinario', 'Veterinario'],
  ['engordador', 'Engordador'], ['asesor', 'Asesor o técnico'], ['otra', 'Otra'],
];
export const especialidades: Opcion[] = [
  ['cria', 'Cría (vaca y becerro)'], ['engorda', 'Engorda'], ['leche', 'Leche'], ['caballos', 'Caballos'],
  ['cabras_borregos', 'Cabras y borregos'], ['aves', 'Aves'], ['otra', 'Otra'],
];
export const cabezas: Opcion[] = [
  ['menos_20', 'Menos de 20'], ['20_100', 'De 20 a 100'], ['100_500', 'De 100 a 500'],
  ['mas_500', 'Más de 500'], ['sin_ganado', 'Todavía no tengo ganado'],
];
export const senales: Opcion[] = [['no_hay', 'No hay señal'], ['a_ratos', 'Hay a ratos'], ['buena', 'Hay buena señal']];
export const equipos: Opcion[] = [['solo_yo', 'Solo yo'], ['1_2', '1 o 2 más'], ['3_mas', '3 o más']];
export const medios: Opcion[] = [
  ['tiktok', 'TikTok'], ['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'],
  ['whatsapp', 'WhatsApp'], ['conocido', 'Un conocido'], ['asociacion', 'Asociación ganadera'], ['otro', 'Otro'],
];

// Lo que decide el equipo en el panel; los mismos valores que el CHECK de `decision`.
export const decisiones: Opcion[] = [
  ['pendiente', 'Por revisar'], ['escogido', 'Escogido'], ['en_espera', 'En espera'], ['descartado', 'Descartado'],
];
