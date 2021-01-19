const SUCESS = 'rgba(18, 223, 0, 0.4);';
const WARNING = 'rgba(215, 255, 38, 0.4);';
const DANGER = ' rgba(215, 0, 38, 0.4)';

/*
* É necessário esses parâmetros, pois o danger de um equipamento pode váriar para o outro
*   */

//DADOS AQUI
var dadosRadialMax = {
    'tamanhoMaximoDanger': 50,
    'tamanhoMaximoWarning': 90,
    'tamanhoMaximoSucess': 200,
};

var dadosRadialGauge = {

    // 'tamanhoMax' : 300,
    'tamanhoMax': dadosRadialMax.tamanhoMaximoSucess + (dadosRadialMax.tamanhoMaximoDanger * 2),
    'tamanhoMinimo': 0,
    dadosRadialMax,
    'valorGauge': 50,
}

var dadosTemperaturaGauge = {
    // 'nomeIndicadorTemperatura' : 'temperaturaAmbiente',
    // 'temperaturas' : {
    'useCelcius': true,
    'temperaturaAtual': 60,
    'limiteMaximo': 100,
    'limiteMinimo': -10,
    'temperaturaDangerTop': 80, //inicio 80-100
    'tempertauraWarningTop': 70, //incio 70-80
    'temperaturaSuccess': 30,
    'temperaturaWarningBottom': 20, //inicio 20-30
    'temperaturaDangerBottom': -10, //inicio -10-10
    // }
};

//FUNÇÕES E SEUS PARAMETROS
createGaugeRadial(document.getElementById('foo'), 'text-gauge-radial', dadosRadialGauge);
createGaugeTemperatura(dadosTemperaturaGauge);

//CONDICIONAL PARA CORES NO GAUGE DE TEMPERATURA
function condicionalGaugeTemperatura(tempAtual, dados) {
    // tempAtual = parseInt(tempAtual);

    tempDangerTop = dados.temperaturaDangerTop;
    tempWarningTop = dados.tempertauraWarningTop;
    tempSucces = dados.temperaturaSuccess;
    tempWarningBottom = dados.temperaturaWarningBottom;
    tempDangerBottom = dados.temperaturaDangerBottom;

    if (tempAtual >= tempDangerBottom && tempAtual < tempWarningBottom
        || tempAtual >= tempDangerTop) { // condicional para success
        return DANGER;
    } else if (tempAtual < tempSucces && tempAtual > tempDangerBottom
        || tempAtual >= tempWarningTop && tempAtual < tempDangerTop) { //condicional para danger
        return WARNING;
    } else if (tempAtual >= tempSucces && tempAtual < tempWarningTop) { //condicional para warning
        return SUCESS;
    }

}

