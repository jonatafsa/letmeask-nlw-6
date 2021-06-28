//Importação das páginas
import { NewRoom } from "./pages/NewRoom";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";

//Importação do contexto de autenticação
import { AuthContextProvider } from './contexts/AuthContext'

//Importação da lógica das rotas
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AdminRoom } from "./pages/AdminRoom";


function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" exact component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
          <Route path="/admin/rooms/:id" component={AdminRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
