'use client';

import { useState } from 'react';
import styles from './index.module.css';
import { redirect } from 'next/navigation';

export default function LoginForm() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login,
            password
        })
    });
    if(res.ok){
        const data = await res.json();
        console.log('Login success:', data);
        redirect('/panel')
    }else {
        const data = await res.json();
        
        console.log("something wrong",data )
    }

  };

  return (
    <div className={`${styles.login_form} p-4 shadow-lg rounded-3 bg-white col-md-6 col-lg-4`}>
      <h3 className="text-center mb-4">Sign In</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Login</label>
          <input
            type="text"
            className="form-control"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary btn-lg">Login</button>
        </div>
      </form>
    </div>
  );
}