
import React, { useState, useEffect, useRef } from 'react';
import { WorkoutRoutine, RoutineSection, Exercise } from '../types';
import { generateImageForExercise } from '../services/geminiService';

interface RoutineDisplayProps {
  routine: WorkoutRoutine;
}

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let isMounted = true;
    
    // Temporizador de 2 segundos para control de carga lenta
    const timerId = setTimeout(() => {
      if (isMounted && imageLoading) {
        setLoadTimeout(true);
      }
    }, 2000);

    const loadImage = async () => {
      setImageLoading(true);
      setHasError(false);
      setLoadTimeout(false);
      try {
        const url = await generateImageForExercise(exercise.imagePrompt);
        if (isMounted) {
          clearTimeout(timerId);
          if (url) {
            setImageUrl(url);
          } else {
            setHasError(true);
          }
        }
      } catch (e) {
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setImageLoading(false);
      }
    };
    
    loadImage();
    return () => { 
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [isVisible, exercise.imagePrompt]);

  return (
    <div ref={containerRef} className="flex flex-col bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all group overflow-hidden shadow-lg">
      <div className="relative h-56 w-full bg-slate-800 flex items-center justify-center overflow-hidden">
        {imageLoading && !loadTimeout ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 animate-pulse">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/60 font-black">Escaneando Técnica...</span>
          </div>
        ) : imageUrl && !hasError && !loadTimeout ? (
          <img 
            src={imageUrl} 
            alt={exercise.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/20 text-emerald-500 p-8 text-center animate-in fade-in duration-500">
             <svg className="w-16 h-16 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Ilustración no disponible</span>
             <p className="text-[9px] mt-2 opacity-40">
               {loadTimeout ? 'Tiempo de espera excedido' : 'Siga las instrucciones de texto debajo'}
             </p>
          </div>
        )}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-4 py-1.5 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-xl">
            {exercise.duration}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h5 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{exercise.name}</h5>
        <div className="space-y-4 text-sm">
          <p className="text-slate-400 leading-relaxed font-medium">{exercise.description}</p>
          <div className="flex items-start space-x-3 text-emerald-400 bg-emerald-950/30 p-4 rounded-xl border border-emerald-900/30">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="italic font-bold text-xs leading-relaxed">{exercise.tips}</p>
          </div>
          {(exercise.sets || exercise.reps) && (
            <div className="flex space-x-6 pt-2 border-t border-slate-800/50">
              {exercise.sets && <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Series: <span className="text-white ml-1">{exercise.sets}</span></div>}
              {exercise.reps && <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Reps: <span className="text-white ml-1">{exercise.reps}</span></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ section: RoutineSection, type: 'warmup' | 'main' | 'cooldown' }> = ({ section, type }) => {
  const accentColors = {
    warmup: 'text-orange-400 bg-orange-950/20 border-orange-900/30',
    main: 'text-blue-400 bg-blue-950/20 border-blue-900/30',
    cooldown: 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30'
  };

  return (
    <div className="space-y-8">
      <div className={`p-6 rounded-[2rem] border ${accentColors[type]} flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl`}>
        <div>
          <h4 className="text-2xl font-black uppercase tracking-[0.2em] mb-2">{section.title}</h4>
          <p className="text-slate-300 text-sm font-medium">{section.description}</p>
        </div>
        <div className="flex-shrink-0">
          <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-current bg-current/5`}>
            {type === 'warmup' ? 'FASE 1' : type === 'main' ? 'FASE 2' : 'FASE 3'}
          </span>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {section.exercises.map((ex, i) => (
          <ExerciseCard key={i} exercise={ex} />
        ))}
      </div>
    </div>
  );
};

const RoutineDisplay: React.FC<RoutineDisplayProps> = ({ routine }) => {
  const handleDownloadTxt = () => {
    const dh = routine.derechohabiente;
    const somatometria = dh?.height ? `
Talla: ${dh.height} cm | Peso: ${dh.weight} kg | IMC: ${dh.bmi}` : '';

    const profileHeader = dh ? `
DATOS DEL DERECHOHABIENTE:
Nombre: ${dh.fullName}
NSS: ${dh.nss}
Edad: ${dh.age} años | UMF: ${dh.umf}${somatometria}
-----------------------------------------------------------` : '';
    
    const formatSection = (title: string, data: RoutineSection) => {
      let text = `\n[ ${title.toUpperCase()} ]\n${data.title}\n${data.description}\n`;
      data.exercises.forEach((ex, idx) => {
        text += `\n${idx + 1}. ${ex.name.toUpperCase()}\n`;
        text += `   Duración: ${ex.duration}${ex.reps ? ` | Repeticiones: ${ex.reps}` : ''}${ex.sets ? ` | Series: ${ex.sets}` : ''}\n`;
        text += `   Instrucciones: ${ex.description}\n`;
        text += `   Consejo Técnico: ${ex.tips}\n`;
      });
      return text;
    };

    const content = `
IMSS SONORA - PROGRAMA DE SALUD INTEGRAL
PRESTACIONES SOCIALES - HIGIENE DE COLUMNA
-----------------------------------------------------------${profileHeader}
RUTINA: ${routine.name.toUpperCase()}
OBJETIVOS: ${routine.goal.join(', ')}
DURACIÓN ESTIMADA: ${routine.totalDurationMinutes} MINUTOS
FECHA DE EMISIÓN: ${new Date(routine.createdAt).toLocaleDateString()}
-----------------------------------------------------------
${formatSection('Fase 1: Calentamiento', routine.warmUp)}
${formatSection('Fase 2: Parte Medular', routine.mainWorkout)}
${formatSection('Fase 3: Enfriamiento', routine.coolDown)}
-----------------------------------------------------------
CONSEJOS GENERALES DE SALUD:
${routine.overallAdvice}

Nota: Realice estos ejercicios con control y respiración consciente. 
Si presenta dolor agudo, suspenda la actividad y consulte a su médico.
-----------------------------------------------------------
INSTITUTO MEXICANO DEL SEGURO SOCIAL - DELEGACIÓN SONORA
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rutina_IMSS_Sonora_${routine.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-20 pb-20">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="inline-block px-6 py-2 bg-emerald-600/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase">
          Plan de Salud Digitalizado
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight max-w-4xl">{routine.name}</h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {routine.goal.map((g) => (
            <span key={g} className="px-5 py-2 bg-slate-800/60 text-slate-300 rounded-2xl text-[11px] font-black border border-slate-700 uppercase tracking-widest italic">
              {g}
            </span>
          ))}
          <div className="flex items-center space-x-3 px-6 py-2 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{routine.totalDurationMinutes} MINUTOS</span>
          </div>
        </div>

        <button 
          onClick={handleDownloadTxt}
          className="mt-6 px-12 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-slate-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar Expediente (.txt)
        </button>
      </div>

      <div className="space-y-32">
        <Section section={routine.warmUp} type="warmup" />
        <Section section={routine.mainWorkout} type="main" />
        <Section section={routine.coolDown} type="cooldown" />
      </div>

      <div className="p-12 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-950 border border-emerald-500/20 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform duration-1000">
          <svg className="w-64 h-64 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
             <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <h4 className="text-3xl font-black mb-8 flex items-center space-x-4 text-emerald-400">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="uppercase tracking-widest">Recomendación Médica</span>
          </h4>
          <p className="text-slate-300 leading-relaxed text-2xl italic font-medium max-w-4xl">
            "{routine.overallAdvice}"
          </p>
          
          <div className="mt-12 pt-10 border-t border-emerald-500/10 flex flex-col sm:flex-row justify-between items-center gap-8">
             <div className="flex flex-col items-center sm:items-start">
               <span className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.4em] mb-1">IMSS SONORA</span>
               <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Unidad de Prestaciones Sociales</span>
             </div>
             <button 
               onClick={handleDownloadTxt}
               className="px-8 py-3 bg-slate-900 text-emerald-400 border border-emerald-500/30 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
             >
               Exportar para su médico
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineDisplay;
