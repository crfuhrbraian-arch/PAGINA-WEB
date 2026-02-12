import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

interface LoginProps {
  onLogin: (user: { email: string; name: string }) => void;
}

type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-password';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const SERVICE_ID = 'service_n4gj4yo';
  const TEMPLATE_ID = 'template_51eoele';
  const PUBLIC_KEY = 'K-gv5LKf12Y7eb4RN';

  const [activeTab, setActiveTab] = useState<AuthView>('login');
  const [isSending, setIsSending] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    setError(null);
  }, [activeTab]);

  const sendWelcomeEmail = async (name: string, email: string) => {
    const professionalMessage = `
==========================================================
          BIENVENIDA A MONOTRIBUTO PRO
          Sistema de Gestión para Contadores
==========================================================

Estimado/a ${name},

Es un placer darle la bienvenida a Monotributo Pro, la solución integral diseñada para optimizar la gestión de su estudio contable.

A partir de este momento, su cuenta profesional está activa.

Atentamente,
Soporte Institucional
Monotributo Pro
__________________________________________________________
    `;

    const templateParams = {
      user_email: email,
      user_name: name,
      verification_code: 'ALTA DE USUARIO EXITOSA',
      message: professionalMessage
    };
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    } catch (e) {
      console.error("Error enviando bienvenida:", e);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('monotributo_registered_users') || '[]');
    const user = users.find((u: any) => u.email.toLowerCase() === loginEmail.toLowerCase());

    if (!user) {
      setError("No existe una cuenta registrada con este correo.");
      return;
    }

    if (user.password !== loginPassword) {
      setError("La contraseña ingresada es incorrecta.");
      return;
    }

    onLogin({ email: user.email, name: user.name });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const users = JSON.parse(localStorage.getItem('monotributo_registered_users') || '[]');
    const exists = users.find((u: any) => u.email.toLowerCase() === regEmail.toLowerCase());
    
    if (exists) {
      setError("Este correo electrónico ya está registrado.");
      return;
    }

    const newUser = { name: regName, email: regEmail.toLowerCase(), password: regPassword };
    users.push(newUser);
    localStorage.setItem('monotributo_registered_users', JSON.stringify(users));
    
    setIsSending(true);
    await sendWelcomeEmail(regName, regEmail.toLowerCase());
    setIsSending(false);

    alert(`✅ Registro exitoso. ¡Bienvenido, ${regName}!`);
    // Auto-login tras el registro satisfactorio
    onLogin({ email: newUser.email, name: newUser.name });
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('monotributo_registered_users') || '[]');
    const user = users.find((u: any) => u.email.toLowerCase() === forgotEmail.toLowerCase());

    if (!user) {
      setError("No encontramos ningún usuario con ese correo.");
      return;
    }

    setIsSending(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        user_email: forgotEmail,
        verification_code: code,
        user_name: user.name,
        message: `CÓDIGO DE SEGURIDAD: ${code}`
      }, PUBLIC_KEY);

      setActiveTab('reset-password');
    } catch (err) {
      setError("Error al enviar el código. Inténtalo de nuevo.");
    } finally {
      setIsSending(false);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode !== generatedCode) {
      setError("El código es incorrecto.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const users = JSON.parse(localStorage.getItem('monotributo_registered_users') || '[]');
    const idx = users.findIndex((u: any) => u.email.toLowerCase() === forgotEmail.toLowerCase());

    if (idx !== -1) {
      users[idx].password = newPassword;
      localStorage.setItem('monotributo_registered_users', JSON.stringify(users));
      alert("🎉 Contraseña actualizada.");
      setActiveTab('login');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">MONOTRIBUTO<span className="text-indigo-600">PRO</span></h1>
        <p className="text-slate-500 font-medium">Panel Administrativo para Contadores</p>
      </div>

      <div className="w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100 relative overflow-hidden transition-all">
        {isSending && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in">
             <i className="fa-solid fa-circle-notch animate-spin text-4xl text-indigo-600 mb-4"></i>
             <p className="font-bold text-xs uppercase tracking-widest text-indigo-900">Procesando...</p>
          </div>
        )}

        {(activeTab === 'login' || activeTab === 'register') && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button onClick={() => setActiveTab('login')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'login' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Ingresar</button>
            <button onClick={() => setActiveTab('register')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'register' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Registrar</button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in zoom-in duration-300">
            <i className="fa-solid fa-circle-exclamation text-red-500 mt-1"></i>
            <p className="text-xs font-bold text-red-700 leading-tight">{error}</p>
          </div>
        )}

        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email</label>
              <input id="login-email" name="email" type="email" autoComplete="username email" placeholder="correo@ejemplo.com" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="login-password" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Contraseña</label>
              <input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95">Iniciar Sesión</button>
            <button type="button" onClick={() => setActiveTab('forgot-password')} className="w-full text-center text-xs text-indigo-600 font-bold hover:underline py-2">¿Olvidaste tu contraseña?</button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <input name="fullname" type="text" autoComplete="name" placeholder="Nombre completo" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={regName} onChange={(e) => setRegName(e.target.value)} />
            <input name="reg-email" type="email" autoComplete="email" placeholder="Correo electrónico" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
            <input name="reg-password" type="password" autoComplete="new-password" placeholder="Contraseña" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
            <input name="reg-confirm-password" type="password" autoComplete="new-password" placeholder="Confirmar contraseña" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} />
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl transition-all">Crear cuenta</button>
          </form>
        )}

        {activeTab === 'forgot-password' && (
          <form onSubmit={handleForgotSubmit} className="space-y-6">
            <button type="button" onClick={() => setActiveTab('login')} className="text-slate-400 hover:text-slate-600 flex items-center gap-2 text-xs font-bold uppercase mb-4 transition-colors">← Volver</button>
            <h2 className="text-2xl font-black text-slate-900">Recuperación</h2>
            <input name="forgot-email" type="email" autoComplete="email" placeholder="Ingresa tu email" required className="w-full px-5 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl outline-none" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
            <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3">
              {isSending ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Enviar código'}
            </button>
          </form>
        )}

        {activeTab === 'reset-password' && (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            <h2 className="text-2xl font-black text-slate-900 text-center">Verificación</h2>
            <input name="verification-code" type="text" placeholder="000000" required maxLength={6} className="w-full p-5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl text-center text-3xl font-mono font-bold text-indigo-700 outline-none" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))} />
            <div className="space-y-3">
              <input name="new-password" type="password" autoComplete="new-password" placeholder="Nueva contraseña" required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <input name="confirm-new-password" type="password" autoComplete="new-password" placeholder="Confirmar contraseña" required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:bg-green-700 transition-all">Restablecer Clave</button>
          </form>
        )}
      </div>
      <p className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Monotributo Pro © 2024</p>
    </div>
  );
};

export default Login;