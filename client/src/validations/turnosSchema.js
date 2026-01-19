import * as Yup from "yup";

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

export const turnosSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(5, "El nombre debe tener al menos 5 caracteres")
    .max(25, "El nombre no debe exceder los 25 caracteres")
    .required("El nombre es obligatorio"),

  telefono: Yup.string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(10, "El teléfono debe tener exactamente 10 dígitos")
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
