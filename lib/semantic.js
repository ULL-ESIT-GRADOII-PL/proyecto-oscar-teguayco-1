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
          eachBlockPre(func, callbackAction, tree.symbolTable) 
     }); 
 }
 
 /**
  * El atributo symbolTable tiene un atributo father que 
  * referencia la tabla de símbolos del bloque que lo anida
  */
 var addTableToBlock = (block, f) => {
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
           errorsMessage += "redeclared constant '" + symbol[0] + "'\n";
        } else {
           table.constants.push(symbol[0]);
        }
        
     } else if (symbolType == 'var') {
        if (symbolIsDeclared(symbol, symbolType, table)) {
            errorsMessage += "redeclared variable '" + symbol + "'\n";
        } else {
            table.variables.push(symbol);
        }
        
     } else if (symbolType == 'func') {
        if (symbolIsDeclared(symbol, symbolType, table)) {
            errorsMessage += "redeclared function '" + symbol.name.value + "'\n";
        } else {
            // Para las funciones, guardamos el par nombre-nparams, 
            // así podremos definir un lenguaje que permita la 
            // sobrecarga de funciones
            var pair = [symbol.name.value, symbol.params.length].toString();
            table.functions.push(pair);
        }
         
     } else {
        console.err("Not recognized type '" + symbolType + "'\n");
     }
 } 
 
 
 /**
  * symbol puede ser o variables o constante
  */
 var varOrConstIsDeclared = (symbol, symbolTable) => {
     if (symbolTable.constants.indexOf(symbol) > -1) {
         return true;
     } else if (symbolTable.variables.indexOf(symbol) > -1) {
         return true;
     } else {
         if (symbolTable.father != null) {
             return varOrConstIsDeclared(symbol, symbolTable.father);
         }
     }
 }
 
 /**
  * Comprueba que la llamada a la función se ha realizado
  * con el número correcto de argumentos
  */
 var checkCallingArguments = (funcName, nArgs, symbolTable) => {
     if (symbolTable.functions.indexOf(funcName + "," + nArgs) > -1) {
         return true;
     } else if (symbolTable.father != null) {
         return checkCallingArguments(funcName, nArgs, symbolTable.father);
     }
 }
 
 /**
  * Busca los usos de constantes, variables y llamadas a funciones
  * en el árbol de análisis sintáctico
  */ 
 var searchChildInSymbolTable = (child, symbolTable) => {
       for (var property in child) {
           //console.log(child[property]);
           if (child[property].type == 'ID') {
               if (!varOrConstIsDeclared(child[property].value, symbolTable)) {
                   errorsMessage += "variable '" + child[property].value + "' was not declared\n";
               }
           } else if (child[property].type == 'CALL') {
               if (!(checkCallingArguments(child[property].func.value, 
                                    child[property].arguments.length,
                                    symbolTable))) { 
               
                    errorsMessage += "incorrect use of function '" + child[property].func.value + 
                                "' (it has not been declared or its call has a wrong number of arguments)" + "\n";                         
                }
           }
           
           if (Object.keys(child[property]).length > 1 && child[property].type != 'CALL') {
               searchChildInSymbolTable(child[property], symbolTable);
           }
       } 
 }
 
 /**
  * Se comprueba que todos los símbolos (constantes, variables y 
  * funciones) han sido declarados antes de su uso
  */
 var checkSymbolsDeclaration = (block) => {
     if (block.main.children == undefined) {
         errorsMessage += "missing block";
         return;
     }
     block.main.children.forEach((child) => {
        searchChildInSymbolTable(child, block.symbolTable);
     });
 }
 
 var semantic = (tree) => {
    console.log("\nen semantic.js");
    errorsMessage = "";
    // Construir la tabla de cada nodo y ver si hay redeclaraciones
    eachBlockPre(tree, addTableToBlock, null);
    eachBlockPre(tree, checkSymbolsDeclaration);
    console.log(errorsMessage);
    return errorsMessage;
 }
 
    module.exports = semantic; 
})();
 
