interface IMenuProps {
  username: string;
  isConnecting: boolean;
  hasError : boolean;
  onPlay: () => void;
  wasDisconneted : boolean;
}

export const Menu = ({username, onPlay, isConnecting, hasError, wasDisconneted}: IMenuProps) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#111",
      fontFamily: "sans-serif",
      gap: "12px",
    }}>
      <h1 style={{ color: "#fff", fontSize: "28px", margin: "0 0 24px" }}>Test Game</h1>
      <h3 style={{ color:"#fff", margin: "0 0 0"}}> Welcome {username}</h3>
      {wasDisconneted && (
        <p style={{ color: "#e0a955", fontSize: "12px", margin: 0 }}>
          You were disconnected. Reconnecting...
        </p>
      )}
      {hasError &&(
        <p style={{ color: "#e05555", fontSize: "12px", margin: 0 }}>
          Could not connect. Please try again.
        </p>
      )}
      <button
        onClick={onPlay}
        disabled={isConnecting}
        style={{
          background: "#222",
          border: "1px solid #444",
          borderRadius: "6px",
          color: "#fff",
          cursor: "pointer",
          fontSize: "14px",
          padding: "10px 32px",
          width: "240px",
        }}
      >
        {isConnecting ? "Connecting..." : "Play"}
      </button>
    </div>
  );
};