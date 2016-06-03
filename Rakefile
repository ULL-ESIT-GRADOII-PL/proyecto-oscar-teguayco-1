task :default => :web

desc "Compilar la gramática para la web"
task :web do
    sh "pegjs -e pl0 ./lib/pl0.pegjs ./public/pl0.js"
end