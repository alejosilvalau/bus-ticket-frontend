export interface Location {
  id: number;
  cityName: string;
  state: string;
  postalCode: string;
}

export interface CreateLocation {
  cityName: string;
  state: string;
  postalCode: string;
}

export interface UpdateLocation {
  id: number;
  cityName?: string;
  state?: string;
  postalCode?: string;
}

export interface SearchLocation {
  cityName?: string;
  state?: string;
  postalCode?: string;
}
