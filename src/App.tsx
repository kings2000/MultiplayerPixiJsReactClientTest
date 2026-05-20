import { useEffect, useState } from "react";
import { Experience } from "./components/Experience/Experience";
import { Menu } from "./components/Stages/menu";
import { Login } from "./components/Stages/login";
import { wsService, type  WebSocketStatus} from "./components/Network/WebSocketService";


type GameState = 'login' | 'menu' | 'playing';

const APP = () => {

  const [gameState, setGameState] = useState<GameState>('login');
  const [username, setUsername] = useState("");
  const [userid, setUserId] = useState("");
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>("idle");

  useEffect(() => {

    wsService.onStatusChange((status) => {
      setWsStatus(status);
      
      switch(status)
      {
        case"connected":
          setGameState('playing')
        break;
        case "disconnected":
        case "error":
          setGameState("menu")
        break;
      }
    });

  },[]);

  const handlePlay = () => {
    const ip = `${import.meta.env.VITE_WS_URL}ws?playerId=${userid}`;
    wsService.connect(ip);
  };


  if(gameState == 'login')
  {
    return <Login onLogin={(response) => {
      setUsername(response.username); 
      setUserId(response.id);
      setGameState("menu"); 
    }} />
  }

  if(gameState == "menu")
  {
    return <Menu 
      username={username} 
      onPlay={handlePlay}
      isConnecting={wsStatus === "connecting"}
      hasError={wsStatus === "error"}
      wasDisconneted={wsStatus === "disconnected"}
    />
  }

  const handleDisconnect = () => {
    setGameState("menu");
    setWsStatus("idle");
  };

  return <Experience 
    userid={userid} 
    username={username}
    onDisconnect={handleDisconnect}
  />
  
};

export default APP;