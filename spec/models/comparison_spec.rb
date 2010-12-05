require 'spec_helper'

describe Comparison do
  
  describe "compare" do
    it "should be able to make a comparison with an exact multiple amount" do
      comparison_to_make = Comparison.new({:display_format=>'#{amount} ipads', :cost=>540.50})
      result = comparison_to_make.compare(54050)
      result.display.should == "100 ipads"
    end
  end
end
