// cypress/support/component.js
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/data/contexts/AuthContext';
import '../../src/index.css';

Cypress.Commands.add('mountWithProviders', (component, route = '/') => {
  return mount(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </MemoryRouter>
  );
});

Cypress.Commands.add('mount', mount);

export { mount };
