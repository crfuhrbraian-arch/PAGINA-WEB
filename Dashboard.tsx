import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Client } from './types';

interface DashboardProps {
  userEmail: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userEmail }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const STORAGE_KEY = `monotributo_clients_${userEmail}`;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setClients(JSON.parse(saved));
  }, [STORAGE_KEY]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients, STORAGE_KEY]);

  const [formData, setFormData] = useState({ name: '', cuit: '', category: 'A', phone: '', email: '' });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.cuit.includes(searchTerm)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...formData } : c));
    } else {
      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        nextRenewal: '2024-07'
      };
      setClients([...clients, newClient]);
    }
    setIsModalOpen(false);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({ name: client.name, cuit: client.cuit, category: client.category, phone: client.phone || '', email: client.email || '' });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente? Se perderán todos sus datos.")) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Panel General</h1>
          <p className="text-slate-500 font-medium">Gestión administrativa de clientes</p>
        </div>
        <button 
          onClick={() => { setEditingClient(null); setFormData({name:'', cuit:'', category:'A', phone:'', email:''}); setIsModalOpen(true); }}
          className="bg-[#1a365d] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#122645] transition-all flex items-center gap-2 shadow-xl active:scale-95"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          Agregar cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Clientes Activos</p>
            <p className="text-4xl font-black text-slate-900 mt-1">{clients.length}</p>
          </div>
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl"><i className="fa-solid fa-users"></i></div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Próxima Recat.</p>
            <p className="text-4xl font-black text-slate-900 mt-1">Julio</p>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl"><i className="fa-solid fa-calendar-check"></i></div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Alertas Pendientes</p>
            <p className="text-4xl font-black text-slate-900 mt-1">0</p>
          </div>
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-xl"><i className="fa-solid fa-bell"></i></div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">Listado de Clientes</h2>
            <div className="relative w-full md:w-80">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input type="text" placeholder="Buscar por nombre o CUIT..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-4">Nombre</th>
              <th className="px-8 py-4">CUIT</th>
              <th className="px-8 py-4">Categoría</th>
              <th className="px-8 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredClients.map(client => (
              <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6 font-bold text-slate-700">{client.name}</td>
                <td className="px-8 py-6 font-mono text-sm text-slate-400">{client.cuit}</td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase border border-indigo-100">Cat. {client.category}</span>
                </td>
                <td className="px-8 py-6 flex items-center gap-3">
                  <Link to={`/client/${client.id}`} className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all">Gestionar</Link>
                  <button onClick={() => openEdit(client)} className="p-2 text-indigo-400 hover:text-indigo-600 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                  <button onClick={() => handleDelete(client.id)} className="p-2 text-red-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={4} className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest">No hay clientes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black mb-8 text-slate-900">{editingClient ? 'Editar' : 'Nuevo'} Cliente</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input required placeholder="Nombre Completo" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="CUIT" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-mono focus:ring-2 focus:ring-indigo-500/20" value={formData.cuit} onChange={e => setFormData({...formData, cuit: e.target.value})} />
              <select className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {['A','B','C','D','E','F','G','H','I','J','K'].map(c => <option key={c} value={c}>Categoría {c}</option>)}
              </select>
              <button className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Guardar Datos</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-2 text-slate-400 font-bold text-sm uppercase tracking-widest">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;