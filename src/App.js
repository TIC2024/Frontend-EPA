import {Route, Routes} from 'react-router-dom'
import Login from './Components/Layouts/Login/Login';
import { Home } from './Components/Pages/Home/Home';
import { Registros } from './Components/Pages/Registros/Registros';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/register" element={<Registros/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
