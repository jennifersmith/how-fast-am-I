Feature: Comparing monentary values
  
  Scenario: Entering a monetary value and getting a basic comparison back
    Given I am on the index page
    When I fill in "90000" for "comparison[amount]"
	And I press "Go"
	Then I should see "Tuition fees for 9000 students"