# Política de segurança — Kanban Flow

## Como o sistema armazena informações

O Kanban Flow é um aplicativo estático, sem backend ou autenticação. As tarefas são armazenadas no **`localStorage` do navegador** e não são sincronizadas entre dispositivos.

- O conteúdo do `localStorage` **não é criptografado** pelo aplicativo.
- Backups exportados em JSON **não são criptografados**.
- Limpar os dados do navegador pode remover as tarefas gravadas localmente.
- Evite inserir credenciais, documentos confidenciais ou dados sensíveis, principalmente em dispositivos compartilhados.
- O compartilhamento com WhatsApp depende de uma ação explícita do usuário e encaminha o texto escolhido a um serviço externo.

## Como relatar uma vulnerabilidade

Se o repositório mostrar a opção **Security → Report a vulnerability**, use esse canal privado.

Se a opção não estiver disponível, crie uma [issue](https://github.com/weslleyanjos03-png/kanban-flow/issues) **sem detalhes de exploração ou dados pessoais**, solicitando um canal privado de contato.

Ao relatar, forneça uma descrição concisa, ambiente em que ocorreu e impacto potencial. Não publique tokens, senhas, bases de clientes nem backups.

O projeto não assume prazo garantido de resposta ou correção.
