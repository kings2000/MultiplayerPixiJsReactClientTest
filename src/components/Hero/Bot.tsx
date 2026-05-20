import { extend, useTick } from "@pixi/react";
import { Sprite, Texture } from "pixi.js";
import { useRef, useEffect } from "react";
import type { IPosition } from "../../types/common";
import { handleMovement } from "../../helpers/commons";

extend({ Sprite });

interface IBotProps {
  texture: Texture | undefined;
  targetPosition: IPosition
}

export const Bot = ({ texture, targetPosition }: IBotProps) => {
    const spriteRef = useRef<Sprite>(null);
    const currentPositon = useRef<IPosition>({x: targetPosition.x / 2, y: targetPosition.y / 2});


    useEffect(() => {
        if (spriteRef.current) {
            spriteRef.current.x = currentPositon.current.x;
            spriteRef.current.y = currentPositon.current.y;
        }
    }, [targetPosition]);

  useTick((delta) => {

    const targetPos = {x: targetPosition.x / 2, y: targetPosition.y / 2};
    const {position : newPosition} = handleMovement(currentPositon.current, targetPos, 20, delta.deltaTime);
    currentPositon.current = newPosition;

  });


  if (!texture) return null;

  return (
    <pixiSprite
      ref={spriteRef}
      texture={texture}
      x={currentPositon.current.x}
      y={currentPositon.current.y}
      scale={2}
      anchor={0.5}
    />
  );
};