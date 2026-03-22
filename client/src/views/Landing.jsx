import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4efe9] px-4 py-10 text-center transition-all duration-700 ease-out">

      {/* Título */}
      <h1 className="text-3xl md:text-5xl font-serif tracking-wide text-stone-800 mb-3 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
        ESPACIO ZEN
      </h1>

      <p className="text-stone-500 italic mb-8 opacity-0 animate-[fadeIn_1s_ease-out_0.2s_forwards]">
        Masajes relajantes y descontracturantes
      </p>

      <p className="max-w-md text-stone-600 mb-10 leading-relaxed opacity-0 animate-[fadeIn_1s_ease-out_0.4s_forwards]">
        Un momento de calma para tu cuerpo y tu mente.
      </p>

      {/* Card */}
      <div className="bg-white/70 backdrop-blur shadow-lg rounded-2xl p-6 w-full max-w-md mb-10 border border-stone-200 opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards]">
        <h2 className="text-lg font-medium text-stone-700 mb-4">
          Información importante
        </h2>

        <ul className="text-left text-stone-600 list-disc list-inside space-y-2 text-sm">
          <li>Los masajes no sustituyen atención médica.</li>
          <li>No recomendado con fiebre, infecciones o lesiones graves.</li>
          <li>Se requiere reserva previa.</li>
          <li>Cancelaciones con 24 hs de anticipación.</li>
        </ul>
      </div>

      {/* Botón */}
      <Link
        to="/home"
        className="px-10 py-3 rounded-full bg-[#7b6f5b] text-white font-medium shadow-lg hover:bg-[#6a5f4d] transition-all duration-300 animate-pulse"
      >
        Reservar turno
      </Link>

    </div>
  );
}