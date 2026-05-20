import type { Direction, IPosition } from "../types/common"

export const calculateCanvasSize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    return {width, height}
}


export const calculateNewTarget = (x: number, y: number, direction:Direction) : IPosition => {
    return{
        x: x + (direction == 'LEFT' ? -1 : direction == 'RIGHT' ? 1 : 0),
        y: y + (direction == "UP" ? -1 : direction == "DOWN" ? 1 : 0) 
    }
}

const moveTowards = (current : number, target: number, nextstep: number) => {
    return(
        current + Math.sign(target - current) * Math.min(Math.abs(target - current), nextstep)
    );
} ;

const continueMovement = (currentPosition: IPosition, targetPositon: IPosition, step: number): IPosition => {
    return{
        x: moveTowards(currentPosition.x, targetPositon.x, step),
        y: moveTowards(currentPosition.y, targetPositon.y, step)
    }
}



export const handleMovement = (currentPosition: IPosition, targetPositon: IPosition, moveSpeed: number, delta: number) => {
    const step = moveSpeed * delta;
    const distance = Math.hypot(targetPositon.x - currentPosition.x, targetPositon.y - currentPosition.y)

    if(distance <= step)
    {
        return{
            position: targetPositon,
            completed: true
        }
    }
    return{
        position: continueMovement(currentPosition, targetPositon, step),
        completed : false
    }
}

export const checkCanMove = (target: IPosition, width: number, height: number) => {
    if(target.x > width || target.x < 0 || target.y > height || target.y < 0)
        return false;
    return true
}