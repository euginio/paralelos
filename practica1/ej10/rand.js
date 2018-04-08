
var cant = 512;
var array = [];
for (let i = 0; i < cant; i++) {
    array[i] = Math.pow(2, Math.floor((Math.random() * 15) + 1));
}
console.log(JSON.stringify(array));