require 'rest_client'
require 'json'

class HomeController < ApplicationController
	def initialize
		@queries = {:lines => 
"SELECT *

  WHERE

    { 
     ?stuff <http://dbpedia.org/property/name> ?name .

      ?stuff <http://dbpedia.org/property/linelength>    ?value 

    }"}
	end
	def getthings 
		queryEscaped = CGI::escape(@queries[params[:dataset].intern]||@queries.first[1])
		res = RestClient.get 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&should-sponge=&query=' + queryEscaped + '&format=application%2Fjson&debug=on&timeout='
		if(res.respond_to? :body)
			result = JSON.parse(res.body)
		else 
			result = res
		end
		render :json=>result
	end
end
