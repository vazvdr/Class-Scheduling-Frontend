import Home from '../../src/Pages/Home';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mount } from 'cypress/react';

describe('Home Component', () => {
  const mountHome = () => {
    mount(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agendamento" element={<div data-testid="agendamento-page">Página de Agendamento</div>} />
          <Route path="/entrar" element={<div data-testid="login-page">Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('deve renderizar corretamente os elementos principais', () => {
    mountHome();
    cy.contains('Seja bem vindo à').should('exist');
    cy.contains('Class Scheduling').should('exist');
    cy.contains('A escola mais foda da internet 💥').should('exist');
    cy.contains('Agende sua Aula').should('exist');
  });

  it('deve redirecionar para /entrar quando não há token', () => {
    mountHome();
    cy.contains('Agende sua Aula').click();
    cy.get('[data-testid="login-page"]').should('exist');
  });

  it('deve redirecionar para /agendamento quando há token válido', () => {
    // Gera um token falso com nome e sub (email)
    const fakeToken = btoa(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' })
    ) + '.' +
    btoa(
      JSON.stringify({ nome: 'Vanderson', sub: 'teste@email.com' }) 
    ) + '.assinaturaFake';

    localStorage.setItem('token', fakeToken);

    mountHome();
    cy.contains('Agende sua Aula').click();
    cy.get('[data-testid="agendamento-page"]').should('exist');
  });
});
