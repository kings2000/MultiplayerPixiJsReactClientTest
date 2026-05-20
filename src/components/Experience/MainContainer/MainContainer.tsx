import { extend, useTick } from "@pixi/react";
import { Assets, Container, Sprite, Texture } from "pixi.js";
import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Hero } from "../../Hero/Hero";
import { heroControlsService } from "../../Hero/HeroControlsService";
import { wsService } from "../../Network/WebSocketService";
import type { IInputMessage, IPlayerSnapshot, ISnapshot} from "../../Network/Snapshot";
import { Bot } from "../../Hero/Bot";

import backgroundAsset from '../../../assets/space-stars.jpg'
import heroAsset from '../../../assets/ship/ship1.png'
import botAsset from '../../../assets/ship/bot_ship1.png'

extend({Container, Sprite, Texture});


interface IMainContainerProps{
    canvasSize: {width:number; height: number}
    userid : string;
}

export const MainContainer = ({canvasSize, children} : PropsWithChildren<IMainContainerProps>) => {

    const containerRef = useRef<Container | null>(null);
    const heroRef = useRef<Container | null>(null);
    const seq = useRef(0);
    const heroPosition = useRef({x: canvasSize.width / 2, y: canvasSize.height / 2});
    

    const [backgroundTexture, setBackgroundTexture] = useState<Texture | undefined> (undefined);
    const [heroTexture, setHeroTexture] = useState<Texture | undefined>(undefined);
    const [botTexture, setBotTexture] = useState<Texture | undefined>(undefined);
    
    const [botPositions, setBotPositions] = useState<IPlayerSnapshot[]>([]);
    const [inputDetected, setInputDetected] = useState<boolean>(false);


    //load the assets used
    useEffect(() => {

        Promise.all([
            Assets.load(backgroundAsset),
            Assets.load(heroAsset),
            Assets.load(botAsset)
        ]).then(([bgTexure, heroTexture, botTexture]: Texture[]) => {
            heroTexture.source.scaleMode = 'nearest';
            botTexture.source.scaleMode = 'nearest';
            setBackgroundTexture(bgTexure);
            setHeroTexture(heroTexture);
            setBotTexture(botTexture);
        });


        return () => {
            setBackgroundTexture(undefined);
            setHeroTexture(undefined);
        };
    }, []);

    
    

    useEffect(() => {
        //Listen for message event from the server
        wsService.onMessage((data) => {
            const snapshot = data as ISnapshot;
            if(snapshot.type !== "snapshot") return;

            const bots: IPlayerSnapshot[] = [];
            snapshot.players.forEach((player) => {
                if(player.id === snapshot.playerId)
                {
                    //write the reference target position for the player
                    heroPosition.current = {x: player.x, y: player.y}
                }else{
                    bots.push(player);
                }
            });

            setBotPositions(bots);
        });
    }, []);

    useTick(() => {

        const direction = heroControlsService.getDirection();
        if(direction)
        {
            // Only pass the input message when the direction is valid
            setInputDetected(true);
            const message : IInputMessage = {
                type: "input",
                seq : seq.current++,
                up : direction === "UP",
                down : direction === "DOWN",
                right : direction === "RIGHT",
                left : direction === "LEFT",
            }
            
            wsService.send(message);
        }else{
            //We need to stop the player from moving.
            if(inputDetected)
            {
                setInputDetected(false);
                const message : IInputMessage = {
                    type: "input",
                    seq : seq.current++,
                    up : false,
                    down : false,
                    right : false,
                    left : false,
                }
                wsService.send(message);
            }
        }

    });

    return(
        <pixiContainer ref={containerRef}>
            <pixiSprite
                texture={backgroundTexture}
                width={canvasSize.width}
                height={canvasSize.height}
                x={0}
                y={0}
            />
            {children}
            <Hero 
                heroRef={heroRef} 
                heroTexture={heroTexture}  
                containerRef={containerRef} 
                canvasSize={canvasSize}
                targetPositionRef={heroPosition}
            />

            {botPositions.map((bot) => (
                <Bot
                    key={bot.id}
                    texture={botTexture}
                    targetPosition= {{x: bot.x, y: bot.y}} 
                />
            ))}
        </pixiContainer>
    )
};