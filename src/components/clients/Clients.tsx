import { useState } from 'react';
import { Mail, Phone, Plus, Star } from 'lucide-react';
import { useData } from '../../hooks/use-data';
import type { Client } from '../../types/api';
import { initial } from '../../utils/format';
import { Empty } from '../ui/Empty';
import { ClientForm } from './ClientForm';

export function Clients() {
    const [showForm, setShowForm] = useState(false);
    const { data, error, reload } = useData<Client>('/api/clients');

    return (
        <section className="panel page-panel">
            <div className="panel-title">
                <div>
                    <div className="tag">
                        <i />
                        <span className="mono">03 · DIRETÓRIO & FIDELIDADE</span>
                    </div>
                    <h2>Base de Clientes</h2>
                </div>
                <button className="btn primary" onClick={() => setShowForm(true)}>
                    <Plus size={16} /> Novo cliente
                </button>
            </div>

            {error ? (
                <Empty text={error} />
            ) : (
                <div className="caustic-rows-list">
                    {data.length ? (
                        data.map((client) => (
                            <div className="client-row" key={client.id}>
                                <span className="ind" aria-hidden="true" />
                                <div className="avatar">
                                    {initial(client.name)}
                                </div>
                                <div className="client-main-info">
                                    <b className="client-name">{client.name}</b>
                                    <span className="client-meta-mobile mono">
                                        {client.phone}
                                    </span>
                                </div>
                                <span className="client-contact mono">
                                    <Phone size={12} className="meta-icon" />
                                    {client.phone}
                                </span>
                                <span className="client-contact mono">
                                    <Mail size={12} className="meta-icon" />
                                    {client.email || 'Sem e-mail'}
                                </span>
                                <div className="loyalty-badge mono">
                                    <Star size={11} className="star-icon" />
                                    <span>{client.loyaltyPoints} PTS</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Empty text="Nenhum cliente cadastrado no momento." />
                    )}
                </div>
            )}

            {showForm && <ClientForm onClose={() => setShowForm(false)} onCreated={reload} />}
        </section>
    );
}
