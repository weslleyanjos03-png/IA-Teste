const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.ok(scripts.length >= 2, 'Script de dados e interface devem estar presentes');
const context = { module: { exports: {} }, URL };
vm.runInNewContext(scripts[0][1], context, { timeout: 1000 });
const data = context.module.exports;

test('quadro inicia vazio e preserva a chave de armazenamento', () => {
  assert.equal(data.STORAGE_KEY, 'kanban_flow_public_v1');
  assert.deepEqual(Array.from(data.normalizeCards([])), []);
});

test('valida um cartão fictício', () => {
  const out = data.normalizeCards([{ text: 'Tarefa de exemplo', status: 'contato', tag: 'servicos', links: [] }]);
  assert.equal(out.length, 1);
  assert.equal(out[0].text, 'Tarefa de exemplo');
});

test('bloqueia URLs inseguras', () => {
  assert.equal(data.safeUrl('javascript:alert(1)'), null);
  assert.equal(data.safeUrl('data:text/html,test'), null);
  assert.equal(data.safeUrl('https://example.org/'), 'https://example.org/');
});

test('rejeita dados malformados e tarefas acima do limite', () => {
  assert.throws(() => data.normalizeCards({ cards: [] }));
  assert.throws(() => data.normalizeCards([{ text: 'Exemplo', status: 'invalido' }]));
  assert.throws(() => data.normalizeCards(new Array(data.MAX_CARDS + 1)));
});

test('limita anexos e normaliza categoria desconhecida', () => {
  const badLinks = Array.from({ length: data.MAX_LINKS + 1 }, () => ({type:'arquivo',url:'https://example.org/'}));
  assert.throws(() => data.normalizeCards([{ text: 'Exemplo',status:'contato',links:badLinks }]));
  const card = data.normalizeCards([{ text:'Exemplo',status:'entrega',tag:'desconhecida' }])[0];
  assert.equal(card.tag, 'servicos');
});

test('documentação sem links para repositório antigo', () => {
  for (const name of ['README.md','README.en.md','CONTRIBUTING.md','SECURITY.md'])
    assert.ok(!fs.readFileSync(path.join(root,name),'utf8').includes('IA-Teste'), name);
});

test('metadados usam novo site e arte original', () => {
  assert.match(html, /rel="canonical" href="https:\/\/weslleyanjos03-png\.github\.io\/kanban-flow\/"/);
  assert.match(html, /og:image/);
  assert.match(html, /twitter:card" content="summary_large_image"/);
  assert.ok(!html.includes('IA-Teste'));
});

test('scripts da interface compilam', () => {
  assert.doesNotThrow(() => new vm.Script(scripts[1][1]));
});
