function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold text-emerald-400 mb-4">
        Geoportal Aceh
      </h1>
      <p className="text-xl text-slate-300 mb-8">
        Sistem Informasi Geospasial Provinsi Aceh testing 
      </p>
      
      <div className="flex gap-4">
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Masuk (Login)
        </button>
        <button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Daftar
        </button>
      </div>
    </div>
  )
}

export default App