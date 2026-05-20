import type { Direction } from "../types/common";

export const DEFAULT_POS_X = 50;
export const DEFAULT_POS_Y = 50;

export const DIRECTION_KEYS: Record<string, Direction> = {
    KeyW: 'UP',
    KeyS: 'DOWN',
    KeyA: 'LEFT',
    KeyD: 'RIGHT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',

}