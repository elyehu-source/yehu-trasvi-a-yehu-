
import React, { useState } from 'react';
import { WorkoutGoal, GenerationConfig } from '../types';

interface WorkoutFormProps {
  onSubmit: (config: GenerationConfig) => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSubmit }) => {
  const [selectedGoals, setSelectedGoals] = useState<WorkoutGoal[]>([]);
  const [duration, setDuration] = useState<number>(30);
  const [intensity, setIntensity] = useState<'Baja' | 'Media' | 'Alta'>('Media');

  const goals = Object.values(WorkoutGoal);

  const toggleGoal = (goal: WorkoutGoal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoals.length === 0) {
      alert('Por favor selecciona al menos un objetivo.');
      return;
    }
    onSubmit({ goals: selectedGoals, duration, intensity });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto border border-slate-800">
      <div className="space-y-8">
        {/* Goals Section */}
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
            <span>¿Qué áreas quieres trabajar?</span>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-900/20 px-2 py-0.5 rounded border border-blue-800/50">Multi-selección</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {goals.map((goal) => {
              const isSelected = selectedGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`relative px-4 py-3 rounded-xl border-2 transition-all duration-300 text-xs sm:text-sm font-bold flex items-center justify-center overflow-hidden min-h-[54px] ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-400 text-white animate-glow z-10'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800/80'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  )}
                  <span className="relative flex items-center gap-2">
                    {isSelected && (
                      <svg className="w-4 h-4 text-blue-300 animate-in zoom-in duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {goal}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex justify-between">
              <span>Duración Total</span>
              <span className="text-blue-400 font-black">{duration} min</span>
            </label>
            <input 
              type="range" 
              min="15" 
              max="90" 
              step="5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
              <span>15 min</span>
              <span>45 min</span>
              <span>90 min</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              Nivel de Intensidad
            </label>
            <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
              {(['Baja', 'Media', 'Alta'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setIntensity(level)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                    intensity === level
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-y-[-1px]'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={selectedGoals.length === 0}
          className="group relative w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/30 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out"></div>
          <span className="relative flex items-center justify-center gap-2">
            Generar Rutina Inteligente
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
        </button>
      </div>
    </form>
  );
};

export default WorkoutForm;
