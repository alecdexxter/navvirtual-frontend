import { useParams } from 'react-router-dom';
import { useState } from 'react';
import RecorridoVirtual from '../components/RecorridoVirtual';
import StandPanel from '../components/StandPanel';

function Recorrido() {
    const { eventoId } = useParams();
    const [standAbierto, setStandAbierto] = useState(null);

    return (
        <div>
            <RecorridoVirtual eventoId={eventoId} onAbrirStand={setStandAbierto} />
            {standAbierto && (
                <StandPanel standId={standAbierto} onCerrar={() => setStandAbierto(null)} />
            )}
        </div>
    );
}

export default Recorrido;