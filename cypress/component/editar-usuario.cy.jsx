import React from 'react';
import EditarUsuario from '../../src/pages/EditarUsuario';
import { mount } from '../../cypress/support/component';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/data/contexts/AuthContext';

describe('EditarUsuario - Testes Unitários', () => {
    beforeEach(() => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem(
            'usuario',
            JSON.stringify({
                nome: 'Vanderson',
                email: 'vander@gmail.com',
                telefone: '11999999999',
            })
        );

        mount(
            <MemoryRouter>
                <AuthProvider>
                    <EditarUsuario navigateProp={() => {}}/>
                </AuthProvider>
            </MemoryRouter>
        );
    });

    it('renderiza todos os campos com valores preenchidos', () => {
        cy.get('input[placeholder="Novo Nome"]').should('have.value', 'Vanderson');
        cy.get('input[placeholder="Novo Email"]').should('have.value', 'vander@gmail.com');
        cy.get('input[placeholder="Novo Telefone"]').should('have.value', '11999999999');
        cy.get('input[placeholder="Nova Senha"]').should('have.value', '');
    });

    it('valida campo de nome obrigatório', () => {
        cy.get('input[placeholder="Novo Nome"]').clear();
        cy.get('button[type="submit"]').click();
        cy.contains('O nome é obrigatório').should('exist');
    });

    it('valida email com domínio inválido', () => {
        cy.get('input[placeholder="Novo Email"]').clear().type('teste@dominio.com').blur();
        cy.get('button[type="submit"]').click();
        cy.contains('Aceitamos apenas gmail, hotmail, outlook ou yahoo').should('exist');
    });

    it('valida telefone com menos de 11 dígitos', () => {
        cy.get('input[placeholder="Novo Telefone"]').clear().type('123');
        cy.get('button[type="submit"]').click();
        cy.contains('O telefone deve conter exatamente 11 números').should('exist');
    });

    it('valida senha com menos de 3 números', () => {
        cy.get('input[placeholder="Nova Senha"]').type('abc');
        cy.get('button[type="submit"]').click();
        cy.contains('A senha deve conter pelo menos 3 números').should('exist');
    });

    it('abre o modal de confirmação ao clicar em Deletar Conta', () => {
        cy.contains('Deletar Conta').click();
        cy.contains('Deseja realmente excluir sua conta?').should('exist');
    });

    it('fecha o modal ao clicar em Cancelar', () => {
        cy.contains('Deletar Conta').click();
        cy.contains('Cancelar').click();
        cy.contains('Deseja realmente excluir sua conta?').should('not.exist');
    });
});
