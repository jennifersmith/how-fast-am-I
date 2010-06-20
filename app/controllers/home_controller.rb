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

    }",
    :escapes =>"SELECT *

  WHERE

    { 
     ?stuff <http://dbpedia.org/property/name> ?name .

      ?stuff <http://dbpedia.org/property/escapeVelocity>    ?value 

    }",
    :telly => "SELECT distinct  ?stuff, ?episodes, ?runtime, ?name

  WHERE

    { 
     ?stuff <http://dbpedia.org/property/name> ?name .

      ?stuff <http://dbpedia.org/property/numEpisodes>    ?episodes .
      ?stuff <http://dbpedia.org/ontology/runtime> ?runtime

    }
  ",
  :mountains=>"SELECT distinct  ?stuff, ?name, ?value, ?page
  WHERE

    { 
    ?stuff <http://xmlns.com/foaf/0.1/page> ?page .
     ?stuff a <http://dbpedia.org/ontology/Mountain> .
     ?stuff <http://dbpedia.org/property/name> ?name .

      ?stuff <http://dbpedia.org/property/elevationM>    ?value 

    }
  "
  }
	end
	def getthings 
		queryEscaped = CGI::escape(@queries[params[:dataset].intern]||@queries.first[1])
		res = RestClient.get 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&should-sponge=&query=' + queryEscaped + '&format=application%2Fjson&debug=on&timeout='
		if(res.respond_to? :body)
			result = JSON.parse(res.body)
		else 
			result = res
		end
		render_json result
	end
	 def render_json(json, options={})
      callback, variable = params[:callback], params[:variable]
      response = begin
        if callback && variable
          "var #{variable} = #{json};\n#{callback}(#{variable});"
        elsif variable
          "var #{variable} = #{json};"
        elsif callback
          "#{callback}(#{json});"
        else
          json
        end
      end
      render({:content_type => :js, :text => response}.merge(options))
    end
end
