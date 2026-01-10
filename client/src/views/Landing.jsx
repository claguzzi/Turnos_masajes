import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 px-4 py-10 text-center">
     
      <h1 className="text-3xl font-bold text-rose-700 mb-3 md:text-5xl">
        Bienvenido a <span className="text-rose-500">ESPACIO ZEN</span>
      </h1>

      
      <p className="text-base text-rose-600 mb-6 md:text-lg">
        Agenda tu turno de masajes de manera fácil y relajante.
      </p>

      
      <div className="bg-white shadow-md rounded-xl p-5 w-full max-w-sm mb-6 border border-rose-100">
        <h2 className="text-lg font-semibold text-rose-500 mb-3">
          Advertencias importantes ⚠️
        </h2>
        <ul className="text-left text-rose-700 list-disc list-inside space-y-2 text-sm md:text-base">
          <li>Los masajes no sustituyen atención médica profesional.</li>
          <li>Contraindicado en casos de lesiones graves, fiebre o infecciones.</li>
          <li>Se requiere reserva previa para disponibilidad.</li>
          <li>Cancelaciones con al menos 24 horas de anticipación.</li>
        </ul>
      </div>

    
      <Link
        to="/home"
        className="w-full max-w-xs px-6 py-3 bg-rose-300 text-rose-900 font-medium rounded-lg shadow hover:bg-rose-400 transition"
      >
        Reservar un turno
      </Link>
    </div>
  );
}
