export default function ProductCard({ producto, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-full bg-white p-6 border border-gray-200 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      {producto.imagenes?.[0] && (
        <img
          className="rounded-xl mb-6 w-full h-48 object-contain"
          src={producto.imagenes[0].url}
          alt={producto.nombre}
        />
      )}
      <div>
        <h5 className="text-xl text-black font-semibold tracking-tight mb-2">
          {producto.nombre}
        </h5>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {producto.descripcion}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-3xl font-extrabold text-black">
            ${producto.variantes?.[0]?.precio?.toLocaleString()}
          </span>
          <button
            type="button"
            className="inline-flex items-center bg-black hover:bg-gray-800 text-white font-medium rounded-xl text-sm px-4 py-2 transition-colors"
          >
            <svg className="w-4 h-4 me-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
            </svg>
            Ver producto
          </button>
        </div>
      </div>
    </div>
  )
}