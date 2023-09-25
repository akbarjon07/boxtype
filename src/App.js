import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Home/Home';
import Login from './Login/Login';
import PrivateRouter from './PrivateRouter';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes >
        <Route element={<PrivateRouter/>}>
          <Route path='/' element={<Home/>} exact/>
        </Route>

        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
    </>

    )

  }

  export default App;
