import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Client, Invoice } from './types';
import { ARCA_CATEGORIES_2026, CREDIT_NOTE_CODES } from './constants';

const PublicReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const clientKey = allKeys.find(k => k.startsWith('monotributo_clients_'));
    if (clientKey) {
      const clients = JSON.parse(localStorage.getItem(clientKey) || '[]');
      const found = clients.find((c: any) => c.id === id);
      if (found) {
        setClient(found);
        const email = clientKey.replace('monotributo_clients_', '');
        setInvoices(JSON.parse(localStorage.getItem(`monotributo_invoices_${email}_${id}`) || '[]'));
      }
    }
  }, [id]);

  if (!client) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-300 uppercase tracking-widest animate-pulse">Cargando reporte...</div>;

  const total = invoices.reduce((acc, inv) => {
    if (!inv.isSale) return acc;
    return CREDIT_NOTE_CODES.includes(inv.invoiceType) ? acc - inv.totalAmount : acc + inv.totalAmount;
  }, 0);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
        <div className="bg-indigo-600 p-10 text-white text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Estado Fiscal</p>
            <h1 className="text-2xl font-black tracking-tight">{client.name}</h1>
        </div>
        <div className="p-10 space-y-8 text-center">
            <div>
                <p className="text-5xl font-black text-slate-900">$ {total.toLocaleString('es-AR')}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Facturación Anual Acumulada</p>
            </div>
            <div className="pt-8 border-t border-slate-50">
                <button onClick={() => window.print()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all">
                    <i className="fa-solid fa-print"></i>
                    Imprimir Comprobante
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PublicReport;