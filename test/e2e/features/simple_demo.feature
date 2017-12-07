Feature: Simple Demo

  Background:
    Given I visit the proxy ui
    And I have no logged requests
    And I have no mocked responses
    And I wait a moment

  Scenario: Log requests
    Given I make multiple requests via the proxy
    And I wait a moment
    Then I expect to see all the requests made

  @mudi
  Scenario: Mock a request
    Given I make multiple requests via the proxy
    And I wait a moment
    And I click to select any one
    Then I should see the response body in a textarea
    When I update the textarea with JSON
    And click mock
    And I wait a moment
    Then I should see the mocked response above

  @wip
  Scenario: Verify the mock
    Given I have several mocked requests
    And I click to select any one
    Then I should see the mock response body
    When I make a matching request via the proxy
    Then I response body has been mocked
