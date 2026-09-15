import { Plus } from 'lucide-react';
import { useData } from '../../hooks/use-data';
import type { Client } from '../../types/api';
import { initial } from '../../utils/format';
import { Empty } from '../ui/Empty';

export function Clients() {
    const { data, error } = useData<Client>('/api/clients');

    return (
        <section className="panel page-panel">
            <div className="panel-title">
                <div>
                    <p className="eyebrow">RELACIONAMENTO</p>
                    <h2>Base de clientes</h2>
                </div>
                <button className="button primary">
                    <Plus size={18} />Novo cliente
                </button>
            </div>
            {error ?
                <Empty text={error} /> :
                <div className="table">
                    {data.length ?
                        data.map((client) =>
                            <div className="client-row" key={client.id}>
                                <div className="avatar">
                                    {initial(client.name)}
                                </div>
                                <b>{client.name}</b>
                                <span>{client.phone}</span>
                                <span>{client.email || 'Sem e-mail'}</span>
                                <span>{client.loyaltyPoints} pontos</span></div>
                        ) :
                        <Empty text="Nenhum cliente cadastrado." />
                    }
                </div>
            }
        </section>
    );
}
