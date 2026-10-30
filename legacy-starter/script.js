/* script.js – Simulador de compras da Minha Loja
   • Pergunta quantas unidades de cada produto o usuário deseja.
   • Calcula valores, aplica 10 % de desconto para subtotal ≥ R$ 500.
   • Exibe resultados via alert().
*/

function simularCompra() {
  const produtos = Array.from(document.querySelectorAll('.product'));
  let detalhes = '';
  let total = 0;

  // Pergunta a quantidade para cada produto
  for (const p of produtos) {
    const nome = p.querySelector('h2').textContent.trim();
    const preco = Number(p.dataset.price); // preço em número (ex.: 29.90)

    let qtd = prompt(`Quantidade desejada de "${nome}" (Preço: R$ ${preco.toFixed(2)}):`, '0');
    if (qtd === null) qtd = '0'; // caso o usuário cancele

    const quantidade = Number(qtd);
    if (isNaN(quantidade) || quantidade < 0) {
      alert('Entrada inválida. Será considerada 0.');
    }

    const subtotal = preco * quantidade;
    total += subtotal;

    if (quantidade > 0) {
      detalhes += `${nome}: ${quantidade} × R$ ${preco.toFixed(2)} = R$ ${subtotal.toFixed(2)}\n`;
    }
  }

  // Nenhum produto selecionado?
  if (total === 0) {
    alert('Nenhum produto foi selecionado.');
    return;
  }

  // Aplica desconto de 10 % se total >= 500
  let desconto = 0;
  if (total >= 500) {
    desconto = total * 0.10;
  }
  const totalComDesconto = total - desconto;

  // Monta mensagem final
  let mensagem = 'Resumo da compra:\n\n';
  mensagem += detalhes + '\n';
  mensagem += `Subtotal: R$ ${total.toFixed(2)}\n`;
  if (desconto > 0) {
    mensagem += `Desconto (10 %): -R$ ${desconto.toFixed(2)}\n`;
  }
  mensagem += `Total a pagar: R$ ${totalComDesconto.toFixed(2)}`;

  alert(mensagem);
}
