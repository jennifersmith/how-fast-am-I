Given /^the following indices:$/ do |indices|
  Index.create!(indices.hashes)
end

When /^I delete the (\d+)(?:st|nd|rd|th) index$/ do |pos|
  visit indices_path
  within("table tr:nth-child(#{pos.to_i+1})") do
    click_link "Destroy"
  end
end

Then /^I should see the following indices:$/ do |expected_indices_table|
  expected_indices_table.diff!(tableish('table tr', 'td,th'))
end