//FUNÇÃO PARA CRIAR O GAUGE DE TEMPERATURA
function createGaugeTemperatura(dados) {
    // condicionalGaugeTemperatura(dados.temperaturas.temperaturaAtual,dados.temperaturas.tempertauraWarningTop,dados.temperaturas.temperaturaWarningBottom);
    // TEMPERATURA
    document.addEventListener("DOMContentLoaded", () => {
        var valor;
        var limite = dados.limiteMaximo;

        if (dados.limiteMinimo < 0) {
            valor = (dados.limiteMaximo + (-1 * dados.limiteMinimo)) / 10;
        }
        for (let x = 0; x <= 10; x++) {
            var cor = condicionalGaugeTemperatura(limite, dados);
            $(".colors").append('<div style="background-color: ' + cor + ';width: 10px;height: 50px"></div>');
            if (dados.useCelcius){
                $(".thermometer__f").append(' <div class="thermometer__label">' + Math.round(CToF(limite)) + '</div>');
                $(".thermometer__c").append(' <div class="thermometer__label">' + limite + '</div>');
            }else{
                $(".thermometer__f").append(' <div class="thermometer__label">' + limite + '</div>');
                $(".thermometer__c").append(' <div class="thermometer__label">' + Math.round(FToC(limite)) + '</div>');
            }
            limite -= valor;

        }
        updateTemperature(1, dados.useCelcius);
    });

    function CToF(c) {
        return c * 1.8 + 32;
    }

    function FToC(f) {
        return (f - 32) * (5 / 9);
    }

    function incOrDec(amt = 1) {
        return Math.random() < 0.5 ? -amt : amt;
    }

    function nearest10th(n) {
        return Math.round(n * 10) / 10;
    }

    //ATUALIZAR TEMPERATURA
    function updateTemperature(interval = 1e3, useCelcius = false) {
        // `useCelcius` means that the temperature should increment or decrement by °C instead of °F
        let tempVal = document.getElementById("temp-val");
        if (tempVal) {
            // let dataC = tempVal.getAttribute("data-c"),
            // ATUALIZA A TEMPERATURA
            /*
            * Tem que ter essas subtrações, pois é a diferença para que o mesmo valor do C seja equivalente ao F
            * */
            // let dataC = CToF(dados.temperaturaAtual),
            //     dataF = FToC(dados.temperaturaAtual),
            //         tempC = dados.temperaturaAtual,
            temp = dados.temperaturaAtual,
                // tempC = +dataC,
                // tempF = +dataF,
                tempFill = document.getElementById("temp-fill");
            // adjustAmt = Math.round(1 + Math.random());

            // ATUALIZA A TEMPERATURA DE FORMA ALEATORIA
            // tempF -=8;
            // randomly increment or decrement the temperature
            // if (useCelcius) {
            //     tempC += incOrDec(adjustAmt);
            //     tempVal.setAttribute("data-c",tempC);
            //     tempF = nearest10th(CToF(tempC));
            //     tempVal.setAttribute("data-f",tempF);
            // } else {
            //     tempF += incOrDec(adjustAmt);
            // tempVal.setAttribute("data-f",tempF);
            // tempC = nearest10th(FToC(tempF));
            // tempVal.setAttribute("data-c",tempC);
            // }
            // mercury
            if (tempFill) {
                let scaleY = 0,
                    scaleYMax = 0.995;

                let minTempC = dados.limiteMinimo,
                    maxTempC = dados.limiteMaximo;

                scaleY += (temp - minTempC) / (Math.abs(minTempC) + maxTempC);

                if (scaleY > scaleYMax)
                    scaleY = scaleYMax;
                else if (scaleY < 0)
                    scaleY = 0;

                tempFill.style.transform = `scaleY(${scaleY})`;

                let tempReading;
                if (useCelcius) {
                    tempReading = `${temp}°C, ${CToF(temp)}°F`;
                } else {
                    tempReading = `${FToC(temp)}°C, ${temp}°F`;
                }
                tempVal.title = tempReading;
            }

        }
        setTimeout(updateTemperature.bind(null, interval, useCelcius), interval);
    }
    /*
        Esse aqui foi algo a mais que adicionei, porém pode ser retirado, deixando apenas o °F e o°C nos elementos com classe celsius e  fahrenheit
     */
    if (dados.useCelcius) {
        $(".celsius").append('<span>' + dados.temperaturaAtual + '°C</span>');
        $(".fahrenheit").append('<span>' + Math.round(CToF(dados.temperaturaAtual)) + '°F</span>');
    } else {
        $(".celsius").append('<span>' + Math.round(FToC(dados.temperaturaAtual)) + '°C</span>');
        $(".fahrenheit").append('<span>' + dados.temperaturaAtual + '°F</span>');
    }
}

