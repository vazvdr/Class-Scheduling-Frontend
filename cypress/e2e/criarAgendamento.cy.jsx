describe('Fluxo completo de agendamento via interface', () => {
    const usuario = {
        nome: `Teste Agendamento ${Date.now()}`,
        email: `teste_agendamento_${Date.now()}@gmail.com`,
        senha: 'SenhaForte123!',
        telefone: '11999999999',
    };

    let token = '';
    let usuarioLogado = null;

    it('deve cadastrar um novo usuário', () => {
        cy.intercept('POST', '**/usuarios/cadastrar').as('cadastroRequest');

        cy.visit('/entrar');
        cy.contains('Cadastre-se').click();

        cy.get('input[name="nome"]').type(usuario.nome);
        cy.get('input[name="email"]').type(usuario.email);
        cy.get('input[name="senha"]').type(usuario.senha);
        cy.get('input[name="telefone"]').type(usuario.telefone);

        cy.get('button[type="submit"]').contains('Cadastrar').click();

        cy.wait('@cadastroRequest').its('response.statusCode').should('eq', 200);
    });

    it('deve fazer login com o usuário cadastrado', () => {
        cy.intercept('POST', '**/usuarios/login').as('loginRequest');

        cy.visit('/entrar');
        cy.get('input[name="email"]').type(usuario.email);
        cy.get('input[name="senha"]').type(usuario.senha);
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            token = response.body.token;
            usuarioLogado = response.body.usuario;

            // Preenche localStorage para manter sessão
            window.localStorage.setItem('token', token);
            window.localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
        });

        cy.url().should('include', '/');
    });

    it('deve realizar o fluxo completo de agendamento via interface', () => {
        cy.window().then((win) => {
            win.localStorage.setItem('token', token);
            win.localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
        });

        cy.visit('/agendamento');

        cy.contains('Desenvolvimento Frontend', { timeout: 10000 }).click();
        cy.contains('Próximo').click();

        cy.contains('Carla Frontend', { timeout: 10000 }).click();

        cy.intercept('GET', '**/disponibilidade**').as('disponibilidade');
        cy.contains('Próximo').click();

        cy.wait('@disponibilidade', { timeout: 15000 });

        cy.get('div.flex.flex-col.items-center.cursor-pointer')
            .first()
            .should('be.visible')
            .click({ force: true });

        // Esperar 1s pra garantir renderização dos horários após clicar na data
        cy.wait(1000);

        // Clicar no primeiro horário que não tem 'x' (ocupado)
        cy.get('div.text-sm.rounded-md.px-2.py-1.border.text-center.cursor-pointer')
            .filter(':visible')
            .filter((index, el) => !el.innerText.includes('x'))
            .first()
            .click({ force: true });

        // Esperar o botão habilitar
        cy.get('button:contains("Finalizar Agendamento")')
            .should('not.be.disabled')
            .click();

        // Confirmar sucesso
        cy.contains('Agendamento realizado com sucesso', { timeout: 10000 }).should('exist');
    });

    it('deve deletar a conta do usuário logado', () => {
        cy.visit('/entrar');
      
        cy.get('input[name="email"]').type(usuario.email);
        cy.get('input[name="senha"]').type(usuario.senha);
        cy.get('button[type="submit"]').click();
      
        cy.url({ timeout: 10000 }).should('include', '/');
      
        cy.window().its('localStorage.token', { timeout: 5000 }).should('exist');
      
        cy.visit('/EditarUsuario');
      
        cy.contains('Deletar Conta', { timeout: 6000 }).click();
        cy.contains('Deseja realmente excluir sua conta?').should('be.visible');
        cy.contains('Confirmar').click();
      
        cy.contains('Sua conta foi excluída com sucesso', { timeout: 5000 }).should('exist');
      });      
});
