import { Routes, Route } from 'react-router-dom';
import LoginPage from './Auth/Login/LoginPage'
import CreatePage from './Auth/CreatePage/CreatePage'
import ItemsList from './components/ItemsList/ItemsList';
import PrivateRoute from './Auth/PrivateRoute';


function App() {
  return (  
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/create' element={<CreatePage/>}/>
      <Route element={<PrivateRoute/>}>
        <Route path='/itemslist' element={<ItemsList/>}/>
      </Route>
      
    </Routes>
  );
}

export default App;