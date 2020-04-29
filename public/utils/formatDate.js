exports.formatDateAndTime = function (result) {

        let dia = result.createdAt.getDate();
        let mes = result.createdAt.getMonth() + 1;
        let ano = result.createdAt.getFullYear();
        let horas = result.createdAt.getHours();
        let minutos = result.createdAt.getMinutes();

        if(dia < 10) {
            dia = `0${result.createdAt.getDate()}`;
        }
        if(mes < 10) {
            mes = `0${result.createdAt.getMonth() + 1}`;
        }
        if(horas < 10) {
            horas = `0${result.createdAt.getHours()}`;
        }
        if(minutos < 10) {
            minutos = `0${result.createdAt.getMinutes()}`;
        }
        
        return `${dia}/${mes}/${ano} ${horas}h${minutos}`;
    };

/* const banco = [{
    id: 1,
    name: 'Joaquim',
    createdAt: new Date('1990-05-10 10:00')
}, {
    id: 2,
    name: 'Matheus',
    createdAt: new Date('1985-12-03 12:30')
}];

formatDateAndTime(banco); */

