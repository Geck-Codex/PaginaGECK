/**
 * anuncios.js — lo que flota por encima del sitio.
 *
 * Este archivo manda. `CapaAnuncio.jsx` no sabe nada de Radar GC: lee de aqui
 * cual anuncio esta vigente y pinta lo que diga su entrada. Para sacar otro
 * anuncio se agrega una entrada y se apaga la anterior (`activo: false`); no se
 * toca ningun componente ni ninguna pagina.
 *
 * Campos de cada anuncio:
 *   id          Identificador estable. Es la llave del "ya lo cerro" en
 *               localStorage y el `where` de la medicion, asi que no se cambia
 *               una vez publicado.
 *   activo      Interruptor manual.
 *   desde/hasta Fechas 'AAAA-MM-DD', ambas incluidas. Vacias = sin limite.
 *   titulo      Nombre del anuncio. Es marca: no se traduce.
 *   hash        El enlace compartible que lo abre: geckcodex.com/#radar
 *   video       Ruta en /public. Si el archivo aun no existe, la capa muestra
 *               el poster y "Proximamente" en lugar del reproductor.
 *   poster      Imagen vertical 9:16; tambien es la miniatura de la tarjeta.
 *   whatsapp    Numero al que llega el boton principal.
 *   cupo        Opcional. Cuantos negocios entran. Vacio = no se muestra.
 *   fechaLimite Opcional. 'AAAA-MM-DD'. Vacio = no se muestra.
 *   contenido   Textos por idioma (es, en, pt). `areas` (opcional) son las
 *               etiquetas cortas bajo el gancho. Las pestanas se arman con
 *               bloques de tipo: pasos, lista, caso, preguntas, cierre.
 *
 * Si hay varios activos a la vez, gana el que vence antes (`hasta` mas
 * proxima); los que no tienen `hasta` van al final.
 */

