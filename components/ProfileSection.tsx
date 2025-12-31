
import React, { useState, useEffect } from 'react';
import { Derechohabiente } from '../types';

const ProfileSection: React.FC = () => {
  const [profiles, setProfiles] = useState<Derechohabiente[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Partial<Derechohabiente>>({
    fullName: '',
    nss: '',
    age: '',
    umf: '',
    height: '',
    weight: '',
    bmi: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('imss_sonora_profiles');
    if (stored) {
      setProfiles(JSON.parse(stored));
    }
  }, []);

  // Cálculo automático de IMC cuando cambia talla o peso
  useEffect(() => {
    if (currentProfile.height && currentProfile.weight) {
      const h = parseFloat(currentProfile.height) / 100;
      const w = parseFloat(currentProfile.weight);
      if (h > 0 && w > 0) {
        const bmi = (w / (h * h)).toFixed(1);
        setCurrentProfile(prev => ({ ...prev, bmi }));
      }
    }
  }, [currentProfile.height, currentProfile.weight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentProfile({ ...currentProfile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: Derechohabiente = {
      ...(currentProfile as Derechohabiente),
      id: Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString()
    };
    
    const updatedProfiles = [newProfile, ...profiles];
    setProfiles(updatedProfiles);
    localStorage.setItem('imss_sonora_profiles', JSON.stringify(updatedProfiles));
    
    setSaved(true);
    setCurrentProfile({ fullName: '', nss: '', age: '', umf: '', height: '', weight: '', bmi: '' });
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    localStorage.setItem('imss_sonora_profiles', JSON.stringify(updated));
  };

  const getBMICategory = (bmi: string) => {
    const val = parseFloat(bmi);
    if (val < 18.5) return { label: 'Bajo Peso', color: 'text-blue-400' };
    if (val < 25) return { label: 'Normal', color: 'text-emerald-400' };
    if (val < 30) return { label: 'Sobrepeso', color: 'text-yellow-400' };
    return { label: 'Obesidad', color: 'text-red-400' };
  };

  const downloadCSV = () => {
    if (profiles.length === 0) return;
    
    const headers = ['ID', 'Nombre Completo', 'NSS', 'Edad', 'UMF', 'Talla(cm)', 'Peso(kg)', 'IMC', 'Fecha Registro'];
    const rows = profiles.map(p => [
      p.id,
      p.fullName,
      p.nss,
      p.age,
      p.umf,
      p.height,
      p.weight,
      p.bmi,
      new Date(p.registeredAt).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Base_Datos_Derechohabientes_IMSS_Sonora_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="grid lg:grid-cols-5 gap-10">
        {/* Formulario de Registro */}
        <div className="lg:col-span-2 glass-panel p-8 md:p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl bg-slate-900/40 h-fit">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Nuevo Registro</h2>
              <p className="text-slate-400 text-sm font-medium">Alta de derechohabiente.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Nombre Completo</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={currentProfile.fullName}
                  onChange={handleChange}
                  placeholder="Ej. María Elena Vázquez"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">NSS (11 Dígitos)</label>
                <input 
                  type="text" 
                  name="nss"
                  value={currentProfile.nss}
                  onChange={handleChange}
                  placeholder="00000000000"
                  maxLength={11}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Edad</label>
                <input 
                  type="number" 
                  name="age"
                  value={currentProfile.age}
                  onChange={handleChange}
                  placeholder="Años"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                  required
                />
              </div>
              
              {/* Campos biométricos */}
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 sm:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-emerald-500/70 uppercase tracking-widest mb-1.5 ml-1">Talla (cm)</label>
                  <input 
                    type="number" 
                    name="height"
                    value={currentProfile.height}
                    onChange={handleChange}
                    placeholder="170"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-emerald-500/70 uppercase tracking-widest mb-1.5 ml-1">Peso (kg)</label>
                  <input 
                    type="number" 
                    name="weight"
                    value={currentProfile.weight}
                    onChange={handleChange}
                    placeholder="75"
                    step="0.1"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                {currentProfile.bmi && (
                  <div className="col-span-2 pt-2 flex items-center justify-between border-t border-slate-800">
                    <span className="text-[10px] font-black text-slate-500 uppercase">IMC Calculado:</span>
                    <div className="flex items-center gap-3">
                       <span className={`text-lg font-black ${getBMICategory(currentProfile.bmi).color}`}>{currentProfile.bmi}</span>
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${getBMICategory(currentProfile.bmi).color}`}>{getBMICategory(currentProfile.bmi).label}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">UMF / Unidad Médica</label>
                <input 
                  type="text" 
                  name="umf"
                  value={currentProfile.umf}
                  onChange={handleChange}
                  placeholder="Ej. UMF 37"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-xl ${
                saved ? 'bg-emerald-600 text-white scale-[0.98]' : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
              }`}
            >
              {saved ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  Registrado Correctamente
                </>
              ) : (
                'Finalizar Registro'
              )}
            </button>
          </form>
        </div>

        {/* Base de Datos de Usuarios */}
        <div className="lg:col-span-3 glass-panel p-8 md:p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl bg-slate-900/20 flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Archivo Clínico Local</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{profiles.length} Derechohabientes</p>
              </div>
            </div>
            
            <button 
              onClick={downloadCSV}
              disabled={profiles.length === 0}
              className="px-6 py-2.5 bg-slate-100 hover:bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Descargar Base de Datos
            </button>
          </div>

          <div className="flex-1 overflow-auto max-h-[500px] custom-scrollbar pr-2">
            {profiles.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                    <th className="pb-4 pl-2">Información Personal</th>
                    <th className="pb-4 text-center">Somatometría</th>
                    <th className="pb-4">NSS / UMF</th>
                    <th className="pb-4 text-right pr-2">Gestión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {profiles.map((p) => (
                    <tr key={p.id} className="group hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 pl-2">
                        <div className="text-sm font-bold text-slate-200">{p.fullName}</div>
                        <div className="text-[10px] text-slate-600 font-medium">{p.age} años</div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400">IMC: <span className={getBMICategory(p.bmi).color}>{p.bmi}</span></span>
                          <span className="text-[9px] text-slate-600 font-medium">{p.height}cm / {p.weight}kg</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-xs font-mono text-slate-400">{p.nss}</div>
                        <div className="text-[9px] text-emerald-600 font-black uppercase">{p.umf}</div>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button 
                          onClick={() => handleDeleteProfile(p.id)}
                          className="p-2 text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remover Registro"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 py-20">
                <svg className="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-xs font-black uppercase tracking-[0.3em]">No se encontraron derechohabientes registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
