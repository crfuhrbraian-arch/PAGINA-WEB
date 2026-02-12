import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-700 font-sans antialiased">
      {/* Navegación Profesional */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/50">
        <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-chart-line text-white text-lg"></i>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter italic">MONOTRIBUTO<span className="text-indigo-600">PRO</span></span>
          </div>
          
          <div className="hidden md:flex gap-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <a href="#soluciones" className="hover:text-indigo-600 transition-colors">Soluciones</a>
            <a href="#seguridad" className="hover:text-indigo-600 transition-colors">Seguridad</a>
            <a href="#estudios" className="hover:text-indigo-600 transition-colors">Para Estudios</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-2xl hover:bg-black transition-all shadow-xl hover:shadow-indigo-100 active:scale-95">
              Acceso Profesional
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section: Sophisticated & Modern */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        {/* Elementos Decorativos de Fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-50"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 animate-bounce">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
            Actualizado Escalas ARCA 2026
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[0.95]">
            La inteligencia <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-400">
              detrás de tu estudio.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
            Automatiza el seguimiento de categorías, centraliza la facturación y profesionaliza la comunicación con tus clientes en una sola plataforma en la nube.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link to="/login" className="w-full sm:w-auto px-12 py-6 bg-indigo-600 text-white text-lg font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95 group">
              Empezar ahora
              <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
            </Link>
            <div className="flex -space-x-3 items-center ml-4">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden`}>
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
              <p className="pl-6 text-xs font-bold text-slate-400 uppercase tracking-widest">+500 Contadores</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid (Bento Box Style) */}
      <section id="soluciones" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden group">
            <div className="relative z-10 max-w-md">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-2xl">
                <i className="fa-solid fa-cloud-arrow-down"></i>
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">Importación Masiva</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Sube archivos CSV, TXT o Excel descargados de ARCA. Nuestro motor procesa miles de comprobantes en segundos, eliminando la carga manual.
              </p>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full"></div>
            <i className="fa-solid fa-bolt absolute top-12 right-12 text-white/5 text-9xl"></i>
          </div>

          <div className="md:col-span-4 bg-indigo-50 rounded-[48px] p-12 border border-indigo-100 group">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 text-white text-2xl">
              <i className="fa-solid fa-bell"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Alertas de Límite</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Notificaciones inteligentes cuando un cliente se acerca al 90% de su facturación anual. Anticipate a la recategorización.
            </p>
          </div>

          <div className="md:col-span-4 bg-white rounded-[48px] p-12 border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-8 text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <i className="fa-solid fa-share-nodes"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Reportes Públicos</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Genera links únicos para que tus clientes consulten su estado en tiempo real sin necesidad de llamarte por teléfono.
            </p>
          </div>

          <div className="md:col-span-8 bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[48px] p-12 text-white flex flex-col md:flex-row items-center gap-12 overflow-hidden">
            <div className="flex-1">
              <h3 className="text-3xl font-black mb-4 tracking-tight">Notas Técnicas</h3>
              <p className="text-indigo-100 font-medium leading-relaxed">
                Bitácora profesional por cliente. Archiva vencimientos, trámites pendientes y observaciones técnicas de manera organizada.
              </p>
            </div>
            <div className="w-full md:w-64 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 rotate-3 translate-y-8">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="h-2 w-full bg-white/20 rounded mb-2"></div>
              <div className="h-2 w-3/4 bg-white/20 rounded mb-2"></div>
              <div className="h-2 w-1/2 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Métricas de Confianza</h2>
            <p className="text-4xl font-black text-slate-900 tracking-tight">Potenciando el ecosistema contable</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { val: '15M+', label: 'Comprobantes' },
              { val: '24/7', label: 'Disponibilidad' },
              { val: '100%', label: 'Cloud Argentina' },
              { val: 'SSL', label: 'Encriptación' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-5xl font-black text-slate-900 mb-2">{stat.val}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight leading-tight relative z-10">
            ¿Listo para llevar tu estudio <br className="hidden md:block" /> al siguiente nivel?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Link to="/login" className="px-12 py-6 bg-white text-slate-900 text-lg font-black rounded-3xl hover:bg-slate-100 transition-all shadow-2xl active:scale-95">
              Crear cuenta gratis
            </Link>
            <a href="mailto:soporte@monotributopro.com" className="px-12 py-6 bg-slate-800 text-white text-lg font-black rounded-3xl border border-slate-700 hover:bg-slate-700 transition-all">
              Contactar Soporte
            </a>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-chart-line text-white text-xs"></i>
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tighter italic">MONOTRIBUTO<span className="text-indigo-600">PRO</span></span>
          </div>
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            © 2024 • Diseñado para profesionales de ciencias económicas
          </p>

          <div className="flex gap-6 text-slate-300">
            <i className="fa-brands fa-linkedin-in hover:text-indigo-600 transition-colors cursor-pointer text-xl"></i>
            <i className="fa-brands fa-instagram hover:text-indigo-600 transition-colors cursor-pointer text-xl"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;