import { useState } from "react";

export default function Login({ setUser }) {

  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");

  const login = ()=>{

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;

    if(email===adminEmail && pass===adminPass){
      setUser(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return(
    <div style={{textAlign:"center",marginTop:100}}>

      <h2>Admin Login</h2>

      <input
        placeholder="Email"
        onChange={e=>setEmail(e.target.value)}
      /><br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={e=>setPass(e.target.value)}
      /><br/><br/>

      <button onClick={login}>
        Login
      </button>

    </div>
  );
}