export const ANUNCIOS = [
  {
    id: 'radar-gc',
    activo: true,
    desde: '2026-10-14',
    hasta: '',
    titulo: 'Radar GC',
    hash: 'radar',
    video: '/assets/video/radar-gc.mp4',
    poster: '/assets/image/anuncios/radar-gc.webp',
    whatsapp: '526271745436',
    cupo: null,
    fechaLimite: '',
    contenido: {
      es: {
        ceja: 'Convocatoria abierta',
        gancho: 'Un diagnóstico tecnológico para tu negocio. Sin costo y sin compromiso.',
        // Lo que se revisa, en corto y a la vista: es lo que vuelve concreto
        // un "diagnostico tecnologico". Que sirve para cualquier giro ya lo
        // dice la pestana de Preguntas.
        areas: ['Inventario y pérdidas', 'Ventas y cobros', 'Sistemas y tecnología', 'Equipo y tareas'],
        cta: 'Quiero mi diagnóstico',
        mensaje: 'Hola, quiero mi diagnóstico Radar GC',
        tarjeta: { subtitulo: 'Convocatoria abierta', accion: 'Ver video' },
        pestanas: [
          {
            etiqueta: 'Cómo funciona',
            bloques: [
              {
                tipo: 'pasos',
                titulo: 'Cómo funciona',
                intro: 'Cuatro pasos, en este orden.',
                items: [
                  { titulo: 'Visita', texto: 'Vamos a tu negocio, vemos cómo trabajan y platicamos contigo.' },
                  { titulo: 'Diagnóstico', texto: 'Ordenamos lo que vimos en un resumen con hallazgos por prioridad.' },
                  { titulo: 'Entrega en persona', texto: 'Te lo entregamos en persona y te explicamos cada punto.' },
                  { titulo: 'Tú decides', texto: 'Si quieres una propuesta, la armamos. Si no, el diagnóstico es tuyo.' },
                ],
              },
            ],
          },
          {
            etiqueta: 'Caso real',
            bloques: [
              {
                tipo: 'caso',
                titulo: 'Un caso real',
                intro: 'Lo que encontró un diagnóstico en una tienda de abarrotes.',
                // Anonimo a proposito. Si el cliente autoriza su nombre, va aqui.
                negocio: '',
                etiqueta: 'Tienda de abarrotes · Diagnóstico GC-001',
                titular: 'Pierden cerca del 2% del inventario y lo descubren hasta 6 meses después.',
                barras: [
                  { etiqueta: 'Aceites', valor: 8000 },
                  { etiqueta: 'Papas', valor: 3000 },
                  { etiqueta: 'Sodas', valor: 3000 },
                  { etiqueta: 'Galletas', valor: 1000 },
                ],
                total: { etiqueta: 'Pérdida en el último conteo, solo 4 categorías', valor: 15000 },
                hallazgos: [
                  { nivel: 'urgente', texto: 'La pérdida se descubre demasiado tarde.' },
                  { nivel: 'importante', texto: 'La merma se confunde con robo.' },
                  { nivel: 'importante', texto: 'El equipo no tiene tareas claras.' },
                  { nivel: 'bien', texto: 'Ya tenían punto de venta, tarjeta y programa de puntos.' },
                ],
              },
            ],
          },
          {
            etiqueta: 'Preguntas',
            bloques: [
              {
                tipo: 'preguntas',
                titulo: 'Preguntas frecuentes',
                items: [
                  { pregunta: '¿Tiene costo?', respuesta: 'No. El diagnóstico es sin costo y sin compromiso.' },
                  { pregunta: '¿Qué recibo?', respuesta: 'Un documento con el resumen de lo que vimos, los hallazgos ordenados por urgencia y recomendaciones de lo que puedes hacer desde hoy.' },
                  { pregunta: '¿Tengo que contratar algo después?', respuesta: 'No. Si quieres una propuesta, la preparamos. Si no, el diagnóstico es tuyo.' },
                  { pregunta: '¿Sirve para mi tipo de negocio?', respuesta: 'Sí. Hay preguntas para comercio, comida, servicios con cita, talleres, membresías y clases, salud, hospedaje, servicios profesionales y educación.' },
                ],
              },
              { tipo: 'cierre', titulo: 'Pide tu diagnóstico', texto: 'Escríbenos por WhatsApp y agendamos la visita.' },
            ],
          },
        ],
      },

      en: {
        ceja: 'Open call',
        gancho: 'A technology assessment for your business. Free and with no commitment.',
        areas: ['Inventory and losses', 'Sales and payments', 'Systems and technology', 'Team and tasks'],
        cta: 'I want my assessment',
        mensaje: 'Hi, I want my Radar GC assessment',
        tarjeta: { subtitulo: 'Open call', accion: 'Watch video' },
        pestanas: [
          {
            etiqueta: 'How it works',
            bloques: [
              {
                tipo: 'pasos',
                titulo: 'How it works',
                intro: 'Four steps, in this order.',
                items: [
                  { titulo: 'Visit', texto: 'We come to your business, see how you work and talk with you.' },
                  { titulo: 'Assessment', texto: 'We organize what we saw into a summary with findings ranked by priority.' },
                  { titulo: 'In-person delivery', texto: 'We hand it to you in person and walk you through every point.' },
                  { titulo: 'You decide', texto: 'If you want a proposal, we put one together. If not, the assessment is yours.' },
                ],
              },
            ],
          },
          {
            etiqueta: 'Real case',
            bloques: [
              {
                tipo: 'caso',
                titulo: 'A real case',
                intro: 'What an assessment found at a grocery store.',
                negocio: '',
                etiqueta: 'Grocery store · Assessment GC-001',
                titular: 'They lose about 2% of their inventory and find out up to 6 months later.',
                barras: [
                  { etiqueta: 'Cooking oil', valor: 8000 },
                  { etiqueta: 'Chips', valor: 3000 },
                  { etiqueta: 'Sodas', valor: 3000 },
                  { etiqueta: 'Cookies', valor: 1000 },
                ],
                total: { etiqueta: 'Loss in the last count, only 4 categories', valor: 15000 },
                hallazgos: [
                  { nivel: 'urgente', texto: 'Losses are discovered too late.' },
                  { nivel: 'importante', texto: 'Shrinkage gets mistaken for theft.' },
                  { nivel: 'importante', texto: 'The team has no clear tasks.' },
                  { nivel: 'bien', texto: 'They already had a point of sale, card payments and a loyalty program.' },
                ],
              },
            ],
          },
          {
            etiqueta: 'Questions',
            bloques: [
              {
                tipo: 'preguntas',
                titulo: 'Frequently asked questions',
                items: [
                  { pregunta: 'Does it cost anything?', respuesta: 'No. The assessment is free and comes with no commitment.' },
                  { pregunta: 'What do I get?', respuesta: 'A document summarizing what we saw, the findings ranked by urgency and recommendations you can act on starting today.' },
                  { pregunta: 'Do I have to hire anything afterwards?', respuesta: 'No. If you want a proposal, we prepare one. If not, the assessment is yours.' },
                  { pregunta: 'Does it work for my type of business?', respuesta: 'Yes. There are questions for retail, food, appointment-based services, workshops, memberships and classes, health, lodging, professional services and education.' },
                ],
              },
              { tipo: 'cierre', titulo: 'Request your assessment', texto: 'Message us on WhatsApp and we will schedule the visit.' },
            ],
          },
        ],
      },

      pt: {
        ceja: 'Inscrições abertas',
        gancho: 'Um diagnóstico tecnológico para o seu negócio. Sem custo e sem compromisso.',
        areas: ['Estoque e perdas', 'Vendas e cobranças', 'Sistemas e tecnologia', 'Equipe e tarefas'],
        cta: 'Quero meu diagnóstico',
        mensaje: 'Olá, quero meu diagnóstico Radar GC',
        tarjeta: { subtitulo: 'Inscrições abertas', accion: 'Ver vídeo' },
        pestanas: [
          {
            etiqueta: 'Como funciona',
            bloques: [
              {
                tipo: 'pasos',
                titulo: 'Como funciona',
                intro: 'Quatro passos, nesta ordem.',
                items: [
                  { titulo: 'Visita', texto: 'Vamos até o seu negócio, vemos como vocês trabalham e conversamos com você.' },
                  { titulo: 'Diagnóstico', texto: 'Organizamos o que vimos em um resumo com os achados por prioridade.' },
                  { titulo: 'Entrega pessoalmente', texto: 'Entregamos pessoalmente e explicamos cada ponto.' },
                  { titulo: 'Você decide', texto: 'Se quiser uma proposta, nós a preparamos. Se não, o diagnóstico é seu.' },
                ],
              },
            ],
          },
          {
            etiqueta: 'Caso real',
            bloques: [
              {
                tipo: 'caso',
                titulo: 'Um caso real',
                intro: 'O que um diagnóstico encontrou em uma mercearia.',
                negocio: '',
                etiqueta: 'Mercearia · Diagnóstico GC-001',
                titular: 'Perdem cerca de 2% do estoque e só descobrem até 6 meses depois.',
                barras: [
                  { etiqueta: 'Óleos', valor: 8000 },
                  { etiqueta: 'Salgadinhos', valor: 3000 },
                  { etiqueta: 'Refrigerantes', valor: 3000 },
                  { etiqueta: 'Biscoitos', valor: 1000 },
                ],
                total: { etiqueta: 'Perda na última contagem, só 4 categorias', valor: 15000 },
                hallazgos: [
                  { nivel: 'urgente', texto: 'A perda é descoberta tarde demais.' },
                  { nivel: 'importante', texto: 'A quebra é confundida com roubo.' },
                  { nivel: 'importante', texto: 'A equipe não tem tarefas claras.' },
                  { nivel: 'bien', texto: 'Já tinham ponto de venda, cartão e programa de pontos.' },
                ],
              },
            ],
          },
          {
            etiqueta: 'Perguntas',
            bloques: [
              {
                tipo: 'preguntas',
                titulo: 'Perguntas frequentes',
                items: [
                  { pregunta: 'Tem custo?', respuesta: 'Não. O diagnóstico é sem custo e sem compromisso.' },
                  { pregunta: 'O que eu recebo?', respuesta: 'Um documento com o resumo do que vimos, os achados ordenados por urgência e recomendações do que você pode fazer desde hoje.' },
                  { pregunta: 'Tenho que contratar algo depois?', respuesta: 'Não. Se quiser uma proposta, nós a preparamos. Se não, o diagnóstico é seu.' },
                  { pregunta: 'Serve para o meu tipo de negócio?', respuesta: 'Sim. Há perguntas para comércio, alimentação, serviços com agendamento, oficinas, assinaturas e aulas, saúde, hospedagem, serviços profissionais e educação.' },
                ],
              },
              { tipo: 'cierre', titulo: 'Peça seu diagnóstico', texto: 'Escreva para nós no WhatsApp e agendamos a visita.' },
            ],
          },
        ],
      },
    },
  },
];

