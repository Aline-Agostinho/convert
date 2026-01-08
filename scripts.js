//Cotação das moedas no dia via API Frankfurter
async function getExchangeRate(currency) {
    const url = `https://api.frankfurter.app/latest?from=${currency}&to=BRL`;

    const response = await fetch(url);
    const data = await response.json();

    return data.rates.BRL;
}


//Obtendo os elementos do formulário 
const form =document.querySelector('form');
const amount = document.getElementById('amount');
const currency = document.getElementById('currency');
const footer = document.querySelector('main footer');
const description = document.getElementById('description');
const result = document.getElementById('result');

//Manipulando o input amount para receber somente números
amount.addEventListener('input', () => {
    const hasCharactersRegex = /\D+/g; 
    amount.value = amount.value.replace(hasCharactersRegex, '');
});

//Capturando o evento de submit do forulário
form.onsubmit = async (event) => {
    event.preventDefault();

    try {
        const selectedCurrency = currency.value;
        const price = await getExchangeRate(selectedCurrency);

        let symbol = '';
        switch (selectedCurrency) {
            case 'USD':
                symbol = 'US$';
                break;
            case 'EUR':
                symbol = '€';
                break;
            case 'GBP':
                symbol = '£';
                break;
        }

        convertCurrency(amount.value, price, symbol);
    } catch (error) {
        alert("Erro ao buscar a cotação atual. Tente novamente.");
        console.error(error);
    }
};


//Função para converter moedas
function convertCurrency(amount, price, symbol) {
    try {
        description.textContent = `${symbol} 1 = ${formatCurrencyBRL(price)}`;

        //Calcula o total convertido e exibe o resultado
        let total = amount * price;
        if (isNaN(total)) {
            return alert("Por favor, insira um valor numérico válido.");
        }
        result.textContent = formatCurrencyBRL(total);

        //Aplica classe que exibe o footer
        footer.classList.add('show-result');
    }
    catch (error) {
        console.error("Erro ao converter moeda:", error);
        //Remove a classe caso ocorra um erro
        footer.classList.remove('show-result');
        alert("Ocorreu um erro ao converter a moeda. Por favor, tente novamente.");
    }
}

//Função para formatar valores em Real Brasileiro
function formatCurrencyBRL(value) {
    return Number(value).toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });
}