# Quality roadmap

Civic Accord is a demonstration. A 10/10 claim in any category needs independent evidence, not a self-assigned score. The criteria below define what would make that claim reviewable.

| Area | Evidence needed before a top rating is credible |
| --- | --- |
| Value add | Observe target users complete a real bill-review task faster or with better understanding than their existing workflow; publish the study method and results. |
| Innovation | Compare the workflow with existing civic tools and document the distinct capability, its limits, and whether users benefit from it. |
| Helping community | Co-design with affected communities; measure reach, accessibility, comprehension, corrections, and whether their input can be traced to decisions without exposing private participation. |
| Design | Test mobile, keyboard, screen reader, low bandwidth, and plain-language use with representative participants; resolve critical failures. |
| Architecture | Ingest authoritative bill records with stable source links, versioning, validation, provenance, and an audit trail from input to output. Keep simulations isolated from verified records. |
| Modularity and extensibility | Define versioned interfaces for bill sources, impact models, participation methods, and report formats; demonstrate a second implementation of each without changing the core workflow. |
| Maintainability | Cover core calculations and user journeys with meaningful automated tests; enforce CI, dependency review, documented ownership, and reproducible deployments. |

## Delivery order

1. **Trustworthy prototype:** keep every sample, assumption, generated response, and unverified score visibly labeled. Make model calculations and exported reports consistent. This is the current stage.
2. **Verified bill pilot:** select one jurisdiction and one authoritative source. Store the source URL, retrieval date, version, and original text; show corrections and missing-data states. Do not derive real-world impact scores from sample coefficients.
3. **Community research:** recruit a diverse advisory group, obtain consent, and test whether residents can understand a bill, challenge an assumption, and see how feedback is used. Publish aggregate findings and accessibility issues.
4. **Operational safeguards:** review privacy, abuse resistance, accessibility, security, and model calibration with independent experts before accepting public submissions or making policy recommendations.
5. **Outcome evaluation:** compare decisions and comprehension against a baseline over time. Report negative findings and revise the product.

The current app should keep the word **prototype** until the relevant evidence exists. Passing a build or test suite establishes software behavior under test; it does not establish social benefit, fairness, legal validity, or policy accuracy.
