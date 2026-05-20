import type { Direction } from "../../types/common"
import { DIRECTION_KEYS } from "../../constants/game-world"

class HeroControlsService
{
    private heldDirections: Direction[] = [];

  constructor() {
    window.addEventListener("keydown", (e) => this.handleKey(e, true));
    window.addEventListener("keyup", (e) => this.handleKey(e, false));
  }

  private handleKey(e: KeyboardEvent, isKeyDown: boolean) {
    const direction = DIRECTION_KEYS[e.code];
    if (!direction) return;

    if (isKeyDown) {
      if (!this.heldDirections.includes(direction)) {
        this.heldDirections = [direction, ...this.heldDirections];
      }
    } else {
      this.heldDirections = this.heldDirections.filter((dir) => dir !== direction);
    }
  }

  getDirection(): Direction | null {
    return this.heldDirections[0] || null;
  }

  destroy() {
    window.removeEventListener("keydown", (e) => this.handleKey(e, true));
    window.removeEventListener("keyup", (e) => this.handleKey(e, false));
  }
}

export const heroControlsService = new HeroControlsService();
