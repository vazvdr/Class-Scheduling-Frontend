describe('Fluxo completo do usuário: Cadastro, Login, Atualização e Exclusão', () => {
    const novoUsuario = {
      nome: 'Vanderson Teste',
      email: `vanderson_${Date.now()}@gmail.com`,
      senha: 'Teste123!',
      telefone: '11999999999',
    };
  
    let token = '';
  
    it('deve cadastrar um novo usuário', () => {
      cy.visit('/entrar');
      cy.contains('Cadastre-se').click();
  
      cy.get('input[name="nome"]').type(novoUsuario.nome);
      cy.get('input[name="email"]').type(novoUsuario.email);
      cy.get('input[name="senha"]').type(novoUsuario.senha);
      cy.get('input[name="telefone"]').type(novoUsuario.telefone);
  
      cy.get('button[type="submit"]').contains('Cadastrar').click();
      cy.contains('Cadastro realizado com sucesso').should('exist');
    });
  
    it('deve fazer login com o usuário cadastrado e salvar token', () => {
      cy.visit('/entrar');
      cy.get('input[name="email"]').type(novoUsuario.email);
      cy.get('input[name="senha"]').type(novoUsuario.senha);
  
      cy.intercept('POST', '**/usuarios/login').as('loginRequest');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        token = response.body.token;
  
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('usuario', JSON.stringify(response.body.usuario));
      });
  
      cy.url().should('include', '/');
    });
  
    it('deve atualizar os dados do usuário logado', () => {
      // Preenche o localStorage antes de visitar rota protegida
      cy.window().then((win) => {
        win.localStorage.setItem('token', token);
        win.localStorage.setItem('usuario', JSON.stringify({
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          telefone: novoUsuario.telefone,
        }));
      });
  
      cy.visit('/EditarUsuario');
  
      cy.get('input[placeholder="Novo Nome"]').clear().type('Vanderson Atualizado');
      cy.get('input[placeholder="Novo Email"]').clear().type(`atualizado_${novoUsuario.email}`);
      cy.get('input[placeholder="Novo Telefone"]').clear().type('11988887777');
      cy.get('input[placeholder="Nova Senha"]').clear().type('NovaSenha123!');
  
      cy.contains('Atualizar').click();
      cy.contains('dados foram atualizados com sucesso').should('exist');
  
      // Atualiza credenciais para próximo teste
      novoUsuario.email = `atualizado_${novoUsuario.email}`;
      novoUsuario.senha = 'NovaSenha123!';
    });
  
    //Deleta a conta do usuário para não encher o banco com usuários fictícios
    it('deve deletar a conta do usuário logado', () => {
      cy.visit('/entrar');
    
      cy.get('input[name="email"]').type(novoUsuario.email);
      cy.get('input[name="senha"]').type(novoUsuario.senha);
      cy.get('button[type="submit"]').click();
    
      // Aguarda redirecionamento para a home
      cy.url({ timeout: 10000 }).should('include', '/');
    
      // Aguarda até o token estar no localStorage
      cy.window().its('localStorage.token', { timeout: 5000 }).should('exist');
    
      cy.visit('/EditarUsuario');
    
      cy.contains('Deletar Conta', { timeout: 6000 }).click();
      cy.contains('Deseja realmente excluir sua conta?').should('be.visible');
      cy.contains('Confirmar').click();
    
      cy.contains('Sua conta foi excluída com sucesso', { timeout: 5000 }).should('exist');
    });    
  });