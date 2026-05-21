import { useState } from "react";


interface ILoginResponse {
  id: string;
  username: string;
  createdAt: string;
}


interface ILoginProps {
  onLogin: (response: ILoginResponse) => void;
}

export const Login = ({ onLogin }: ILoginProps) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }
    
    setLoading(true);
    setError("")

    //console.log(import.meta.env.VITE_API_URL);

    try{
        const response = await fetch('/login', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username.trim()}),
        })

        if(!response)
        {
            throw new Error("Login Failed");
        }

        const data: ILoginResponse = await response.json();
        onLogin(data);
        
    } 
    catch(err){
        console.log(err)
        setError("Could not connect. Please try again. ")
    } finally{
        setLoading(false);
    }

  };

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

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => { setUsername(e.target.value); setError(""); }}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        autoFocus
        maxLength={20}
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "6px",
          color: "#fff",
          fontSize: "14px",
          padding: "10px 16px",
          width: "240px",
          outline: "none",
        }}
      />

      {error && (
        <p style={{ color: "#e05555", fontSize: "12px", margin: 0 }}>{error}</p>
      )}

      <button
        onClick={handleSubmit}
        style={{
          background: "#222",
          border: "1px solid #444",
          borderRadius: "6px",
          color: "#fff",
          cursor: "pointer",
          fontSize: "14px",
          padding: "10px 32px",
          width: "272px",
        }}
      >
        {loading ? "Connecting..." : "Login"}
      </button>
    </div>
  );
};