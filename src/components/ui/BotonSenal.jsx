function BotonSenal({ children, ...props }) {
    return (
        <button
            {...props}
            className="bg-senal hover:bg-senal-hover text-tinta font-display font-medium px-5 py-2.5 rounded-full transition-colors disabled:opacity-50"
        >
            {children}
        </button>
    );
}

export default BotonSenal;