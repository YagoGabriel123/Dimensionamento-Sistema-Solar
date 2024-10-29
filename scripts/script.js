function calcularSistema() {
    const nomeCliente = document.getElementById('nomeCliente').value;
    const contato = document.getElementById('contato').value;
    const endereco = document.getElementById('endereco').value;
    const tipoLigacao = document.getElementById('tipoLigacao').value;
    const consumoMensal = parseFloat(document.getElementById('consumoMensal').value);
    const potenciaPainel = document.getElementById('potenciaPainel').value;

    let marcaPainel, potenciaNominal, correnteMaximaPainel, correnteCurtoCircuito, tensaoPainel, tensaoCircuitoAberto;
    if (potenciaPainel === "610") {
        marcaPainel = "DAH";
        potenciaNominal = 610;
        correnteMaximaPainel = 13.68;
        correnteCurtoCircuito = 14.72;
        tensaoPainel = 52.4;
        tensaoCircuitoAberto = 52.4;
    } else if (potenciaPainel === "555") {
        marcaPainel = "ZNShine Solar";
        potenciaNominal = 555;
        correnteMaximaPainel = 14.5;
        correnteCurtoCircuito = 15.35;
        tensaoPainel = 46.2;
        tensaoCircuitoAberto = 46.2;
    } else if (potenciaPainel === "570") {
        marcaPainel = "PULLING";
        potenciaNominal = 570;
        correnteMaximaPainel = 14.28;
        correnteCurtoCircuito = 15.12;
        tensaoPainel = 47.82;
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

    let minTensao, maxTensao, maxCorrente, numStrings, mensagem;
    if (tipoLigacao === 'trifasica') {
        minTensao = 200;
        maxTensao = 450;
        maxCorrente = 40.00;
        numStrings = 3;
    } else {
        minTensao = 90;
        maxTensao = 450;
        maxCorrente = 40.00;
        numStrings = 2;
    }

    mensagem = `
        <p><strong>Nome do Cliente:</strong> ${nomeCliente}</p>
        <p><strong>Contato:</strong> ${contato}</p>
        <p><strong>Endereço:</strong> ${endereco}</p>
        <p><strong>Tipo de Ligação:</strong> ${tipoLigacao}</p>
        <p><strong>Marca do Painel:</strong> ${marcaPainel}</p>
        <p><strong>Consumo Mensal:</strong> ${consumoMensal} kWh</p>
        <p><strong>Quantidade de Painéis:</strong> ${numPaineis}</p>
        <p><strong>Potência Total do Sistema:</strong> ${potenciaTotalSistema} W</p>
        <p><strong>Potência do Inversor Ideal:</strong> ${potenciaInversorIdeal} kW</p>
        <p><strong>Tensão Mínima:</strong> ${minTensao} V</p>
        <p><strong>Tensão Máxima:</strong> ${maxTensao} V</p>
        <p><strong>Corrente Máxima:</strong> ${maxCorrente} A</p>
        <p><strong>Número de Strings:</strong> ${numStrings}</p>
    `;

    document.getElementById('resultado').innerHTML = mensagem;
    document.getElementById('btnSalvarPDF').style.display = 'block';
}

function salvarPDF() {
    const elemento = document.getElementById('resultado');
    const opcao = {
        margin: 1,
        filename: 'dimensionamento_solar.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opcao).from(elemento).save();
}

let operandoAtual = "";
let operacao = "";

function adicionarNumero(numero) {
    operandoAtual += numero;
    document.getElementById("inputCalc").value = operandoAtual;
}

function realizarOperacao(op) {
    operacao = op;
    operandoAtual += op;
    document.getElementById("inputCalc").value = operandoAtual;
}

function calcularResultado() {
    try {
        const resultado = eval(operandoAtual);
        document.getElementById("resultadoCalc").textContent = "Resultado: " + resultado;
        operandoAtual = resultado.toString();
    } catch (error) {
        document.getElementById("resultadoCalc").textContent = "Erro";
    }
}

function limpar() {
    operandoAtual = "";
    document.getElementById("inputCalc").value = "";
    document.getElementById("resultadoCalc").textContent = "";
}
