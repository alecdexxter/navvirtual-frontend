import { useParams, Link } from 'react-router-dom';   // agregá Link al import
import { useState } from 'react';
import RecorridoVirtual from '../components/RecorridoVirtual';
import StandPanel from '../components/StandPanel';

function Recorrido() {
    const { eventoId } = useParams();
    const [standAbierto, setStandAbierto] = useState(null);

    return (
        <div>
            <Link to={`/tienda/${eventoId}`} style={{ display: 'block', margin: '8px 0' }}>
                🛍️ Ir a la tienda
            </Link>

            <RecorridoVirtual eventoId={eventoId} onAbrirStand={setStandAbierto} />
            {standAbierto && (
                <StandPanel standId={standAbierto} onCerrar={() => setStandAbierto(null)} />
            )}
        </div>
    );
}

export default Recorrido;