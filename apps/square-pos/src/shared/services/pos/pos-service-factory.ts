import type { IPosService } from './pos.interface'
import { SquarePosService } from './square-pos.service'

// Factory function to provide an instance of IPosService.
export function createPosService(token: string, locationId: string): IPosService {
  return new SquarePosService(token, locationId)
}
