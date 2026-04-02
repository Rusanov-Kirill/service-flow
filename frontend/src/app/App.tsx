import { RouterProvider } from 'react-router-dom';

import '@app/styles';

import { useInitAuth } from './hooks/useInitAuth';
import { router } from './router';

const App = () => {
  useInitAuth();

  return <RouterProvider router={router} />;
};

export default App;