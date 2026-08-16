const DICTIONARY: Record<string, string> = {
  'An unexpected error occurred. Please try again later.': 'Ocurrió un error inesperado. Intentá de nuevo más tarde.',
  'Invalid request. Please check your input.': 'Solicitud inválida. Revisá los datos ingresados.',
  'Invalid request body. Check the fields and try again.': 'Cuerpo de solicitud inválido. Revisá los campos e intentá de nuevo.',
  'Validation failed': 'Falló la validación',
  'Token has expired': 'El token expiró',
  'Invalid token': 'Token inválido',
  'Token rejected': 'Token rechazado',
  'Internal server error': 'Error interno del servidor',
  'Admin access required': 'Se requiere acceso de administrador',
  'Authentication required': 'Se requiere autenticación',
  'Endpoint not found': 'Recurso no encontrado',
  'Invalid email or password': 'Email o contraseña inválidos',
  'Invalid current credentials': 'Las credenciales actuales son inválidas',
  'New password cannot be the same as the current password': 'La nueva contraseña no puede ser igual a la actual',
  'No authenticated user found': 'No se encontró un usuario autenticado',
  'Bus is not active.': 'El colectivo no está activo.',
  'Bus capacity exceeded': 'Se superó la capacidad del colectivo',
  'Bus capacity cannot be lower than the number of seats': 'La capacidad del colectivo no puede ser menor a la cantidad de asientos del colectivo',
  'Driver is not active.': 'El chofer no está activo.',
  'Seat is not active.': 'El asiento no está activo.',
  'Departure date must be in the future.': 'La fecha de salida debe ser futura.',
  'Arrival date must be after departure date.': 'La fecha de llegada debe ser posterior a la de salida.',
  'Origin and destination locations must be different.': 'El origen y el destino deben ser diferentes.',
  'You can only create tickets for yourself': 'Solo podés crear tickets para vos mismo',
  'Cannot update a cancelled ticket.': 'No se puede actualizar un ticket cancelado.',
  'Cannot book or update ticket: trip departs in less than 24 hours.': 'No se puede reservar o actualizar el ticket: el viaje sale en menos de 24 horas.',
  'Trip is full. No available seats.': 'El viaje está completo. No hay asientos disponibles.',
  'Seat does not belong to the trip\'s bus.': 'El asiento no pertenece al colectivo del viaje.',
  'You can only modify your own tickets': 'Solo podés modificar tus propios tickets',
  'Ticket is already cancelled.': 'El ticket ya está cancelado.',
  'Insufficient seats available': 'No hay suficientes asientos disponibles',
  'Seat already booked for this trip': 'El asiento ya está reservado para este viaje',
  'Data conflict. Please try again.': 'Conflicto de datos. Intentá de nuevo.',
  'You can only update your own profile': 'Solo podés actualizar tu propio perfil',
  'must not be null': 'no debe ser nulo',
  'must not be blank': 'no debe estar vacío',
  'must be at least {value}': 'debe ser al menos {value}',
  'size must be between {min} and {max}': 'el tamaño debe estar entre {min} y {max}',
  'must be greater than or equal to {value}': 'debe ser mayor o igual a {value}',
  'must be a valid email address (e.g. user@example.com)': 'debe ser una dirección de email válida',
  'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)': 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (@$!%*?&)',
  'Phone number must be valid (e.g. +541112345678)': 'El número de teléfono debe ser válido (ej. +541112345678)',
  'Plate number must be a valid Argentine plate (e.g. ab123cd or abc123)': 'La patente debe ser una patente argentina válida (ej. AB123CD o ABC123)',
  'License number must be a valid Argentine DNI (7 or 8 digits)': 'El número de licencia debe ser un DNI argentino válido (7 u 8 dígitos)',
  'Name must contain only letters, spaces, hyphens or apostrophes': 'El nombre solo debe contener letras, espacios, guiones o apóstrofes',
  'Email must be from a known provider (e.g. gmail.com, outlook.com)': 'El email debe ser de un proveedor conocido (ej. gmail.com, outlook.com)',
};

