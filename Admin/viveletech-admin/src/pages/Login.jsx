import { useState } from "react";

export default function Login({ setUser }) {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const login = () => {

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;

    if(email===adminEmail && pass===adminPass){
      localStorage.setItem("adminAuthed", "true");
      setUser(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return(
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">VL</div>
          <div>
            <div className="brand-title">Vive Le Tech</div>
            <div className="brand-subtitle">Admin Access</div>
          </div>
        </div>

        <h2 className="login-title">Sign in</h2>
        <p className="login-subtitle">Use the admin credentials to continue.</p>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            placeholder="admin@college.edu"
            onChange={e => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            placeholder="••••••••"
            onChange={e => setPass(e.target.value)}
          />
        </label>

        <button className="button primary" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}
