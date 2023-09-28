var regex = /(A|T|CV|EV|IN|S|D)\d{1,2}\.\d{1,2}\.\d{1,2}(?![\d])|(A|T|CV|EV|IN|S|D)\d{1,2}\.\d{1,2}(?![\d])|(A|T|CV|EV|IN|S|D)\d{1,2}(?![\d])/g;
var regexTable = /[^{](Table|Figure) \d{1,2}/igu;
var regexImplement = /{{(.*?)}}/g;

function registerHandlebarsHelpers(){
    Handlebars.registerHelper("removeSpace", function (text) {
        return text.replace(" ","");
    });

    Handlebars.registerHelper("lower", function (text) {
        return text.toLowerCase();
    });

    Handlebars.registerHelper("tableHead", function (text) {
        if (text !== undefined){
            let html;
            text.split('|').forEach(function (item) {
                html += '<th scope="col">'+item+'</th>';
            });
            return html.substring(9);
        }
    });

    Handlebars.registerHelper("ruleBookmakers", function (rule, book) {
        let html;
        saveData.data.bookmakers.forEach(function (item) {
            html += '<li><a class="dropdown-item bookmakerButton" data-rule="'+rule+'" data-book="'+book+'" href="#">'+item.folder_name+'</a></li>';
        });

        return html.substring(9);;
    });

    Handlebars.registerHelper("tableItem", function (text) {
        if (text !== undefined){
            let html;
            text.split('|').forEach(function (item) {
                html += '<td scope="col">'+item+'</td>';
            });
            return html.substring(9);
        }
    });

    Handlebars.registerHelper("createRuleText", function (text) {
        text = text.replaceAll('•', '<br><span class="ms-1 me-1">•</span>');
        text = text.replace(regex, '<a href="#" onclick="scrollToRule(\'$&\');event.preventDefault();">$&</a>');
        text = text.replace(regexTable, function(match) { return ' <a href="#" onclick="scrollToRule(\''+match.toLowerCase().substring(1)+'\');event.preventDefault();">'+match.substring(1)+'</a>';});
        text = text.replace(regexImplement, function(match){ return figuresArray[match.substring(2).slice(0,-2)];});
        return text.replace(" ","");
    });
}