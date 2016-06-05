module.exports = function(app){
    var TData = require('./t_data');
    
    //Extraer datos de la db
    findAll = function(req, res){
      TData.find(function(err, database){
          if(!err) res.send(database);
          else console.log('ERROR: ' + err);
      });  
    };
    
    findByID = function(req, res){
        TData.findById(req.params.id,  function(err, data){
            if(!err) res.send(data);
            else console.log('ERROR: ' + err);
        });
    };
    
    findByName = function(req, res){
        TData.find({name: req.params.name}, function(err, data){
            if(!err){ 
                res.send(data[0].content);
            }
            else console.log('ERROR: ' + err);
        });
    };
    
    //Insertar datos a la db
    addData = function(req, res){
        console.log('Añadiendo');
        console.log(req.body);
        console.log(req);
        
        var data = new TData({
            name: req.body.name,
            content: req.body.content
        });
        
        data.save(function(err){
            if(err) console.log('ERROR: Cant save. ' + err);
            else console.log('Added new input');
        });
        
        res.send(data);
    };
    
    app.get('/data', findAll);
    app.get('/dataid/:id', findByID);
    app.get('/dataname/:name', findByName);
    app.post('/datadd', addData);
    
}