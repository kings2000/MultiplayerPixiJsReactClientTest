import { Application } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { calculateCanvasSize } from "../../helpers/commons";
import { MainContainer } from "./MainContainer/MainContainer";
import { wsService } from "../Network/WebSocketService";

interface IExperienceProps
{
    username: string,
    userid: string,
    onDisconnect: () => void;
}

export const Experience = ({userid, onDisconnect} : IExperienceProps) => {

    const [canvasSzie, setCanvasSize] = useState(calculateCanvasSize);

    const updateCanvasSize = useCallback(() => {
        setCanvasSize(calculateCanvasSize())
    }, [])

    useEffect(() => {
        window.addEventListener('resize', updateCanvasSize)
        return () => window.removeEventListener('resize', updateCanvasSize)
    }, [updateCanvasSize])

    const handleDisconnect = () => {
        wsService.disconnect();
        onDisconnect();
    };

    return (
        <div style={{position: "relative"}}>
            <Application width ={canvasSzie.width} height={canvasSzie.height}>
            <MainContainer canvasSize={canvasSzie} userid={userid}>
            </MainContainer>
        </Application>

        <div style={{
            position: "absolute",
            top: "16px",
            right: "16px",
        }}>
            <button
                onClick={handleDisconnect}
                style={{
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "6px",
                    color: "#e05555",
                    cursor: "pointer",
                    fontSize: "13px",
                    padding: "8px 16px"
                }}
            >
                Disconnect
            </button>
        </div>

        </div>
    );
};

