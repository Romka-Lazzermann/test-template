'use client'
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Call backend auth here
        router.push('/panel');
    };
    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="w-50">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input name="login" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input name="password" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}