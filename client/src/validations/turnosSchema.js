import * as Yup from "yup";

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

export const turnosSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),

  telefono: Yup.string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .required("El teléfono es obligatorio"),

  email: Yup.string()
    .email("Formato de email inválido")
    .required("El email es obligatorio"),

  fecha: Yup.date()
    .required("La fecha es obligatoria")
    .min(hoy, "La fecha no puede ser pasada"),

  hora: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de horario inválido (HH:mm)")
    .required("El horario es obligatorio"),
});
