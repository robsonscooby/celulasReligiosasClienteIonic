export class Celula {
    key?: string;
    code: string = null;
    status: boolean = false;
    descricao : string = null;
    cep: string = null;
    endereco : string = null;
    nome : string = null;
    site : string = null;
    telefone : string = null;
    lat: string = null;
    lng: string = null;
    thumbnailId: string = null;
    thumbnailURL: string = null;

    constructor(values: Object = {}){
        Object.keys(this).forEach(key => {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key];
            }
        });
    }
}