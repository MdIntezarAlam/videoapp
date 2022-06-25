import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './Container/Login'
import Home from './Container/Home'
import { fetchUser, userAccessToken } from './Utils/Fetchuser';

function App() {
  const [user, setUser] = useState()
  const navigate = useNavigate();


  useEffect(() => {
    const accessTocken = userAccessToken();
    if (!accessTocken) {
      navigate("/login", { replace: true })
    }
    else {
      const [userInfo] = fetchUser();
      setUser(userInfo);

    }
  }, [])



  return (
    <Routes>
      <Route path='/*' element={<Home user={user} />} />
      <Route path='/login' element={<Login />} />
    </Routes>

  );
}

export default App;
