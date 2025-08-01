/// <reference types="cypress" />
import RedefinirSenha from "../../src/pages/RedefinirSenha";
import { mount } from "cypress/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("RedefinirSenha - Testes Unitários", () => {
  const mountComponent = (token = "mock-token") => {
    window.localStorage.clear();
    mount(
      <MemoryRouter initialEntries={[`/redefinir-senha?token=${token}`]}>
        <Routes>
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renderiza campos e botão", () => {
    mountComponent();
    cy.get('input[type="password"]').should("have.length", 2);
    cy.contains("Redefinir Senha").should("exist");
  });

  it("exibe alerta de erro se senhas forem diferentes", () => {
    mountComponent();
    cy.get('input[name="novaSenha"]').type("senha123");
    cy.get('input[name="confirmarSenha"]').type("senha456");
    cy.get('button[type="submit"]').click();
    cy.contains("As senhas não coincidem.").should("exist");
  });

  it("exibe erro se token estiver ausente", () => {
    mount(
      <MemoryRouter initialEntries={["/redefinir-senha"]}>
        <Routes>
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Token inválido ou ausente").should("exist");
  });

  it("submete corretamente quando senhas coincidem e token está presente", () => {
    const mockRedefinirSenha = cy.stub().resolves();
  
    cy.window().then((win) => {
      win.__mockRedefinirSenha__ = mockRedefinirSenha;
    });
  
    cy.then(() => {
      mount(
        <MemoryRouter initialEntries={["/redefinir-senha?token=abc123"]}>
          <Routes>
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          </Routes>
        </MemoryRouter>
      );
    });
  
    cy.get('input[name="novaSenha"]').type("senha123");
    cy.get('input[name="confirmarSenha"]').type("senha123");
    cy.get('button[type="submit"]').click();
  
    cy.window().then((win) => {
      cy.wrap(win.__mockRedefinirSenha__).should("have.been.calledWith", {
        token: "abc123",
        novaSenha: "senha123",
      });
    });
  
    cy.contains("Senha atualizada com sucesso ✅").should("exist");
  });  
});
