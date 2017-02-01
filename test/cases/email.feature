Feature: Sending e-mail

  Scenario: Register Admin
    Given I send POST request to register with adminEM@test.test and 123456 to register
    And I send POST request to login with username: adminEM@test.test and password: 123456
    And User adds site with name: superSite, url: someUrl, destinations: mail@test.test;mail2@test.test, SMTP login: foo, SMTP Password: bar

  Scenario Outline: Sending e-mail with existing site
    When Site sends HTTP POST with JWT auth header, subject <subject> - op, text: <text> and safe html code: <html> - op
    Examples:
      | subject | text | html  |
      | someSbj1| txt1 | html1 |
      | someSbj2| txt2 | html2 |