//FUNÇÃO PARA CRIAR O GAUGE HORIZONTAL
function createGaugeRadial(idCanvas, idTextField, dados) {

    var canvasTargetCtx = idCanvas.getContext('2d');

    var grad = canvasTargetCtx.createRadialGradient(-1, 0, 0, 0, 0, 190); //cria um gradiente com o intuito de sombreamento
    grad.addColorStop(0.5, 'rgba(255,255,255,0)');
    grad.addColorStop(0.4, 'rgba(0,0,0,0.2)');
    canvasTargetCtx.strokeStyle = grad;

    // var tamAlter = dados.tamanhoMax/6;
    var opts = {
        angle: 0, // The span of the gauge arc
        lineWidth: 0.3, // The line thickness
        radiusScale: 0.9, // Relative radius
        pointer: {
            length: 0.54, // // Relative to gauge radius
            strokeWidth: 0.053, // The thickness
            color: '#000000' // Fill color
        },
        limitMax: false,     // If false, max value increases automatically if value > maxValue
        limitMin: false,     // If true, the min value of the gauge will be fixed
        colorStart: '#6FADCF',   // Colors
        colorStop: '#8FC0DA',    // just experiment with them
        strokeColor: '#E0E0E0',  // to see which ones work best for you
        generateGradient: true,
        highDpiSupport: true,     // High resolution support
        staticZones: [
            {strokeStyle: "#ff0000", min: dados.tamanhoMinimo, max: dados.dadosRadialMax.tamanhoMaximoDanger}, //50
            {strokeStyle: grad, min: dados.tamanhoMinimo, max: dados.dadosRadialMax.tamanhoMaximoDanger},
            {
                strokeStyle: "#ebe939",
                min: dados.dadosRadialMax.tamanhoMaximoDanger,
                max: dados.dadosRadialMax.tamanhoMaximoWarning + dados.dadosRadialMax.tamanhoMaximoDanger
            }, //90
            {
                strokeStyle: grad,
                min: dados.dadosRadialMax.tamanhoMaximoDanger,
                max: dados.dadosRadialMax.tamanhoMaximoWarning
            },
            {
                strokeStyle: "#29af19",
                min: dados.dadosRadialMax.tamanhoMaximoWarning,
                max: dados.dadosRadialMax.tamanhoMaximoSucess
            }, //190
            {
                strokeStyle: grad,
                min: dados.dadosRadialMax.tamanhoMaximoWarning,
                max: dados.dadosRadialMax.tamanhoMaximoSucess
            },
            {
                strokeStyle: "#ebe939",
                min: dados.dadosRadialMax.tamanhoMaximoSucess,
                max: dados.dadosRadialMax.tamanhoMaximoSucess + dados.dadosRadialMax.tamanhoMaximoDanger
            },  // 200+50 = 250
            {
                strokeStyle: grad,
                min: dados.dadosRadialMax.tamanhoMaximoSucess,
                max: dados.dadosRadialMax.tamanhoMaximoSucess + dados.dadosRadialMax.tamanhoMaximoDanger
            },
            {
                strokeStyle: "#ff0000",
                min: dadosRadialMax.tamanhoMaximoSucess + dados.dadosRadialMax.tamanhoMaximoDanger,
                max: dados.tamanhoMax
            }, //200+50+50 = 300
            {
                strokeStyle: grad,
                min: dados.dadosRadialMax.tamanhoMaximoSucess + dados.dadosRadialMax.tamanhoMaximoDanger,
                max: dados.tamanhoMax
            }
        ],
        staticLabels: {
            font: "10px sans-serif",
            labels: [dados.tamanhoMinimo, (25 * dados.tamanhoMax) / 100, (50 * dados.tamanhoMax) / 100, (75 * dados.tamanhoMax) / 100, dados.tamanhoMax],
            color: "#000000",
            fractionDigits: 0
        },
        renderTicks: {
            divisions: 4,
            divWidth: 0.8,
            divLength: 0.5,
            divColor: '#333333',
            subDivisions: 3,
            subLength: 0.3,
            subWidth: 0.5,
            subColor: '#666666'
        }
    };

    var gauge = new Gauge(idCanvas).setOptions(opts); //desenha um gauge no canvas
    gauge.maxValue = dados.tamanhoMax; // valor máximo
    gauge.setMinValue(dados.tamanhoMinimo);  // valor mínimo
    gauge.animationSpeed = 50; // velocidade da animação do ponteiro

    /*condicional com ajax aqui para atualizar o valor, sendo necessário retirar o parâmetro valorGauge,
    ou mudar apenas quando atualizar a página, neste último caso não é necessário mudança*/
    // if (valorRecebido != valorAtual) {   exemplo
    // gauge.set(valorRecebidoPeloajax);    exemplo
    gauge.set(dados.valorGauge); // Inserir o valor
    //fim if                                exemplo

    gauge.setTextField(document.getElementById(idTextField)); //insere o mesmo valor presente em gauge.set() no campo com o id passado
}
