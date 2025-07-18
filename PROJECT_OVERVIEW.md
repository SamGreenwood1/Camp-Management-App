## Dynamic Camp Program and Activity Management System: A Comprehensive Solution for Modern Summer Camp Operations

This application is designed as a sophisticated, intuitive, and adaptable platform to fundamentally streamline how summer camps manage their programming and daily activities. Its core mission is to empower program directors, unit heads, and activity staff to create diverse, equitable, and smoothly executed experiences for all campers, without replacing existing camp registration systems.

**I. Core Concept & Objectives:**

The system aims to be the central hub for activity and program logistics, providing a flexible framework to handle the inherent complexities of a camp environment, such as fluctuating camper populations, dynamic scheduling needs, and diverse staff roles. It focuses on efficiency, equitability in camper experiences, and clear communication across camp leadership.

**II. Key Modules & Features:**

### A. Program Bank
This module serves as a centralized, living repository for all camp programs, from daily activities to evening events.
*   **Program Creation & Management**:
    *   **Program Entry Form**: A user-friendly interface for staff to submit new program ideas or detailed plans, capturing essential information like name, description, required activity area, and duration.
    *   **Configurable Predefined Program Templates**: Administrators can create and manage templates for common program types (e.g., "Arts & Crafts Session," "Sports Tournament"), pre-filling details to ensure consistency and accelerate program submission.
    *   **PDF Program Uploads**: Allows for the direct upload of detailed activity plans, lesson guides, and resource documents in PDF format, accommodating existing camp documentation.
    *   **Automated Bank Addition**: Programs that are accepted or scheduled for implementation are automatically added to the central Program Bank, making them discoverable and available for future reference.
*   **AI Program Processing (Ingestion Focus)**:
    *   Leverages AI to intelligently process uploaded PDFs and data from program entry forms. This feature is primarily for **initial ingestion** when setting up a camp's instance and migrating existing program records. Its purpose is to efficiently extract structured data from unstructured documents, reducing manual data entry for a camp's initial setup and historic program records.
    *   **Keyword Tagging**: Automatically identifies and tags programs with relevant themes, skills, or activity types (e.g., "arts & crafts," "outdoor skills," "team-building").
    *   **Supply Extraction**: Scans documents to identify and list required materials and supplies for each program, potentially cross-referencing with a pre-defined inventory or supply catalog.
    *   **Program Summarization**: Generates concise summaries of program objectives and activities, useful for quick overviews.
*   **Supply Requisitions**:
    *   Integrates directly with AI-extracted or manually entered supply lists. Program directors or activity specialists can generate and submit supply requisitions linked to specific programs.
    *   Includes a basic approval workflow for requisitions.
*   **Program Approval Workflow**:
    *   All "activity area programs" (daily activities) submitted to the Program Bank require explicit approval from the relevant **Activity Department Head** before they can be utilized in scheduling.

### B. Scheduling
This sophisticated module automates and assists in building the camp's daily and evening activity schedules.
*   **Daily Activity Area Scheduling (Programmatic)**:
    *   **Dynamic Cabin-to-Activity Area Assignment**: An intelligent algorithm programmatically assigns cabin groups to specific activity areas for each period of the day.
    *   **Hierarchical Cabin Designations**: The system natively understands and manages cabin groupings hierarchically: \( \text{Unit} \rightarrow \text{Gender} \rightarrow (\text{Optionally}) \text{Age Sub-Group} \rightarrow \text{Cabin} \). This structure informs how activities are assigned and how visitation frequencies are tracked.
    *   **Configurable Activity Frequency**: Allows camp administration to define how many times a cabin group should visit a particular activity area per week or per session, with the system striving to meet these targets programmatically.
    *   **Equitable Area Rotation**: A strict rule enforces that **every cabin group (including merged groups) is scheduled into every available activity area at least once per week** (or per defined cycle) to ensure a balanced and diverse experience for all campers.
    *   **Cabin Merging Support**: A critical feature, especially later in sessions. The system explicitly supports the merging of cabins within an age group as campers registered for shorter periods depart. When cabins merge, the system allows administrators to designate them as a single new "scheduling entity," automatically re-evaluating and adjusting the schedule for this newly formed group, ensuring they continue to meet their activity frequency targets and area rotations seamlessly.
    *   **Camper Choice Periods Integration**: Designated time slots allow campers to select their preferred activity from a pre-defined list. The scheduler manages capacity limits for these choice activities, ensuring they do not conflict with required rotations.
