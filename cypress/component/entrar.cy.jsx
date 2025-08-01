// cypress/component/Entrar.cy.jsx
import Entrar from '../../src/pages/Entrar';

describe('Entrar - Testes Unitários', () => {
  beforeEach(() => {
    cy.mountWithProviders(<Entrar />);
  });

  it('renderiza os campos principais', () => {
    cy.get('input[placeholder="Digite seu email"]').should('exist');
    cy.get('input[placeholder="Digite sua senha"]').should('exist');
    cy.contains('Entrar').should('exist');
  });

  it('valida email com domínio inválido', () => {
    cy.get('input[placeholder="Digite seu email"]').type('teste@dominio.com').blur();
    cy.get('input[placeholder="Digite sua senha"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.contains('Aceitamos apenas emails gmail, hotmail, outlook e yahoo').should('exist');
  });  

  it('valida senha com menos de 3 números', () => {
    cy.get('input[placeholder="Digite seu email"]').type('teste@gmail.com');
    cy.get('input[placeholder="Digite sua senha"]').type('abc');
    cy.get('button[type="submit"]').click();
    cy.contains('A senha deve conter pelo menos 3 números').should('exist');
  });

  it('alterna para cadastro e renderiza novos campos', () => {
    cy.contains('Cadastre-se').click();
    cy.get('input[placeholder="Digite seu nome completo"]').should('exist');
    cy.get('input[placeholder="Digite seu telefone"]').should('exist');
    cy.contains('Cadastrar').should('exist');
  });
});
