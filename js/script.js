var texto = ""
var camadas = [[]]
var y = 0

var memoria = 0

var Valor = ""
var Vatual = "0"
var NP = 0
const root = document.documentElement;

document.addEventListener('mousemove', evt => {
    let calc = document.getElementById("Calculadora")
    let rect = calc.getBoundingClientRect();
    let x = (evt.clientX - rect.left) / calc.offsetWidth;
    let y = (evt.clientY - rect.top) / calc.offsetHeight;

    root.style.setProperty('--mouse-x', x);
    root.style.setProperty('--mouse-y', y);
});

function AdcionarChar(c){
	if(Valor.substr(-1) == ")"){return;}
	if(Vatual == "0"){
		Vatual = c
	} else {
		Vatual = Vatual + c
	}
	document.getElementById("Vatual").innerHTML = Vatual
}

function Operacao(o){
	if(Vatual == "0" & Valor !="" & Valor.substr(-1) != ")"){
		Valor = Valor.slice(0, -1)
		Vatual = ""
	}
    if(Vatual == "0" & Valor.substr(-1) == ")"){
		Vatual= ""
	}
	Valor = Valor + Vatual + o
	Vatual = "0"
	
	document.getElementById("Vantigo").innerHTML = Valor
}

function ColocarParenteses(p){
	if(p == "("){
		NP++
		Valor = Valor + "("
	} else if(p == ")" & NP > 0) {
		Valor = Valor + Vatual
		Vatual = "0"
		
		NP--
		Valor = Valor + ")"
	}
	document.getElementById("Vatual").innerHTML = Vatual
	document.getElementById("Vantigo").innerHTML = Valor
}

function Apagar(o) {
	if(o=="u" & Vatual != "0"){
		Vatual = Vatual.slice(0, -1)
		if(Vatual==""){
			Vatual="0"
		}
	} else if(o=="v"){
		Vatual = 0
	} else if(o=="t"){
		Valor = ""
		Vatual = 0
		document.getElementById("Vantigo").innerHTML = Valor
	}
	document.getElementById("Vatual").innerHTML = Vatual
}

function Igual() {
	Valor = Valor + Vatual

	if(NP > 0 ){
		for(i = 0;i<NP;i++)
		Valor = Valor + ")"
	}
	if(Valor.substr(-2)==")0"){
		Valor = Valor.slice(0, -1)
	}

	texto = Valor
	camadas = [[]]
	y = 0

	console.log(texto)

	ArrumarCamadas()
	calcular()

	console.log(camadas[0][0])

	Valor = Valor + "="
	document.getElementById("Vantigo").innerHTML = Valor
	Vatual = camadas[0][0]
	document.getElementById("Vatual").innerHTML = Vatual
	Vatual = "0"
	Valor = ""
}

function ArrumarCamadas() {
    let x = 0
    
    for(let t = 0;t<texto.length;t++){
        if(texto[t] == "+" || texto[t] == "-" || texto[t] == "*" || texto[t] == "/" || texto[t] == "√" || texto[t] == "^"){
            x++
            camadas[0][x] = texto[t]
            x++
            t++
            camadas[0][x] = ""
        }
        if(texto[t] == "("){
            y++
            if(camadas[0][x] == undefined){ camadas[0][x] = "y"+y } else { camadas[0][x] = camadas[0][x] + "y"+y }
            t = Parentes(t+1,y)
            t--
        } else {
            if(camadas[0][x] == undefined){ camadas[0][x] = texto[t] } else { camadas[0][x] = camadas[0][x] + texto[t] }
        }
    }
}

function Parentes(ti,yi){
    let t = ti
    let x = 0
    camadas[yi] = []

    while(texto[t] != ")") {
        if(texto[t] == "+" || texto[t] == "-" || texto[t] == "*" || texto[t] == "/" || texto[t] == "√" || texto[t] == "^"){
            x++
            camadas[yi][x] = texto[t]
            x++
            t++
            camadas[yi][x] = ""
        }
        if(texto[t] == "("){
            y++
            if(camadas[yi][x] == undefined){ camadas[yi][x] = "y"+y } else { camadas[yi][x] = camadas[yi][x] + "y"+y }
            t = Parentes(t+1,y)
        } else{
            if(camadas[yi][x] == undefined){ camadas[yi][x] = texto[t] } else { camadas[yi][x] = camadas[yi][x] + texto[t] }
            t++
        }
    }
    return t+1
}

function calcular() {
    let Ncont
    
    for(let c = camadas.length-1; c >= 0;c--) {
        for(let n=0;n < camadas[c].length;n++){
            if(camadas[c][n].toString().substring(0,1)=='y'){
                camadas[c][n] = camadas[camadas[c][n].substr(1)][0]
            }
        }
        for(let t =0;t<=2;t++){
            for(let n=0;n < camadas[c].length;n++){
                if(t==0){
                    //console.log(n)
                    switch(camadas[c][n]){
                        case "^":
                            n--
                            repor(parseFloat(camadas[c][n])**parseFloat(camadas[c][n+2]), c, n)
                            break
                        case "√":
                            n--
                            repor(parseFloat(camadas[c][n+2])**(1/parseFloat(camadas[c][n])), c, n)
                            break
                    }
                } else if(t==1) {
                    switch(camadas[c][n]){
                        case "*":
                            n--
                            repor(parseFloat(camadas[c][n])*parseFloat(camadas[c][n+2]), c, n)
                            break
                        case "/":
                            n--
                            repor(parseFloat(camadas[c][n])/parseFloat(camadas[c][n+2]), c, n)
                            break
                    }
                } else if(t==2) {
                    switch(camadas[c][n]){
                        case "+":
                            n--
                            repor(parseFloat(camadas[c][n])+parseFloat(camadas[c][n+2]), c, n)
                            break
                        case "-":
                            n--
                            repor(parseFloat(camadas[c][n])-parseFloat(camadas[c][n+2]), c, n)
                            break
                    }
                }
            }
        }
    }
}

function repor(v, x , y) {
    let res = []
    for(let i = 0;i<y;i++){
        res[res.length] = camadas[x][i]
    }
    res[res.length] = v
    for(let i = y+3;i<camadas[x].length;i++){
        res[res.length] = camadas[x][i]
    }
    camadas[x] = res
}

function Memoria(o) {
    switch(o){
        case "C":
            memoria = 0
            break;
        case "R":
            Vatual = memoria
            document.getElementById("Vatual").innerHTML = Vatual
            break;
        case "+":
            memoria = memoria + parseFloat(document.getElementById("Vatual").innerHTML)
            break;
        case "-":
            memoria = memoria - parseFloat(document.getElementById("Vatual").innerHTML)
            break;
        case "S":
            memoria = parseFloat(document.getElementById("Vatual").innerHTML)
            break;
    }
}