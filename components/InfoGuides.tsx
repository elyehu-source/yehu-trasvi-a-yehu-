
import React from 'react';

export const PostureGuide: React.FC = () => {
  const guidelines = [
    {
      title: 'Frente a la Computadora',
      tips: [
        'Monitor: El borde superior debe estar al nivel de los ojos a 50-60 cm.',
        'Regla 20-20-20: Cada 20 min, mire a 6 metros por 20 segundos.',
        'Soporte Lumbar: Mantenga la curvatura natural de la espalda.',
        'Pies: Deben tocar el suelo totalmente; use reposapiés si es necesario.'
      ],
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },
    {
      title: 'Carga de Objetos Pesados',
      tips: [
        'Base de Sustentación: Separe los pies a la anchura de los hombros.',
        'Flexión: Doble siempre las rodillas, nunca la cintura.',
        'Agarre: Mantenga la carga lo más pegada al pecho posible.',
        'Respiración: Expulse el aire al hacer el esfuerzo máximo.'
      ],
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    },
    {
      title: 'Higiene del Sueño',
      tips: [
        'Posición Ideal: De lado (fetal) con una almohada entre las rodillas.',
        'Boca Arriba: Coloque una almohada pequeña debajo de las rodillas.',
        'Almohada: Debe llenar el hueco del cuello sin forzar la inclinación.',
        'Colchón: Firmeza media; debe renovarse cada 8-10 años.'
      ],
      icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
    },
    {
      title: 'Uso de Dispositivos Móviles',
      tips: [
        'Nivel Visual: Levante el teléfono a la altura de la cara, no baje la cabeza.',
        'Cuello: Evite la inclinación prolongada (previene el "Text Neck").',
        'Descansos: Limite el uso continuo a máximo 15 minutos.',
        'Apoyo: Use ambos pulgares para escribir y apoye los antebrazos.'
      ],
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
    },
    {
      title: 'Conducción de Vehículos',
      tips: [
        'Distancia: Rodillas ligeramente flexionadas al presionar pedales.',
        'Respaldo: Inclinación recomendada entre 100° y 110°.',
        'Reposacabezas: El centro debe coincidir con la altura de las orejas.',
        'Viajes largos: Realice paradas cada 2 horas para estirar las piernas.'
      ],
      icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1M18 16h1a1 1 0 001-1v-5a1 1 0 00-1-1h-2l-4-4h-5'
    },
    {
      title: 'Posición de Pie (Bipedestación)',
      tips: [
        'Alternancia: Cambie el peso de una pierna a otra constantemente.',
        'Calzado: Use zapatos con soporte de arco y tacón de 2-3 cm.',
        'Abdomen: Mantenga una ligera contracción para proteger las lumbares.',
        'Hombros: Llévelos hacia atrás y abajo, evitando la postura "encorvada".'
      ],
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">Guía Postural Integral IMSS</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          La prevención comienza con la consciencia de nuestros movimientos diarios. Siga estos lineamientos ergonómicos validados.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guidelines.map((g, i) => (
          <div key={i} className="glass-panel p-8 rounded-[2rem] border border-slate-800 hover:border-emerald-500/30 transition-all group bg-slate-900/40">
            <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-500">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={g.icon} />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-5 group-hover:text-emerald-400 transition-colors">{g.title}</h3>
            <ul className="space-y-4">
              {g.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[13px] text-slate-300 leading-snug">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PreventionGuide: React.FC = () => {
  const sections = [
    {
      category: 'Salud Sistémica y Estilo de Vida',
      items: [
        { title: 'Control de Peso', desc: 'Cada kilo de exceso aumenta x4 la presión en los discos lumbares al caminar.' },
        { title: 'Hidratación Óptima', desc: 'Los discos intervertebrales son mayormente agua; la deshidratación acelera el desgaste.' },
        { title: 'Nutrición Ósea', desc: 'Asegure ingesta de Calcio y Vitamina D para prevenir osteoporosis y microfracturas.' },
        { title: 'No Fumar', desc: 'El tabaco reduce el flujo sanguíneo a la columna, impidiendo la regeneración de tejidos.' }
      ]
    },
    {
      category: 'Ergonomía Laboral y Actividad',
      items: [
        { title: 'Micro-pausas Activas', desc: 'Cada 45 min de sedentarismo requiere 5 min de estiramiento controlado.' },
        { title: 'Organización del Espacio', desc: 'Coloque los objetos de uso frecuente (teléfono, mouse) al alcance sin girar el tronco.' },
        { title: 'Calzado Ergonómico', desc: 'Evite tacones mayores a 4cm o suelas totalmente planas por tiempo prolongado.' },
        { title: 'Técnica de Entrenamiento', desc: 'Nunca sacrifique la forma por el peso; la columna es el eje, no la palanca.' }
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in duration-700 pb-20">
      <div className="bg-emerald-600/10 border border-emerald-500/30 p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
           <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        
        <div className="relative z-10 space-y-12">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-white mb-2 italic">Manual de Prevención de Columna</h2>
            <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-xs">Protocolo Clínico de Prestaciones Sociales</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {sections.map((sec, idx) => (
              <div key={idx} className="space-y-6">
                <h3 className="text-emerald-500 font-black text-sm uppercase tracking-widest border-b border-emerald-500/20 pb-2">
                  {sec.category}
                </h3>
                <div className="space-y-4">
                  {sec.items.map((item, i) => (
                    <div key={i} className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all group">
                      <h4 className="text-white font-bold mb-1 text-sm group-hover:text-emerald-400 transition-colors">{item.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-red-950/20 border border-red-900/30 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h4 className="text-red-400 font-black uppercase tracking-widest text-sm">Señales de Alerta (Busque atención inmediata)</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-black uppercase tracking-tighter text-slate-400">
               <div className="bg-red-900/10 p-3 rounded-lg border border-red-900/20 text-center">Dolor nocturno persistente</div>
               <div className="bg-red-900/10 p-3 rounded-lg border border-red-900/20 text-center">Debilidad en piernas o pies</div>
               <div className="bg-red-900/10 p-3 rounded-lg border border-red-900/20 text-center">Entumecimiento de zona genital</div>
               <div className="bg-red-900/10 p-3 rounded-lg border border-red-900/20 text-center">Fiebre asociada al dolor</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
          Información con fines educativos. Siempre consulte a su médico de la UMF correspondiente.
        </p>
      </div>
    </div>
  );
};
