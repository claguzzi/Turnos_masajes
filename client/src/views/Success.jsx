import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4efe9] px-4 py-10 text-center">

      {/* Título */}
      <h1 className="text-3xl md:text-5xl font-serif tracking-wide text-stone-800 mb-3">
        ESPACIO ZEN
      </h1>

      <p className="text-stone-500 italic mb-8">
        Turno confirmado
      </p>

      {/* Card principal */}
      <div className="bg-white/70 backdrop-blur shadow-lg rounded-2xl p-6 w-full max-w-md mb-10 border border-stone-200">
        <h2 className="text-lg font-medium text-stone-700 mb-4">
          ¡Gracias por tu reserva!
        </h2>

        <p className="text-stone-600 leading-relaxed text-sm">
          Tu turno fue registrado correctamente.  
          Te esperamos para que disfrutes un momento de calma y bienestar.
        </p>
      </div>

      {/* Botón */}
      <Link
        to="/home"
        className="px-10 py-3 rounded-full bg-[#7b6f5b] text-white font-medium shadow-lg hover:bg-[#6a5f4d] transition-all"
      >
        Volver al inicio
      </Link>

    </div>
  );
}