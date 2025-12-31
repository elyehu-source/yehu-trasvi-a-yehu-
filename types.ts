
export enum WorkoutGoal {
  FLEXIBILITY = 'Flexibilidad',
  BACK = 'Espalda',
  POSTURE = 'Postura',
  STRENGTH = 'Fuerza',
  RESISTANCE = 'Resistencia',
  CORE = 'Core',
  CERVICAL = 'Cervicales',
  LUMBAR = 'Lumbar',
  DORSALGIA = 'Dorsalgia'
}

export interface Derechohabiente {
  id: string;
  fullName: string;
  nss: string;
  age: string;
  umf: string;
  height: string; // Talla en cm
  weight: string; // Peso en kg
  bmi: string;    // IMC calculado
  registeredAt: string;
}

export interface Exercise {
  name: string;
  duration: string;
  reps?: string;
  sets?: string;
  description: string;
  tips: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface RoutineSection {
  title: string;
  description: string;
  exercises: Exercise[];
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  goal: WorkoutGoal[];
  totalDurationMinutes: number;
  warmUp: RoutineSection;
  mainWorkout: RoutineSection;
  coolDown: RoutineSection;
  overallAdvice: string;
  createdAt: string;
  derechohabiente?: Derechohabiente;
}

export interface GenerationConfig {
  goals: WorkoutGoal[];
  duration: number;
  intensity: 'Baja' | 'Media' | 'Alta';
}
