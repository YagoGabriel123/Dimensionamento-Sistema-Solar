function calcularSistema() {
    const tipoLigacao = document.getElementById('tipoLigacao').value;
    const consumoMensal = parseFloat(document.getElementById('consumoMensal').value);
    const potenciaPainel = document.getElementById('potenciaPainel').value;

    let marcaPainel, potenciaNominal, correnteMaximaPainel, correnteCurtoCircuito, tensaoPainel, tensaoCircuitoAberto;

    if (potenciaPainel === "610") {
        marcaPainel = "DAH";
        potenciaNominal = 610;
        correnteMaximaPainel = 13.68;
        correnteCurtoCircuito = 14.72;
        tensaoPainel = 44.6;
        tensaoCircuitoAberto = 44.6;
    } else if (potenciaPainel === "555") {
        marcaPainel = "ZNShine Solar";
        potenciaNominal = 555;
        correnteMaximaPainel = 14.5;
        correnteCurtoCircuito = 15.35;
        tensaoPainel = 42.00;
        tensaoCircuitoAberto = 42.00;
    } else if (potenciaPainel === "570") {
        marcaPainel = "PULLING";
        potenciaNominal = 570;
        correnteMaximaPainel = 14.28;
        correnteCurtoCircuito = 15.12;
        tensaoPainel = 39.91;
        tensaoCircuitoAberto = 39.91;
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

    let minTensao, maxTensao, maxCorrente, numStrings = 1;
    if (tipoLigacao === 'trifasica') {
        minTensao = 180;
        maxTensao = 850;
        maxCorrente = 18.75;
    } else {
        minTensao = 80;
        maxTensao = 550;
        maxCorrente = 18.75;
        numStrings = Math.min(3, numPaineis);
    }

    let paineisPorString = [];
    let tensoesPorString = [];
    let paineisRestantes = numPaineis;
    let tensaoTotal = 0;
    let numPaineisAtual = 0;

    while (paineisRestantes > 0) {
        if (tensaoTotal + tensaoPainel <= maxTensao) {
            tensaoTotal += tensaoPainel;
            numPaineisAtual++;
            paineisRestantes--;
        } else {
            if (tensaoTotal >= minTensao) {
                paineisPorString.push(numPaineisAtual);
                tensoesPorString.push(tensaoTotal.toFixed(2));
                tensaoTotal = 0;
                numPaineisAtual = 0;
            } else {
                break;
            }
        }
    }

    if (numPaineisAtual > 0 && tensaoTotal >= minTensao) {
        paineisPorString.push(numPaineisAtual);
        tensoesPorString.push(tensaoTotal.toFixed(2));
    }

    let mensagem = `<p>Sistema dimensionado corretamente para uma ligação ${tipoLigacao}.</p>`;
    mensagem += `<p>Quantidade de painéis necessários: <strong>${numPaineis}</strong></p>`;
    mensagem += `<p>Potência total do sistema: <strong>${(potenciaTotalSistema / 1000).toFixed(2)} kW</strong></p>`;
    mensagem += `<p>Potência Ideal do Inversor (0% overload): <strong>${potenciaInversorIdeal} kW</strong></p>`;

    mensagem += `<p>Sugestões de Inversores:</p><ul>`;
    mensagem += `<li>Inversor Ideal (0% overload): <strong>${potenciaInversorIdeal} kW</strong></li>`;
    for (let i = 1; i <= 5; i++) {
        const overload = (i * 10) / 100;
        const potenciaSugerida = Math.floor(potenciaInversorIdeal * (1 - overload));
        if (potenciaSugerida > 0) {
            const overloadPercentage = (overload * 100).toFixed(1);
            mensagem += `<li>Inversor com Overload ${overloadPercentage}%: <strong>${potenciaSugerida} kW</strong></li>`;
        }
    }
    mensagem += `</ul>`;

    mensagem += `<p>Detalhes do Painel Selecionado:</p>`;
    mensagem += `<ul><li>Marca: ${marcaPainel}</li>`;
    mensagem += `<li>Potência Nominal: ${potenciaNominal} W</li>`;
    mensagem += `<li>Corrente Máxima: ${correnteMaximaPainel} A</li>`;
    mensagem += `<li>Corrente de Curto Circuito: ${correnteCurtoCircuito} A</li>`;
    mensagem += `<li>Tensão Máxima de Operação: ${tensaoCircuitoAberto} V</li></ul>`;
    
    mensagem += `<p>Painéis por string e tensões:</p><ul>`;
    for (let i = 0; i < paineisPorString.length; i++) {
        mensagem += `<li>${paineisPorString[i]} painéis, tensão total: ${tensoesPorString[i]} V</li>`;
    }
    mensagem += `</ul>`;

    document.getElementById('resultado').innerHTML = mensagem;
    document.getElementById("downloadPDF").style.display = "inline";
}

function salvarPDF() {
    const resultadoDiv = document.getElementById("resultado");
    html2pdf().from(resultadoDiv).save("Dimensionamento_Solar.pdf");
}
