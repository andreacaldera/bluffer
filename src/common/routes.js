import App from './components/App';
import Home from './components/Home';
import Proxies from './components/Proxies';
import About from './components/About';
import NotFound from './components/NotFound';

const routes = [
  {
    component: App,
    routes: [
      { path: '/', exact: true, component: Home },
      { path: '/proxy/:selectedProxyId', exact: true, component: Proxies },
      { path: '/about', component: About },
      { path: '/*', component: NotFound },
    ],
  },
]; // TODO error page

export default routes;
