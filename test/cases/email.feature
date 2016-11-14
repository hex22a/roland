Feature: Sending e-mail

  Scenario Outline: Sending e-mail with existing site
    When Site sends HTTP POST with siteId: <siteId> and safe html code: <html>
    Then Participant (admin) gets an email
    And Server answers with 200 HTTP code