const RESOURCE_ES: Record<string, string> = {
  Trip: 'el viaje',
  Bus: 'el colectivo',
  Driver: 'el chofer',
  Location: 'la localidad',
  User: 'el usuario',
  Seat: 'el asiento',
  SeatType: 'el tipo de asiento',
  Ticket: 'el ticket',
};

const FIELD_ES: Record<string, string> = {
  id: 'id',
  plateNumber: 'patente',
  licenseNumber: 'número de licencia',
  phoneNumber: 'teléfono',
  email: 'email',
  name: 'nombre',
  cityName: 'ciudad',
  state: 'estado',
  postalCode: 'código postal',
  'city+state+postalCode': 'ciudad + estado + código postal',
  'bus+letter+number': 'colectivo + letra + número',
  'trip+seat+isCancelledFalse': 'viaje + asiento + no cancelado',
};

const VALIDATION_FIELD_ES: Record<string, string> = {
  id: 'ID',
  firstName: 'Nombre',
  lastName: 'Apellido',
  email: 'Email',
  password: 'Contraseña',
  confirmPassword: 'Confirmar contraseña',
  currentPassword: 'Contraseña actual',
  newPassword: 'Nueva contraseña',
  plateNumber: 'Patente',
  totalCapacity: 'Capacidad total',
  licenseNumber: 'Número de licencia',
  phoneNumber: 'Teléfono',
  cityName: 'Ciudad',
  state: 'Estado',
  postalCode: 'Código postal',
  name: 'Nombre',
  upcharge: 'Recargo',
  letter: 'Letra',
  number: 'Número',
  busId: 'Bus',
  seatTypeId: 'Tipo de asiento',
  tripId: 'Viaje',
  seatId: 'Asiento',
  locationOriginId: 'Origen',
  locationDestinationId: 'Destino',
  basePrice: 'Precio base',
  departureDate: 'Fecha de salida',
  arrivalDate: 'Fecha de llegada',
};

function translateValidation(field: string, suffix: string): string | null {
  const fieldEs = VALIDATION_FIELD_ES[field] ?? field;
  const suffixEs = DICTIONARY[suffix] ?? suffix;
  return `${fieldEs}: ${suffixEs}`;
}

function translateInterpolated(message: string): string | null {
  const notFound = /^(\w+) not found with ([^:]+): (.+)$/.exec(message);
  if (notFound) {
    const resource = RESOURCE_ES[notFound[1]] ?? notFound[1];
    const field = FIELD_ES[notFound[2]] ?? notFound[2];
    return `No se encontró ${resource} con ${field}: ${notFound[3]}`;
  }

  const duplicate = /^(\w+) already exists with ([^:]+): (.+)$/.exec(message);
  if (duplicate) {
    const resource = RESOURCE_ES[duplicate[1]] ?? duplicate[1];
    const field = FIELD_ES[duplicate[2]] ?? duplicate[2];
    return `Ya existe ${resource} con ${field}: ${duplicate[3]}`;
  }

  const driverBusy = /^Driver is not available: has another trip within (\d+) hours\.?$/.exec(message);
  if (driverBusy) {
    return `El chofer no está disponible: tiene otro viaje dentro de ${driverBusy[1]} horas.`;
  }

  const busBusy = /^Bus is not available: has another trip within (\d+) minutes\.?$/.exec(message);
  if (busBusy) {
    return `El colectivo no está disponible: tiene otro viaje dentro de ${busBusy[1]} minutos.`;
  }

  const dateFormat = /^Invalid date format: (.+?)\. Expected formats: (.+)$/.exec(message);
  if (dateFormat) {
    return `Formato de fecha inválido: '${dateFormat[1]}'. Formatos esperados: ${dateFormat[2]}`;
  }

  const validation = /^([\w.]+): (.+)$/.exec(message);
  if (validation) {
    return translateValidation(validation[1], validation[2]);
  }

  return null;
}

export function translateError(message: string): string {
  const exact = DICTIONARY[message];
  if (exact) return exact;
  return translateInterpolated(message) ?? message;
}

export function getApiError(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { message?: string } } } | undefined)?.response?.data?.message;
  if (!message) return fallback;
  return translateError(message);
}
