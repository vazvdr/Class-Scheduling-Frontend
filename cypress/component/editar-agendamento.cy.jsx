/// <reference types="cypress" />
import EditarAgendamento from '../../src/pages/EditarAgendamento';
import { MemoryRouter } from 'react-router-dom';

describe('Página de Agendamento - UI sem API real', () => {
  beforeEach(() => {
    // Stub token
    cy.window().then((win) => {
      cy.stub(win.localStorage, 'getItem')
        .withArgs('token')
        .returns('token-fake');
    });

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
        <EditarAgendamento />
      </MemoryRouter>
    );

    cy.contains('Próximo').should('be.disabled');
  });

  it('deve impedir avanço para etapa 3 sem selecionar um professor', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/agendamento']}>
        <EditarAgendamento />
      </MemoryRouter>
    );

    cy.contains('Desenvolvimento Frontend').click();
    cy.contains('Próximo').click(); 

    cy.contains('Próximo').should('be.disabled');
  });

  it('deve desabilitar botão Finalizar se não selecionar horário', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/agendamento']}>
        <EditarAgendamento />
      </MemoryRouter>
    );

    cy.contains('Atualizar Agendamento').should('be.disabled');
  });
});
