require 'rest_client'

class HomeController < ApplicationController
	def initialize
		@queries = {:motorways => 
"SELECT *

  WHERE

    { 

      ?motorway  a   <http://dbpedia.org/ontology/Road>     .

      ?motorway <http://xmlns.com/foaf/0.1/name>    ?name  .

      ?motorway <http://dbpedia.org/ontology/length>    ?length

    }"}
	end
	def getthings 
		queryEscaped = CGI::escape(@queries[params[:dataset].intern]||@queries.first[1])
		puts  'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&should-sponge=&query=' + queryEscaped + '&format=text%2Fhtml&debug=on&timeout='
		res = RestClient.get 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&should-sponge=&query=' + queryEscaped + '&format=text%2Fhtml&debug=on&timeout='
				
		render :text=>res
	end
end
