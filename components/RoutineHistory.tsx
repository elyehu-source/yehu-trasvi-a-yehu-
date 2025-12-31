
import React from 'react';
import { WorkoutRoutine } from '../types';

interface RoutineHistoryProps {
  routines: WorkoutRoutine[];
  onSelect: (routine: WorkoutRoutine) => void;
  onDelete: (id: string) => void;
}

const RoutineHistory: React.FC<RoutineHistoryProps> = ({ routines, onSelect, onDelete }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold flex items-center gap-3 text-slate-300 uppercase tracking-widest text-sm">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historial de Planes (Local)
        </h3>
        <span className="text-[10px] font-bold text-slate-500 uppercase">Guardado en este navegador</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routines.map((r) => (
          <div 
            key={r.id} 
            className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer"
            onClick={() => onSelect(r)}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-slate-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                {r.name}
              </h4>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(r.id); }}
                className="text-slate-600 hover:text-red-400 transition-colors p-1"
                title="Eliminar de mi equipo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {r.goal.slice(0, 2).map((g) => (
                <span key={g} className="text-[9px] font-black uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md border border-slate-700">
                  {g}
                </span>
              ))}
              {r.goal.length > 2 && <span className="text-[9px] text-slate-600">+{r.goal.length - 2}</span>}
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
              <span className="text-emerald-600">{r.totalDurationMinutes} MIN</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutineHistory;
