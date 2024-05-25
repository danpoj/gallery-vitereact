import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
<RouterProvider router={createBrowserRouter([
  {
    path: '/',
    element: <App/>
  }
])}/>);
