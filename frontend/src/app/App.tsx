import { RouterProvider } from 'react-router-dom';

import '@app/styles';

import { router } from './router';

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;