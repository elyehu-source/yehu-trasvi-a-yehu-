
import React, { useState, useEffect } from 'react';
import { WorkoutGoal, WorkoutRoutine, GenerationConfig, Derechohabiente } from './types';
import { generateWorkoutRoutine, generateImageForExercise } from './services/geminiService';
import Header from './components/Header';
import WorkoutForm from './components/WorkoutForm';
import RoutineDisplay from './components/RoutineDisplay';
import RoutineHistory from './components/RoutineHistory';
import ProfileSection from './components/ProfileSection';
import { PostureGuide, PreventionGuide } from './components/InfoGuides';

const STORAGE_KEY = 'imss_sonora_routines_v1';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
  const [savedRoutines, setSavedRoutines] = useState<WorkoutRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedRoutines(JSON.parse(stored));
      } catch (e) {
        console.error("Error al cargar historial", e);
      }
    }

    const loadHero = async () => {
      const img = await generateImageForExercise("Modern clinical background of a human spinal column, professional healthcare shades of deep green and white, medical technology style, high quality 4k.");
      if (img) setHeroImage(img);
    };
    loadHero();
  }, []);

  const saveToLocalStorage = (newList: WorkoutRoutine[]) => {
    setSavedRoutines(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const handleGenerate = async (config: GenerationConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedRoutine = await generateWorkoutRoutine(config);
      const profilesRaw = localStorage.getItem('imss_sonora_profiles');
      if (profilesRaw) {
        const profiles: Derechohabiente[] = JSON.parse(profilesRaw);
        if (profiles.length > 0) {
          generatedRoutine.derechohabiente = profiles[0];
        }
      }
      setRoutine(generatedRoutine);
      const newList = [generatedRoutine, ...savedRoutines].slice(0, 50);
      saveToLocalStorage(newList);
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor médico. Reintente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 space-y-12">
          <div className="relative">
            <div className="w-40 h-40 border-[8px] border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-3xl p-4 shadow-2xl scale-75">
               <div className="text-[#1e5d42] text-3xl font-serif font-extrabold leading-none">IMSS</div>
               <div className="text-[#6d1d2b] text-[10px] font-sans font-black uppercase tracking-widest -mt-1">Sonora</div>
            </div>
          </div>
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-black text-white tracking-tight animate-pulse">Personalizando Plan de Salud...</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Unidad de Inteligencia Médica Sonora</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile': return <ProfileSection />;
      case 'posture': return <PostureGuide />;
      case 'prevention': return <PreventionGuide />;
      case 'history': return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-white">Mi Archivo de Entrenamiento</h2>
            <p className="text-slate-400 font-medium">Historial de rutinas generadas para sus objetivos de salud.</p>
          </div>
          <RoutineHistory 
            routines={savedRoutines} 
            onSelect={(r) => { setRoutine(r); setActiveTab('generator'); }} 
            onDelete={(id) => saveToLocalStorage(savedRoutines.filter(r => r.id !== id))}
          />
          {savedRoutines.length === 0 && (
            <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No hay rutinas guardadas aún</p>
               <button 
                 onClick={() => setActiveTab('generator')}
                 className="mt-6 text-emerald-400 font-black text-xs underline decoration-2 underline-offset-4 hover:text-white transition-colors"
               >
                 GENERAR MI PRIMER PLAN AQUÍ
               </button>
            </div>
          )}
        </div>
      );
      case 'generator':
      default:
        return routine ? (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
              <button onClick={() => setRoutine(null)} className="flex items-center space-x-2 text-slate-400 hover:text-white px-6 py-3 rounded-2xl border border-slate-800 bg-slate-900/50 font-bold text-xs uppercase tracking-widest transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span>Nueva Consulta IA</span>
              </button>
            </div>
            <RoutineDisplay routine={routine} />
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in duration-700">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center px-5 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em]">
                  Delegación Sonora
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter leading-[1.1]">Higiene de Columna Inteligente</h2>
                <p className="text-slate-400 text-3xl font-black uppercase tracking-tight leading-relaxed">
                  Plan de ejercicios <span className="text-emerald-500">IMSS Sonora</span>
                </p>
                <div className="flex items-center gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
                   <div className="bg-white px-4 py-2 rounded-xl shadow-lg flex flex-col items-center">
                      <div className="text-[#1e5d42] text-xl font-serif font-extrabold leading-none">IMSS</div>
                      <div className="text-[#6d1d2b] text-[7px] font-sans font-black uppercase tracking-widest -mt-0.5">Sonora</div>
                   </div>
                   <div className="text-xs font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                      Programa de Salud Integral<br/>
                      <span className="text-emerald-500 font-black">Prestaciones Sociales</span>
                   </div>
                </div>
              </div>
              
              <div className="relative aspect-square md:aspect-video rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                {heroImage ? (
                  <img src={heroImage} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" alt="Prestaciones Sociales" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <div className="animate-pulse flex flex-col items-center">
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Cargando entorno médico...</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              </div>
            </div>

            <WorkoutForm onSubmit={handleGenerate} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        {renderContent()}
      </main>
      <footer className="py-20 border-t border-slate-900 bg-slate-950 mt-auto">
        <div className="container mx-auto px-4 flex flex-col items-center space-y-10">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col items-center transform hover:scale-105 transition-transform">
            <div className="text-[#1e5d42] text-7xl font-serif font-extrabold leading-none tracking-tighter">IMSS</div>
            <div className="text-[#6d1d2b] text-2xl font-sans font-black uppercase tracking-[0.4em] mt-1">Sonora</div>
          </div>
          <div className="text-center space-y-3">
            <p className="text-emerald-500 font-black text-sm tracking-[0.4em] uppercase">Higiene de Columna · Sonora</p>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.5em]">Instituto Mexicano del Seguro Social · Prestaciones Sociales</p>
          </div>
          <div className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em] flex gap-12 pt-4">
            <span>Seguridad Social</span>
            <span>Solidaridad</span>
            <span>Bienestar</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
