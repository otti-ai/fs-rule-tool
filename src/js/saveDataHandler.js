class SaveDataHandler {
    constructor(){
        this.rulePath = "rules/save.json";
        this.readJson();
    }

    readJson(){
        fetch(this.rulePath)
        .then((res) => res.text())
        .then((text) => {
            this.data = JSON.parse(text);
        })
        .catch((e) => console.error(e));
    }

    addToBookmaker(pElement){
        let bookID = this.findBookFolder(pElement.innerHTML);
        let listElement = new Object();
        listElement.rule_shortname = pElement.dataset.rule;
        listElement.book_name = pElement.dataset.book;
        this.data.bookmakers[bookID].rule_list.push(listElement);

        this.saveSaveData();
    }

    findBookFolder(pFolder){
        for(var i=0;i<this.data.bookmakers.length;i++){
            if(pFolder==this.data.bookmakers[i].folder_name){
                return i;
            }
        }
    }

    saveSaveData(){
        //save diffrent betwin browser and electron
        window.electronAPI.saveJson(this.rulePath, this.data);
    }

    
}
