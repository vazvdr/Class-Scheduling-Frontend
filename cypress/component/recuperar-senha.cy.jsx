import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import RecuperarSenha from '../../src/Pages/RecuperarSenha';

describe('Página /recuperar-senha', () => {
  const mountRecuperarSenha = () => {
    mount(
      <MemoryRouter initialEntries={['/recuperar-senha']}>
        <RecuperarSenha />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    cy.clearLocalStorage();
    mountRecuperarSenha();
  });

  it('deve renderizar o título, botão de voltar e o input de email', () => {
    cy.contains('Recuperar Senha').should('exist');
    cy.get('input[placeholder="Digite seu email cadastrado"]').should('exist');
    cy.contains('Voltar').should('exist');
  });

  it('deve exibir erro se domínio for inválido', () => {
    cy.get('input[placeholder="Digite seu email cadastrado"]').type('teste@empresa.com');
    cy.contains('Enviar link de recuperação').click();
    cy.contains('Aceitamos apenas gmail, hotmail, outlook ou yahoo').should('exist');
  });

  it('deve permitir digitar email válido e habilitar envio', () => {
    cy.get('input[placeholder="Digite seu email cadastrado"]').type('teste@gmail.com');
    cy.contains('Enviar link de recuperação').should('not.be.disabled');
  });

  it('deve voltar para a tela de login ao clicar em Voltar', () => {
    cy.get('button').contains('Voltar').click();
    cy.get('input[placeholder="Digite seu email cadastrado"]').should('exist');
  });
});
