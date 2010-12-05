Given /^the following comparisons exist:$/ do |table|
  Comparison.create(table.hashes)
end
