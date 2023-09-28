class RuleBookReader {
    
    constructor(pPath){
        this.rulePath = pPath;
        this.readJson();
    }

    readJson(){
        fetch(this.rulePath)
        .then((res) => res.text())
        .then((text) => {
            this.data = JSON.parse(text);
            this.setupFigures();
        })
        .catch((e) => console.error(e));
    }

    async getTemplate(name){
        return fetch('templates/'+name+'.html')
        .then(response => response.text())
        .then((data) => {
            return data;
        })
    }

    getMenuItem(){
        var entryListElement = document.createElement('li');
        entryListElement.setAttribute('class', 'nav-item mt-1');

        var entryLinkElement = document.createElement('a');
        entryLinkElement.setAttribute('href', '#');
        entryLinkElement.setAttribute('class', 'nav-link text-white d-flex align-items-center');
        entryLinkElement.addEventListener('click', this.openRuleClick);
        entryLinkElement.addEventListener('click', function(event){ event.preventDefault() });

        var entryImageElement = document.createElement('img');
        entryImageElement.setAttribute('class', 'bi me-2 menuIcon');
        entryImageElement.setAttribute('src', 'img/icons/overall.png');

        var entryDivElement = document.createElement('div');

        var entryLocationElement = document.createElement('p');
        entryLocationElement.setAttribute('class', 'mb-0');
        entryLocationElement.appendChild(document.createTextNode(this.data.event));

        var entryRuleNameElement = document.createElement('p');
        entryRuleNameElement.setAttribute('class', 'mb-0');
        entryRuleNameElement.appendChild(document.createTextNode(this.data.rulebook));

        entryDivElement.appendChild(entryLocationElement);
        entryDivElement.appendChild(entryRuleNameElement);

        entryLinkElement.appendChild(entryImageElement);
        entryLinkElement.appendChild(entryDivElement);

        entryListElement.appendChild(entryLinkElement);

        return entryListElement;
    }

    openRuleClick = async e => {        
        figuresArray = this.figuresArray;
        let template = await this.getTemplate('ruleheader');
        let templateFunction = Handlebars.compile(template);

        let htmlPre = templateFunction(this.data);

        mainPlane.innerHTML = htmlPre;
        Array.from(document.getElementsByClassName('ruleBody')).forEach((item) =>{
            M.parseMath(item);
        });

        Array.from(document.getElementsByClassName('bookmakerButton')).forEach((item) =>{
            item.addEventListener('click', function(event){ event.preventDefault(); saveData.addToBookmaker(this); });
        });
    }

    setupFigures = async e => {
        this.figuresArray = new Array();
        this.data.figures.forEach(async (figure) => {
            let template = await this.getTemplate('figure');
            let templateFunction = Handlebars.compile(template);

            let html = templateFunction(figure);
            this.figuresArray[figure.figure_name] = html;
        });
    }

}