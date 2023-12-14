TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 
- Total points committed vs done 
- Nr of hours planned vs spent (as a team)

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |         |    -   |            |              |
| n      |         |        |            |              |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases 
  - Coverage (if available)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review 
  - Total hours estimated 
  - Total hours spent
- Technical Debt management:
  - Total hours estimated : 4h
  - Total hours spent : 2h 40m
  - Hours estimated for remediation by SonarQube : 8d 4h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues : 1d 6h
  - Hours spent on remediation : 2h 20m / 1d 5h effort Sonar - Cloud
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") : 1.1%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  : reliability = C security: A maintainability: A

## ASSESSMENT

- What caused your errors in estimation (if any)?

- What lessons did you learn (both positive and negative) in this sprint?
    + POSITIVE: Common coding sessions are an excellent tool for quickly identifying and resolving bugs, as well as for learning new programming techniques.
    + NEGATIVE: Accumulating too many story points can be counterproductive, limiting (as some things may have been done hastily), and stressful for the mental health of team members.

- Which improvement goals set in the previous retrospective were you able to achieve? 
    + In this sprint, we committed to 10 user stories, totaling 26 story points, compared to just 6 in the previous sprint. We managed to successfully complete all the tasks we set out to accomplish.
    + In the two weeks that comprised this sprint, we held 2 technical meetings, which is twice the number compared to the two previous sprints. Additionally, during the last days before the delivery, we spent a significant amount of time collectively writing code in coding sessions where we supported each other.
  
- Which ones you were not able to achieve? Why?
    + As we had suspected, the workload for this sprint was quite substantial, and we couldn't dedicate as much time as we would have liked to the refactoring of all the e2e tests. The reformatting process of these tests began, but halfway through the sprint, we realized it would consume too much time. Therefore, we decided not to address this technical debt for this sprint.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    + Complete the refactoring of the e2e tests
        > Since this sprint will last approximately twice as long as the previous ones, this could be a good opportunity to finally complete the refactoring of the e2e tests once and for all.
    + Refactor the documentation
        > Our project has comprehensive and thorough documentation. However, it has a small flaw: during various sprints, each team member wrote information about their code with a style different from everyone else's. One of the goals for this sprint is to give the entire documentation a well-defined format.
    + Handle the Sonar Cloud technical debt analyses more effectively.
        > As mentioned earlier, in this sprint, we committed a large number of story points, and although we managed to complete all the work, the timelines were very tight, leading us to perform some tasks superficially. One of these tasks was the analysis of technical debt through Sonar Cloud, for which we couldn't allocate much resources. For the next sprint, we want to spend much more time on managing technical debt.

- One thing you are proud of as a Team!!