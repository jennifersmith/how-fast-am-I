Feature: Comparing monentary values
  
  Scenario: Entering a monetary value and getting a basic comparison back
	Given the following comparisons exist:
		|name|cost|display_format|
		|Tuition fees|9000|Tuition fees for #{number} students|
		
    Given I am on the index page
    When I fill in "90000" for "comparison[amount]"
	And I press "Go"
	Then I should see "Tuition fees for 10 students"