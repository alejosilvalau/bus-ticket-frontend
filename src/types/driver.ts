export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
  licenseNumber: string;
  phoneNumber: string;
}

export interface CreateDriver {
  firstName: string;
  lastName: string;
  isActive?: boolean;
  licenseNumber: string;
  phoneNumber: string;
}

export interface UpdateDriver {
  id: number;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  licenseNumber?: string;
  phoneNumber?: string;
}

export interface SearchDriver {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  licenseNumber?: string;
  phoneNumber?: string;
}
