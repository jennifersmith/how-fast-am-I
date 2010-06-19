# Static site using Rack (with expire headers and etag support)... great for hosting static sites on Heroku


require 'rack/contrib'
require 'rack-rewrite'

use Rack::StaticCache, :urls => ['/images','/css','/favicon.ico'], :root => "public"
use Rack::ETag
use Rack::Rewrite do
  rewrite '/', '/index.html'
end
run Rack::Directory.new('public')
