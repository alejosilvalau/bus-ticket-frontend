export interface Bus {
  id: number;
  plateNumber: string;
  totalCapacity: number;
  isActive: boolean;
}

export interface CreateBus {
  plateNumber: string;
  totalCapacity: number;
  isActive?: boolean;
}

export interface UpdateBus {
  id: number;
  plateNumber?: string;
  totalCapacity?: number;
  isActive?: boolean;
}

export interface SearchBus {
  plateNumber?: string;
  startTotalCapacity?: number;
  endTotalCapacity?: number;
  isActive?: boolean;
}
