import { useState, useEffect } from 'react'
import Header from './components/Header'
import Filtros from './components/Filtros'
import ListadoGastos from './components/ListadoGastos'
import Modal from './components/Modal'
import { generarId } from './helpers'
import IconoNuevoGasto from './img/nuevo-gasto.svg'


function App() {
  // Guardar los gastos en un array
  const[gastos,setGastos] = useState(
     localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
    )
  // En componente ControlPresupuesto se pasa
  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  )
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)
  // Animación del modal
  const [modal, setModal] = useState(false)
  const [animarModal, setAnimarModal] = useState(false)
  // Gasto editar pasa a ListadoGasto luego a Gasto
  const [gastoEditar, setGastoEditar] = useState({})
  // Filtro
  const [filtro, setFiltro] = useState('')
  const [gastosFiltrados, setGastosFiltrados] = useState([])
  useEffect(()=>{
    if(Object.keys(gastoEditar).length > 0 ){
        setModal(true)
        setTimeout(()=>{
          setAnimarModal(true)
        }, 500)
    }
  }, [gastoEditar])

  // Guardando en LocalStorage presupuesto
  useEffect(()=>{
    localStorage.setItem( 'presupuesto', presupuesto ?? 0 )
  }, [presupuesto])
  // Guardando en LocalStorage gastos
  useEffect(()=>{
    localStorage.setItem( 'gastos',JSON.stringify(gastos) ?? [] )
  },[gastos])
  // Filtrar
  useEffect(()=>{
    if(filtro){
      // Filtrar gastos, por categoria
      const gastosFiltrados = gastos.filter(gastos => gastos.categoria === filtro)
      setGastosFiltrados(gastosFiltrados)

    }
  },[filtro])
  // Se ejecuta unavez cuando carga la aplicación
  useEffect(()=>{
    const presupuestoLS = Number(localStorage.getItem('presupuesto') ?? 0 )
    if( presupuestoLS > 0 ){
      setIsValidPresupuesto(true)
    }
  }, [])
  
  const handleNuevoGasto = ()=>{
    setModal(true)
    setGastoEditar({})
    console.log('diste click en nuevo gasto')
    setTimeout(()=>{
      setAnimarModal(true)
    },500)
  }
  // Guardar gasto desde el Modal hacia aquí
  const guardarGasto = gasto =>{
    if(gasto.id){
      // Actualizar gasto
      const gastoActualizados = gastos.map( gastoState => gastoState.id === gasto.id ? gasto : gastoState)
      setGastos(gastoActualizados)
      setGastoEditar({}) // resetear el state para que este vació
    } else {
      // Crear Nuevo Gasto
      gasto.id = generarId();
      gasto.fecha = Date.now();
      setGastos([ ...gastos, gasto ]);
    }
    setAnimarModal(false);
    setTimeout( () => {
        setModal(false);
    }, 500);
  }
  // Función eliminar gasto va a pasar a ListadoGastos luego a Gasto
  const eliminarGasto = id =>{
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id)
    setGastos(gastosActualizados)
  }

  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        // Gastos se pasa de el Header al componente ControlPresupuesto
        gastos={gastos} 
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />
    
    {isValidPresupuesto && 
      <>
        <main>
          <Filtros 
            filtro={filtro}
            setFiltro={setFiltro}
          />
          <ListadoGastos 
            gastos={gastos}
            setGastoEditar={setGastoEditar}
            eliminarGasto={eliminarGasto}
            filtro={filtro}
            gastosFiltrados={gastosFiltrados}
          />
        </main>
        <div className="nuevo-gasto">
          <img 
            src={IconoNuevoGasto} 
            alt="icono nuevo gasto" 
            onClick={handleNuevoGasto}
          />
        </div>
      </>
    }
    {modal && <Modal 
                setModal={setModal}
                animarModal={animarModal}
                setAnimarModal={setAnimarModal}
                guardarGasto={guardarGasto} // función a heredar
                gastoEditar={gastoEditar}
                setGastoEditar={setGastoEditar} // para resetear el state

              />}
    </div>
  )
}

export default App
