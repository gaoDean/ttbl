let test = async () => {
}

Neutralino.init();
test();
let info = await Neutralino.os.execCommand('ttbl');
console.log(`ttbl: ${info.stdOut}`);
