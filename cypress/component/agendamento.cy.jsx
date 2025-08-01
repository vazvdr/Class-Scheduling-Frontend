/// <reference types="cypress" />
import Agendamento from '../../src/pages/Agendamento';
import { MemoryRouter } from 'react-router-dom';

describe('Página de Agendamento - UI sem API real', () => {
  beforeEach(() => {
    // Stub token
    cy.window().then((win) => {
      cy.stub(win.localStorage, 'getItem')
        .withArgs('token')
        .returns('token-fake');
    });

    // Mantive intercept só pra não quebrar caso o componente tente fazer, mas
    // o teste NÃO vai esperar por eles (sem cy.wait)
    cy.intercept('GET', '**/assuntos', [
      { id: '1', nome: 'Desenvolvimento Frontend', duracao: 60 },
    ]).as('getAssuntos');

    cy.intercept('GET', '**/professores*', [
      { id: '11', nome: 'Carla Frontend' },
    ]).as('getProfessores');

    cy.intercept('GET', '**/disponibilidade*', {
      '2025-08-01': {
        manha: ['08:00', '08:15'],
        tarde: [],
        noite: [],
      },
    }).as('getDisponibilidade');

    cy.intercept('POST', '**/agendamentos', {}).as('criarAgendamento');
  });

  it('deve impedir avanço para etapa 2 sem selecionar um assunto', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/agendamento']}>
        <Agendamento />
      </MemoryRouter>
    );

    // botão Próximo deve estar desabilitado sem seleção de assunto
    cy.contains('Próximo').should('be.disabled');
  });

  it('deve impedir avanço para etapa 3 sem selecionar um professor', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/agendamento']}>
        <Agendamento />
      </MemoryRouter>
    );

    // Clica no assunto para habilitar Próximo
    cy.contains('Desenvolvimento Frontend').click();
    cy.contains('Próximo').click(); // vai para etapa 2

    // Botão Próximo deve estar desabilitado porque não selecionou professor
    cy.contains('Próximo').should('be.disabled');
  });

  it('deve desabilitar botão Finalizar se não selecionar horário', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/agendamento']}>
        <Agendamento />
      </MemoryRouter>
    );

    cy.contains('Finalizar Agendamento').should('be.disabled');
  });
});
