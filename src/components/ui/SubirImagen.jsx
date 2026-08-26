import { useState } from 'react';
import axiosClient from '../../api/axiosClient';

function SubirImagen({ valorActual, onSubido, etiqueta = 'Imagen' }) {
    const [subiendo, setSubiendo] = useState(false);
    const [preview, setPreview] = useState(valorActual || null);

    const handleFile = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        setPreview(URL.createObjectURL(archivo));
        setSubiendo(true);

        const formData = new FormData();
        formData.append('archivo', archivo);

        try {
            const { data } = await axiosClient.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onSubido(data.url);
        } catch (err) {
            alert('Error al subir la imagen');
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div>
            <label className="block text-xs font-mono text-tinta/60 mb-2">{etiqueta}</label>
            {preview && (
                /\.(mp4|webm|mov)$/i.test(preview) || preview.startsWith('blob:') === false && /\.(mp4|webm|mov)$/i.test(valorActual || '') ? (
                    <video src={preview} controls className="w-full aspect-video rounded-xl mb-2 bg-superficie" />
                ) : (
                    <img src={preview} alt="preview" className="w-full aspect-video object-cover rounded-xl mb-2 bg-superficie" />
                )
            )}
            <input type="file" accept="image/*,video/*" onChange={handleFile} disabled={subiendo} className="text-sm" />
            {subiendo && <p className="text-xs text-senal mt-1">Subiendo...</p>}
        </div>
    );
}

export default SubirImagen;