*   **Unit Evening Program (EP) Scheduling (Semi-Programmatic/Manual)**:
    *   Provides a flexible interface for Unit Heads or Program Directors to schedule evening activities, which may have different constraints than daily rotations.
    *   Supports manual drag-and-drop scheduling with basic conflict detection (e.g., same unit double-booked, or area already occupied).
    *   **Programming Group Assignments**: Unit Heads can assign general staff users (e.g., Councillors) to specific "programming groups" for the purpose of collaboratively planning and creating Evening Programs within their assigned unit.
    *   **Evening Program Approval**: All Evening Programs created or scheduled require explicit approval from the **Unit Head** before they are finalized and appear on the public schedule.
    *   **Optional Constraints on EP Planning**: Configurable options include enforcing that only one programming group per unit can run a specific Evening Program during a given period (preventing duplicates), and requiring each assigned programming group to create at least one Evening Program from scratch (fostering innovation).
*   **Staff Day Off Scheduling**: Allows staff to request days off, or unit heads to schedule them, with configurable restrictions (e.g., maximum staff off per unit/department per day, minimum staffing levels for critical roles). Staffing assignments based on the final schedule are handled outside this core component.

### C. General Features

*   **Progressive Web Application (PWA)**: The application is designed as a PWA, offering an installable, app-like experience on desktop and mobile devices. A key component of this is robust **offline support**, ensuring core functionalities and cached data remain accessible even in areas with limited internet connectivity, with changes syncing upon reconnection.
*   **Authentication & Authorization**:
    *   **Default Authentication**: Utilizes **Clerk** for robust and easy-to-implement user authentication (email/password, social logins).
    *   **Enterprise SSO Integration**: Offers optional integration with **WorkOS** to support Single Sign-On (SSO) for organizations requiring enterprise-grade authentication.
    *   **Camp Management Software SSO**: Includes provisions for SSO integration with major camp management software providers (e.g., CampMinder, CampDoc, Campwise), allowing staff to log in using their existing credentials from these systems (where supported by provider APIs).
*   **External System Integrations**: Provides robust API integration capabilities to sync crucial data (e.g., camper rosters, staff lists, definitive cabin assignments, enrollment periods, and hierarchical cabin structures) from major camp management software providers (e.g., CampMinder, CampDoc, Campwise). This ensures the app's data is always up-to-date with the camp's primary registration system.
*   **Role-Based Views**: Ensures granular access and tailored functionality for different user roles within the camp:
    *   **Administrator**: Manages user accounts, system-wide configuration, and overall oversight of camp-specific settings. Access to the dedicated Technical Admin Dashboard.
    *   **Program Director**: Comprehensive access to program bank management, global scheduling configuration, and oversight. Can approve system-wide settings, programs, and requisitions.
    *   **Unit Head**: Manages their specific unit's schedule, assigns programming groups for EPs, views program details relevant to their unit, and oversees counselors. Critically, **approves all Evening Programs** for their unit.
    *   **Activity Department Head**: Oversees a specific activity area (e.g., waterfront, arts & crafts). Can view and manage programs within their department, manage supply requisitions specific to their area, and **approves all activity area programs** submitted within their department.
    *   **Activity Specialist**: Views their assigned activities, manages their specific program entries in the bank, views supply requisitions for their activities. Submits new programs for Department Head approval.
    *   **Councillor**: Views their assigned cabin's daily schedule, accesses program details for scheduled activities, and contributes to evening program planning within their assigned programming group. Submits Evening Programs for Unit Head approval.
*   **Separate Technical Admin Dashboard**: A distinct, highly restricted dashboard for technical administrators. This interface manages service-related aspects of the application (e.g., database health, system logs, complex API integration settings, security configurations, and overall infrastructure monitoring), clearly separated from day-to-day camp operational management.
*   **Advanced Connectivity / Hardware Integration**:
    *   **Meshtastic Feature Provision**: The system architecture includes provisions for potential future integration with Meshtastic devices. The specific functionality (e.g., off-grid communication for staff, basic location tracking in remote areas, emergency alerts) is to be determined and implemented in a later phase, but the system is designed to accommodate this capability.

**III. Technical Stack Summary:**

The overriding philosophy is to provide a powerful, adaptable tool that enhances camp operations by automating complex processes and centralizing information, rather than attempting to replace a camp's entire existing registration infrastructure.

| Technology          | Role / Purpose                                                                       |
| :------------------ | :----------------------------------------------------------------------------------- |
| **Next.js**         | Primary framework for building the responsive and performant frontend user interface. |
| **TypeScript**      | Enhances code quality, maintainability, and developer experience for the frontend.     |
| **TanStack Query**  | Manages client-side data fetching, caching, and synchronization for UI components.     |
| **Supabase**        | Serves as the robust backend for the database (PostgreSQL), authentication, and potential serverless functions/Edge Functions. |
| **Clerk**           | Provides default, flexible user authentication services.                             |
| **WorkOS**          | Enables optional enterprise-grade Single Sign-On (SSO) capabilities.               |
| **UploadThing**     | Handles efficient and secure file uploads, particularly for PDF program documents.    |
| **AI Integration**  | For intelligent document processing (e.g., keyword tagging, supply extraction) during program ingestion. |
| **Python** (Optional)| Used for the core scheduling algorithm during initial independent testing and could be a candidate for a dedicated backend microservice for complex optimization. |
