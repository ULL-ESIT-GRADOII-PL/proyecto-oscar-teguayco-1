(() => {
 
 var util = require('util');
 var errorsMessage = "";
 /**
  * Recorre los bloques/funciones del AST ejecutando sobre cada 
  * nodo bloque la acción callbackAction que se pasa como parámetro.
  */
 var eachBlockPre = (tree, callbackAction, f) => {
     callbackAction(tree, f);
     tree.functions.forEach((func) => {
          //console.log(func);
          eachBlockPre(func, callbackAction, tree.symbolTable) 
     }); 
 }
 
 /**
  * El atributo symbolTable tiene un atributo father que 
  * referencia la tabla de símbolos del bloque que lo anida
  */
 var addTableToBlock = (block, f) => {
     //console.log("tree: " + util.inspect(block, {depth: null}));
     //console.log("father: " + util.inspect(f, {depth: null}));
     
     block.symbolTable = {
         father: f,
         constants: [],
         variables: [],
         functions: []
     }
     
     block.constants.forEach((constant) => addSymbolToTable(constant, 'const', block.symbolTable));
     block.variables.forEach((variable) => addSymbolToTable(variable, 'var', block.symbolTable));
     block.functions.forEach((func) => addSymbolToTable(func, 'func', block.symbolTable));
 }
 
 /**
  * Devuelve true si el símbolo está declarado en la rama de bloques
  */
 var symbolIsDeclared = (symbol, symbolType, table) => {
    if (symbolType == 'const') {
        if (table.constants.indexOf(symbol[0]) <= -1) {
            if (table.father != null) {
                return symbolIsDeclared(symbol, symbolType, table.father);
            } else {
                return false;
            }
        } else {
            return true;
        }
    
    } else if (symbolType == 'var') {
        //console.log("variables: " + table.variables);
        //console.log("var: " + symbol);
        if (table.variables.indexOf(symbol) <= -1) {
            // Si no está, buscamos la variable en la tabla padre
            if (table.father != null) {
                return symbolIsDeclared(symbol, symbolType, table.father);
            } else {
                return false;
            }
        } else {
            return true;
        }
    
    } else if (symbolType == 'func') {
        if (table.functions.indexOf([symbol.name.value, symbol.params.length].toString()) <= -1) {
            if (table.father != null) {
                return symbolIsDeclared(symbol, symbolType, table.father);
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
 }
 
 /**
  * Añade un símbolo a la tabla 
  */
 var addSymbolToTable = (symbol, symbolType, table) => {
     if (symbolType == 'const') {
        if (symbolIsDeclared(symbol, symbolType, table)) {
           //console.log("duplicated constant");
           errorsMessage += "redeclared constant '" + symbol[0] + "'\n";
        } else {
           table.constants.push(symbol[0]);
           //console.log("Guardando constante: " + symbol[0]);
        }
        
     } else if (symbolType == 'var') {
        //console.log("Comprobando variable: " + symbol);
        if (symbolIsDeclared(symbol, symbolType, table)) {
            errorsMessage += "redeclared variable '" + symbol + "'\n";
        } else {
            table.variables.push(symbol);
            //console.log("Guardando variable: " + symbol);
        }
        
     } else if (symbolType == 'func') {
        //console.log("Guardando función: " + symbol.name.value);
        if (symbolIsDeclared(symbol, symbolType, table)) {
            errorsMessage += "redeclared function '" + symbol.name.value + "'\n";
        } else {
            // Para las funciones, guardamos el par nombre-nparams, 
            // así podremos definir un lenguaje que permita la 
            // sobrecarga de funciones
            var pair = [symbol.name.value, symbol.params.length].toString();
            //console.log("Añadiendo par func: " + pair);
            table.functions.push(pair);
        }
         
     } else {
        console.err("Not recognized type '" + symbolType + "'\n");
     }
 } 
 
 /**
  * Busca los usos de constantes, variables y llamadas a funciones
  * en el árbol de análisis sintáctico
  */ 
 var searchChildInSymbolTable = (child, symbolTable) => {
       for (var property in child) {
           console.log("child[property]: " + util.inspect(child[property], {depth: null}));
           if (child[property].type == 'ID') {
               console.log("ID");
               console.log("val: " + child[property].value);
           }
       } 
 }
 
 /**
  * Se comprueba que todos los símbolos (constantes, variables y 
  * funciones) han sido declarados antes de su uso
  */
 var checkSymbolsDeclaration = (block) => {
     block.main.children.forEach((child) => {
        //console.log("child: " + util.inspect(child, {depth: null}));
        searchChildInSymbolTable(child, block.symbolTable);
     });
 }
 
 /**
  * Comprueba que la llamada a la función se ha realizado
  * con el número correcto de parámetros
  */
 var checkCallingArguments = (block) => {
     
 }
 
 var semantic = (tree) => {
     console.log("en semantic.js");
     
     // Construir la tabla de cada nodo y ver si hay redeclaraciones
     eachBlockPre(tree, addTableToBlock, null);
     
     // Si no hay errores, pasamos a ver que no haya usos de variables
     // no declaradas
     if (errorsMessage == "") {
        eachBlockPre(tree, checkSymbolsDeclaration);
     }
     console.log("\n" + errorsMessage);
 }
 
 module.exports = semantic; 
 
})();



/**
 *  -- Redeclaraciones 
 *  -- uso de elementos sin declaracion
 *  -- mal uso de funciones (numero incorrecto de parametros, etc)
 */