/** Fecha local 'AAAA-MM-DD'. Local y no UTC: en Parral, a las 7 p. m. del 31
 *  todavia es 31 aunque en UTC ya sea el dia siguiente. */
function hoyLocal(fecha) {
  const p = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${p(fecha.getMonth() + 1)}-${p(fecha.getDate())}`;
}

/**
 * El anuncio que toca mostrar hoy, o `null` si no hay ninguno.
 *
 * Se llama en el navegador y no en el build: el sitio es estatico, y una fecha
 * calculada al compilar dejaria un anuncio vencido en pantalla hasta el
 * siguiente despliegue.
 */
export function anuncioVigente(lista = ANUNCIOS, fecha = new Date()) {
  const dia = hoyLocal(fecha);
  const vigentes = lista.filter(
    (a) => a.activo && (!a.desde || a.desde <= dia) && (!a.hasta || dia <= a.hasta),
  );
  vigentes.sort((a, b) => (a.hasta || '9999-12-31').localeCompare(b.hasta || '9999-12-31'));
  return vigentes[0] ?? null;
}

/** Textos del anuncio en el idioma pedido; si falta, en español. */
export function contenidoDe(anuncio, lang) {
  return anuncio.contenido[lang] ?? anuncio.contenido.es;
}

/** Enlace de WhatsApp con el mensaje del anuncio ya escrito. */
export function enlaceWhatsapp(anuncio, lang) {
  const { mensaje } = contenidoDe(anuncio, lang);
  return `https://wa.me/${anuncio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
