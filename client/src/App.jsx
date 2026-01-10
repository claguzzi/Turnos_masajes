
import { Home, Landing, Admin, AdminLogin } from './views'
import { Routes, Route } from 'react-router-dom'






function App() {



  return (

    <div className='App'>



      <Routes>

        <Route path='/' element={<Landing />} />

        <Route path='/home' element={<Home />} />

        <Route path='/admin' element={<Admin />} />

        <Route path='/adminLogin' element={<AdminLogin />} />


      </Routes>



    </div>
  )
}

export default App
