import type { SeatAvailability } from '@/types/seat';
import { Armchair } from 'lucide-react';

interface SeatMapProps {
  seats: SeatAvailability[];
  selectedSeatId: number | null;
  onSelectSeat: (seat: SeatAvailability) => void;
}

export default function SeatMap({ seats, selectedSeatId, onSelectSeat }: SeatMapProps) {
  const activeSeats = seats.filter((s) => s.isActive);
  const cols = 4;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-4 w-4 rounded bg-green-100 border border-green-300" /> Disponible
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-4 w-4 rounded bg-red-100 border border-red-300" /> Ocupado
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-4 w-4 rounded bg-[#c60001] border border-[#c60001]" /> Seleccionado
        </span>
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-500">
        <Armchair className="h-4 w-4" />
        Frente del autobús
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {activeSeats.map((seat) => {
          const isSelected = seat.id === selectedSeatId;
          const isUnavailable = !seat.isAvailable;

          return (
            <button
              key={seat.id}
              onClick={() => !isUnavailable && onSelectSeat(seat)}
              disabled={isUnavailable}
              className={`flex flex-col items-center rounded-lg border-2 p-2 text-xs transition-all ${
                isSelected
                  ? 'border-[#c60001] bg-[#c60001] text-white shadow-md scale-105'
                  : isUnavailable
                    ? 'border-red-200 bg-red-50 text-red-300 cursor-not-allowed'
                    : 'border-green-200 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100 cursor-pointer'
              }`}
            >
              <span className="font-bold">{seat.letter}{seat.number}</span>
              <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                {seat.seatTypeName}
              </span>
            </button>
          );
        })}
      </div>

      {activeSeats.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">No hay asientos disponibles</p>
      )}
    </div>
  );
}
