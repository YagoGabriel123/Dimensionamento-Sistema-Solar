function calcularSistema() {
    const nomeCliente = document.getElementById('nomeCliente').value;
    const contato = document.getElementById('contato').value;
    const endereco = document.getElementById('endereco').value;
    const tipoLigacao = document.getElementById('tipoLigacao').value;
    const consumoMensal = parseFloat(document.getElementById('consumoMensal').value);
    const potenciaPainel = document.getElementById('potenciaPainel').value;

    let marcaPainel, potenciaNominal, correnteMaximaPainel, correnteCurtoCircuito, tensaoCircuitoAberto;

    if (potenciaPainel === "610") {
        marcaPainel = "DAH";
        potenciaNominal = 610;
        correnteMaximaPainel = 13.68;
        correnteCurtoCircuito = 14.72;
        tensaoCircuitoAberto = 52.4;
    } else if (potenciaPainel === "555") {
        marcaPainel = "ZNShine Solar";
        potenciaNominal = 555;
        correnteMaximaPainel = 14.5;
        correnteCurtoCircuito = 15.35;
        tensaoCircuitoAberto = 46.2;
    } else if (potenciaPainel === "570") {
        marcaPainel = "PULLING";
        potenciaNominal = 570;
        correnteMaximaPainel = 14.28;
        correnteCurtoCircuito = 15.12;
        tensaoCircuitoAberto = 47.82;
    }

    if (consumoMensal <= 0) {
        document.getElementById('resultado').innerHTML = '<p class="error">Por favor, insira valores válidos.</p>';
        return;
    }

    const hsp = 5.67;
    const diasPorMes = 30;
    const eficiencia = 0.80;
    const consumoDiario = consumoMensal / diasPorMes;
    const energiaPorPainel = (potenciaNominal * hsp * eficiencia) / 1000;
    const numPaineis = Math.ceil(consumoDiario / energiaPorPainel);
    const potenciaTotalSistema = numPaineis * potenciaNominal;
    const potenciaInversorIdeal = Math.ceil(potenciaTotalSistema / 1000);

    document.getElementById('resultado').innerHTML = `
        <div class="orcamento">
            <h2>Orçamento</h2>
            <p><strong>Nome do Cliente:</strong> ${nomeCliente}</p>
            <p><strong>Contato:</strong> ${contato}</p>
            <p><strong>Endereço:</strong> ${endereco}</p>
            <p><strong>Tipo de Ligação:</strong> ${tipoLigacao}</p>
            <p><strong>Marca do Painel:</strong> ${marcaPainel}</p>
            <p><strong>Consumo Médio Mensal:</strong> ${consumoMensal} kWh</p>
            <p><strong>Painéis Necessários:</strong> ${numPaineis}</p>
            <p><strong>Potência Total do Sistema:</strong> ${potenciaTotalSistema} W</p>
            <p><strong>Potência do Inversor Ideal:</strong> ${potenciaInversorIdeal} kW</p>
        </div>
    `;
    document.getElementById('btnSalvarPDF').style.display = 'block';
}

function salvarPDF() {
    const resultado = document.getElementById('resultado').innerHTML;
    const pdfWindow = window.open('', '', 'width=800,height=600');
    pdfWindow.document.write('<html><head><title>Orçamento - Dimensionamento Solar</title></head><body>');
    pdfWindow.document.write(resultado);
    pdfWindow.document.write('</body></html>');
    pdfWindow.document.close();
    pdfWindow.print();
}

let calculo = '';
function adicionarNumero(numero) {
    calculo += numero;
    document.getElementById('inputCalc').value = calculo;
}

function realizarOperacao(op) {
    calculo += op;
    document.getElementById('inputCalc').value = calculo;
}

function limpar() {
    calculo = '';
    document.getElementById('inputCalc').value = '0';
}

function calcularResultado() {
    try {
        calculo = eval(calculo);
        document.getElementById('inputCalc').value = calculo;
    } catch (error) {
        document.getElementById('inputCalc').value = 'Erro';
    }
}
