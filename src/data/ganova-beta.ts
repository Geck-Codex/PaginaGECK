/**
 * La beta de Ganova: a dónde manda el formulario (src/pages/ganova.astro) y sus
 * opciones.
 *
 * Cada opción es [código, texto]. El código es lo que se guarda y lo que valida
 * el CRM de Geck; el texto es lo que ve la persona. Los códigos son los de
 * docs/registro-beta/registro.schema.json: si cambia uno, se cambia también
 * ahí y se le avisa a Geck, o el CRM rechaza el registro. El texto se puede
 * cambiar libre.
 */

// El intermediario del formulario: recibe el registro y se lo pasa al CRM de
// Geck con su llave (C:\ganova\supabase\functions\registro-beta). Aquí no va
// ninguna llave.
export const REGISTRO_BETA = 'https://voigbndxjzphuttdcula.supabase.co/functions/v1/registro-beta';

// Turnstile (captcha de Cloudflare). Vacío = sin captcha: quedan la trampa para
// bots y el límite por IP del intermediario. Para prenderlo se pone aquí la
// llave del sitio (es pública) y la secreta va en Supabase como TURNSTILE_SECRETA.
export const TURNSTILE_SITIO = '';

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
