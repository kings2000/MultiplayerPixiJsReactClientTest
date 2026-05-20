import { useTick } from "@pixi/react";
import { Container, Sprite, Texture } from "pixi.js";
import { useRef } from "react";
import type { IPosition } from "../../types/common";
import { checkCanMove, handleMovement } from "../../helpers/commons";



interface IHeroProps{
    heroRef: React.RefObject<Container | null>;
    containerRef: React.RefObject<Container | null>;
    heroTexture: Texture | undefined;
    canvasSize: {width: number, height: number};
    targetPositionRef: React.RefObject<{ x: number; y: number }>;
    
}

export const Hero = ({heroRef, heroTexture, targetPositionRef, canvasSize} : IHeroProps) => {

    const spriteRef = useRef<Sprite>(null);

    //we store the current positon of the player
    const currentPositon = useRef<IPosition>({x: targetPositionRef.current.x / 2, y: targetPositionRef.current.y / 2});
    
    

    useTick((delta) => {

        //If the target position is valid we can do a smooth movement to it, then update the current postion
        if(targetPositionRef.current)
        {
            const targetPos = {x: targetPositionRef.current.x / 2, y: targetPositionRef.current.y / 2};
            const {position : newPosition} = handleMovement(currentPositon.current, targetPos, 20, delta.deltaTime);
            if(checkCanMove(newPosition, canvasSize.width, canvasSize.height))
            {
                currentPositon.current = newPosition;
            }
            
        }

        if (spriteRef.current) {
            spriteRef.current.x = currentPositon.current.x;
            spriteRef.current.y = currentPositon.current.y;
        }
    
    });

    if(!heroTexture) return null;
    

    return(
        <pixiContainer ref={heroRef}>
            <pixiSprite
                ref={spriteRef}
                texture={heroTexture}
                x={currentPositon.current.x}
                y={currentPositon.current.y}
                scale={2}
                anchor= {0.5}
            />
        </pixiContainer>
    );
};