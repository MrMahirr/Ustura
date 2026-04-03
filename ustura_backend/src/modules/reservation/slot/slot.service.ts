import { Injectable } from '@nestjs/common';

@Injectable()
export class SlotService {
  // TODO: generateSlots() — çalışma saatlerine göre 30dk'lık slotlar üret
  // TODO: getAvailableSlots() — dolu slotları filtrele
  // TODO: lockSlot() — Redis ile slot kilitleme (race condition önleme)
}
