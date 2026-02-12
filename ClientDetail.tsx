import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { TabType, Client, Invoice, Note } from './types';
import { ARCA_CATEGORIES_2026, CREDIT_NOTE_CODES, INVOICE_TYPES } from './constants';

interface ClientDetailProps {
  userEmail: string;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ userEmail }) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>(TabType.SALES);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'xlsx' | 'txt'>('csv');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const INVOICES_KEY = `monotributo_invoices_${userEmail}_${id}`;
  const NOTES_KEY = `monotributo_notes_${userEmail}_${id}`;

  useEffect(() => {
    const savedClients = JSON.parse(localStorage.getItem(`monotributo_clients_${userEmail}`) || '[]');
    setClient(savedClients.find((c: any) => c.id === id) || null);
    setInvoices(JSON.parse(localStorage.getItem(INVOICES_KEY) || '[]'));
    setNotes(JSON.parse(localStorage.getItem(NOTES_KEY) || '[]'));
  }, [id, userEmail, INVOICES_KEY, NOTES_KEY]);

  useEffect(() => {
    if (id) {
      localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }
  }, [invoices, notes, id, INVOICES_KEY, NOTES_KEY]);

  const salesTotal = useMemo(() => {
    return invoices.filter(i => i.isSale).reduce((acc, inv) => {
      return CREDIT_NOTE_CODES.includes(inv.invoiceType) ? acc - inv.totalAmount : acc + inv.totalAmount;
    }, 0);
  }, [invoices]);

  const cat = ARCA_CATEGORIES_2026.find(c => c.category === client?.category) || ARCA_CATEGORIES_2026[0];
  const percentage = (salesTotal / cat.maxBilling) * 100;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    let imported: Invoice[] = [];
    const isSale = activeTab === TabType.SALES;

    if (selectedFormat === 'xlsx') {
        const data = await file.arrayBuffer();
        const wb = XLSX.read(data);
        const json: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        imported = json.map(row => ({
            id: Math.random().toString(36).substr(2, 9), clientId: id!,
            date: row['Fecha'] || new Date().toISOString().split('T')[0],
            invoiceType: '011', invoiceTypeName: 'Factura C',
            pointOfSale: '0001', number: String(row['Numero'] || '0').padStart(8, '0'),
            description: row['Detalle'] || 'Importación Excel',
            totalAmount: parseFloat(row['Total'] || '0'),
            isSale: isSale, netAmount: 0, taxAmount: 0, month: 1, year: 2025
        }));
    }

    setInvoices([...imported, ...invoices]);
    setShowImportModal(false);
    alert(`${imported.length} registros importados.`);
  };

  if (!client) return <div className="p-20 text-center font-bold text-slate-300 animate-pulse">CARGANDO...</div>;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <Link to="/dashboard" className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-4 inline-block">← Volver al Panel</Link>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">{client.name}</h1>
          <p className="text-slate-500 font-mono mt-2">CUIT: {client.cuit} • Categoría {client.category}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowImportModal(true)} className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">
            <i className="fa-solid fa-file-import mr-2"></i> Importar ARCA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Ventas Totales</p>
          <p className="text-4xl font-black text-slate-900">$ {salesTotal.toLocaleString()}</p>
          <div className="mt-6 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full transition-all ${percentage > 90 ? 'bg-rose-500' : 'bg-indigo-600'}`} style={{width: `${Math.min(percentage, 100)}%`}}></div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{percentage.toFixed(1)}% del límite utilizado</p>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Cuota Mensual</p>
             <p className="text-3xl font-black text-slate-900">$ {cat.monthlyQuota.toLocaleString()}</p>
           </div>
           <i className="fa-solid fa-receipt text-slate-100 text-5xl"></i>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Próxima Recat.</p>
             <p className="text-3xl font-black text-slate-900">Julio 2024</p>
           </div>
           <i className="fa-solid fa-calendar-check text-slate-100 text-5xl"></i>
        </div>
      </div>

      <div className="border-b border-slate-200 flex gap-8">
        {[TabType.SALES, TabType.PURCHASES, TabType.REPORTS, TabType.NOTES].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === t ? 'text-slate-900' : 'text-slate-400'}`}>
            {t} {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-50 min-h-[400px] overflow-hidden">
        {activeTab === TabType.SALES || activeTab === TabType.PURCHASES ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <tr><th className="px-8 py-5">Fecha</th><th className="px-8 py-5">Concepto</th><th className="px-8 py-5">Importe</th><th className="px-8 py-5"></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.filter(i => i.isSale === (activeTab === TabType.SALES)).map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/30">
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{inv.date}</td>
                  <td className="px-8 py-5 text-sm text-slate-800 font-medium">{inv.description}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">$ {inv.totalAmount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => setInvoices(invoices.filter(i => i.id !== inv.id))} className="text-slate-200 hover:text-red-500"><i className="fa-solid fa-trash-can"></i></button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && <tr><td colSpan={4} className="p-32 text-center text-slate-300 font-black uppercase tracking-widest">Sin registros</td></tr>}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center">
            <i className="fa-solid fa-rocket text-slate-100 text-6xl mb-6"></i>
            <h3 className="text-xl font-bold text-slate-800">Módulo en Desarrollo</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">Estamos integrando el generador de PDF para este módulo.</p>
          </div>
        )}
      </div>

      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-12 shadow-2xl animate-in zoom-in duration-300">
             <h3 className="text-2xl font-black mb-10 text-slate-900">Importar Comprobantes</h3>
             <div className="space-y-3 mb-10">
                {['csv', 'xlsx', 'txt'].map(f => (
                  <button key={f} onClick={() => setSelectedFormat(f as any)} className={`w-full p-5 rounded-2xl border-2 font-bold uppercase text-xs tracking-widest flex justify-between items-center ${selectedFormat === f ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-50 text-slate-400'}`}>
                    {f} {selectedFormat === f && <i className="fa-solid fa-check-circle"></i>}
                  </button>
                ))}
             </div>
             <button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black shadow-lg">Seleccionar Archivo</button>
             <button onClick={() => setShowImportModal(false)} className="w-full py-4 text-slate-400 font-bold text-xs uppercase mt-4">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetail;