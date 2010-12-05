class Comparison < ActiveRecord::Base
  class ComparisonResult
    attr_reader :display
    def initialize display
      @display = display
    end
  end
  def compare amount
    rendered = render_display Integer(amount/self.cost)
    return ComparisonResult.new rendered
  end
  def render_display amount
    result = eval("\"" + self.display_format + "\"")
  end
end
