Feature: Simple Demo

  Background:
    Given I visit the proxy ui
    And I have no logged requests
    And I have no mocked responses

  Scenario: Log requests
    Given I make multiple requests to via the proxy
    Then I expect to see all the requests made

  Scenario: Mock a request
    Given I have several logged requests
    And I click to select any one
    Then I should see the response body in a textarea
    When I update the textarea with JSON
    And click mock
    Then I should see the mocked response above

  Scenario: Verify the mock
    Given I have several mocked requests
    And I click to select any one
    Then I should see the mock response body
    When I make a matching request via the proxy
    Then I response body has been mocked
