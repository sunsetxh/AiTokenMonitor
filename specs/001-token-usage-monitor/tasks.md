# Tasks: Multi-Platform AI Token Usage Monitor

**Input**: Design documents from `/specs/001-token-usage-monitor/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: This feature spec does not explicitly require TDD. Tests are optional and not included in the task list.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure: src/{components,services,models,utils}, tests, public
- [x] T002 Initialize Vite + React 18 + TypeScript project with npm
- [x] T003 [P] Install and configure Tailwind CSS with dark mode support
- [x] T004 [P] Install dependencies: dexie, recharts, axios, react-router-dom
- [x] T005 [P] Configure TypeScript with strict mode and path aliases (@/components, @/services, @/models, @/utils)
- [x] T006 [P] Create ESLint and Prettier configuration files
- [x] T007 Create public/index.html with meta tags and root div
- [x] T008 [P] Create environment configuration template (.env.example) with API_TIMEOUT, FETCH_INTERVAL, RETENTION_DAYS, DEBUG flags

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create base type definitions in src/models/types.ts (PlatformType, LimitType, CredentialStatus, UsageData, CredentialFormat)
- [x] T010 Implement Dexie.js database schema in src/services/storage/database.ts (TokenMonitorDB with 4 tables)
- [x] T011 [P] Implement encryption service in src/services/crypto/encryption.ts using Web Crypto API for credential storage
- [x] T012 [P] Implement storage service in src/services/storage/storage-service.ts (CRUD operations for all entities)
- [x] T013 Create platform adapter base interface in src/services/platform/base.ts (PlatformAdapter interface with all required methods)
- [x] T014 [P] Implement error classes in src/models/errors.ts (PlatformAdapterError, AuthenticationError, NetworkError, RateLimitError, ValidationError, ParseError, StorageError, NotFoundError, DuplicateError)
- [x] T015 [P] Create utility functions in src/utils/date.ts (formatTimestamp, calculateDataFreshness, isStale)
- [x] T016 [P] Create utility functions in src/utils/validation.ts (validateUUID, validatePercentage, validateAccountLabel)
- [x] T017 Create App.tsx with routing structure and main layout shell
- [x] T018 Create global context providers in src/contexts/AppContext.tsx for shared state management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Current Token Usage Across All Platforms (Priority: P1) 🎯 MVP

**Goal**: Display unified dashboard showing token usage for all configured platforms with used/total/remaining values and visual indicators

**Independent Test**: Add API credentials for one platform, open dashboard, verify usage data displays correctly within 5 seconds

### Implementation for User Story 1

- [x] T019 [P] [US1] Create PlatformAccount interface in src/models/PlatformAccount.ts
- [x] T020 [P] [US1] Create UsageRecord interface in src/models/UsageRecord.ts
- [x] T021 [P] [US1] Create CurrentUsageView interface in src/models/CurrentUsageView.ts
- [x] T022 [US1] Implement mock Claude platform adapter in src/services/platform/claude.ts (implements PlatformAdapter with mock data)
- [x] T023 [P] [US1] Implement usage fetch service in src/services/usage/usage-fetcher.ts (orchestrate parallel fetches from all platforms)
- [x] T024 [US1] Implement usage aggregation service in src/services/usage/usage-aggregator.ts (calculate usagePercent, status, dataFreshness)
- [x] T025 [P] [US1] Create Dashboard component shell in src/components/dashboard/Dashboard.tsx
- [x] T026 [P] [US1] Create UsageCard component in src/components/dashboard/UsageCard.tsx (displays single platform usage with progress bar)
- [x] T027 [P] [US1] Create RefreshButton component in src/components/common/RefreshButton.tsx (manual refresh with loading state)
- [x] T028 [P] [US1] Create StatusBadge component in src/components/common/StatusBadge.tsx (normal/warning/critical visual indicators)
- [x] T029 [P] [US1] Create LoadingSpinner component in src/components/common/LoadingSpinner.tsx
- [x] T030 [P] [US1] Create ErrorMessage component in src/components/common/ErrorMessage.tsx (error display with retry action)
- [x] T031 [US1] Implement Dashboard page in src/components/dashboard/DashboardPage.tsx (integrates all components, handles refresh logic)
- [x] T032 [US1] Add dashboard route to App.tsx routing configuration
- [x] T033 [US1] Implement auto-refresh polling in src/services/usage/auto-refresh.ts (configurable interval, respects manual refresh)

**Checkpoint**: At this point, User Story 1 should be fully functional - add mock credential, see dashboard with usage data

---

## Phase 4: User Story 2 - Add and Manage Platform API Credentials (Priority: P2)

**Goal**: Allow users to securely add, edit, remove, and validate API credentials for all supported platforms

**Independent Test**: Navigate to settings, add credential for a platform, verify it's stored and usable for fetching data

### Implementation for User Story 2

- [x] T034 [P] [US2] Create CredentialData interface in src/models/CredentialData.ts
- [x] T035 [P] [US2] Create ThresholdConfig interface in src/models/ThresholdConfig.ts
- [x] T036 [US2] Implement credential validation service in src/services/credentials/credential-validator.ts (calls platform validateCredentials)
- [x] T037 [US2] Implement credential encryption/decryption wrapper in src/services/credentials/credential-manager.ts (integrates encryption service with storage)
- [x] T038 [P] [US2] Create CredentialForm component in src/components/credentials/CredentialForm.tsx (form with platform selector, credential input, validation)
- [x] T039 [P] [US2] Create CredentialList component in src/components/credentials/CredentialList.tsx (displays all configured accounts with edit/delete actions)
- [x] T040 [P] [US2] Create CredentialCard component in src/components/credentials/CredentialCard.tsx (single credential display with status indicator)
- [x] T041 [P] [US2] Create PlatformSelector component in src/components/credentials/PlatformSelector.tsx (dropdown with platform logos and names)
- [x] T042 [P] [US2] Create CredentialInputDialog component in src/components/credentials/CredentialInputDialog.tsx (modal for adding/editing credentials)
- [x] T043 [P] [US2] Create DeleteConfirmationDialog component in src/components/common/DeleteConfirmationDialog.tsx
- [x] T044 [US2] Implement credentials page in src/components/credentials/CredentialsPage.tsx (integrates all credential components)
- [x] T045 [US2] Add credentials route to App.tsx navigation (add to header/sidebar nav)
- [x] T046 [US2] Integrate credential manager with dashboard in src/components/dashboard/DashboardPage.tsx (fetch credentials, pass to usage fetcher)

**Checkpoint**: User Stories 1 AND 2 should both work - add real credential, see real data on dashboard

---

## Phase 5: User Story 3 - Receive Usage Threshold Alerts (Priority: P3)

**Goal**: Display visual warnings when usage exceeds configured thresholds (warning/critical levels)

**Independent Test**: Set threshold at 80%, trigger usage above 80%, verify visual warning appears on dashboard

### Implementation for User Story 3

- [x] T047 [P] [US3] Create ThresholdConfigEditor component in src/components/thresholds/ThresholdConfigEditor.tsx (sliders for warning/critical percentages)
- [x] T048 [P] [US3] Create ThresholdConfigDialog component in src/components/thresholds/ThresholdConfigDialog.tsx (modal for editing thresholds)
- [x] T049 [US3] Implement threshold checking service in src/services/alerts/threshold-checker.ts (compare usage against thresholds, return status)
- [x] T050 [US3] Integrate threshold checker with UsageCard in src/components/dashboard/UsageCard.tsx (apply status styles based on threshold)
- [x] T051 [US3] Integrate threshold checker with StatusBadge in src/components/common/StatusBadge.tsx (display warning/critical state)
- [x] T052 [US3] Add threshold config button to CredentialCard in src/components/credentials/CredentialCard.tsx
- [x] T053 [US3] Implement default threshold creation in src/services/credentials/credential-manager.ts (auto-create 70%/90% defaults when adding credential)
- [x] T054 [US3] Add threshold info to CurrentUsageView calculation in src/services/usage/usage-aggregator.ts

**Checkpoint**: All user stories should now be independently functional - thresholds configured, warnings displaying

---

## Phase 6: User Story 4 - View Historical Usage Trends (Priority: P4)

**Goal**: Display historical usage trends over time with filtering by platform, date range, and account

**Independent Test**: View trends page, verify chart displays for 7+ days of data, filter by platform and date range

### Implementation for User Story 4

- [x] T055 [P] [US4] Create TrendsPage shell in src/components/trends/TrendsPage.tsx
- [x] T056 [P] [US4] Create UsageChart component in src/components/trends/UsageChart.tsx (Recharts line chart for usage over time)
- [x] T057 [P] [US4] Create PlatformFilter component in src/components/trends/PlatformFilter.tsx (multi-select checkbox for platforms)
- [x] T058 [P] [US4] Create DateRangePicker component in src/components/trends/DateRangePicker.tsx (preset buttons + custom range)
- [x] T059 [P] [US4] Create TrendStats component in src/components/trends/TrendStats.tsx (summary stats: avg usage, peak, total)
- [x] T060 [US4] Implement trends data service in src/services/trends/trends-data.ts (fetch UsageRecords by time range, aggregate by platform)
- [x] T061 [US4] Implement historical data recording in src/services/usage/usage-fetcher.ts (save UsageRecord after each fetch)
- [x] T062 [US4] Add trends route to App.tsx navigation
- [x] T063 [US4] Implement data cleanup scheduler in src/services/storage/cleanup-scheduler.ts (hourly cleanup of old records per retention policy)
- [x] T064 [US4] Add navigation link to trends page from dashboard header

**Checkpoint**: All user stories complete - full-featured token monitoring application

---

## Phase 7: Platform Adapter Implementations

**Purpose**: Implement real platform adapters for all 4 supported platforms

**Note**: These can be developed in parallel after Phase 2 (Foundational) is complete

- [x] T065 [P] Implement Ark platform adapter in src/services/platform/ark.ts (implements PlatformAdapter, calls Ark API)
- [x] T066 [P] Implement Zai platform adapter in src/services/platform/zai.ts (implements PlatformAdapter, calls Zai API)
- [x] T067 [P] Implement MiniMax platform adapter in src/services/platform/minimax.ts (implements PlatformAdapter, calls MiniMax API with Group ID support)
- [x] T068 [P] Implement Claude platform adapter in src/services/platform/claude.ts (implements PlatformAdapter, calls Anthropic API for usage)
- [x] T069 Create platform registry in src/services/platform/registry.ts (exports map of all adapters by platform type)
- [x] T070 Create platform logos in public/logos/ directory (ark.svg, zai.svg, minimax.svg, claude.svg)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T071 [P] Create README.md with setup instructions, feature overview, and development guide
- [x] T072 [P] Add responsive design breakpoints for mobile/tablet in Tailwind configuration
- [x] T073 [P] Implement error boundary in src/components/common/ErrorBoundary.tsx
- [x] T074 Add keyboard shortcuts (R for refresh, C for credentials, T for trends) in src/utils/keyboard-shortcuts.ts
- [x] T075 [P] Create favicon and app icons for PWA support
- [x] T076 [P] Add loading skeleton screens for better perceived performance
- [x] T077 Implement toast notification system for success/error messages in src/components/common/Toast.tsx
- [x] T078 Add data export/import functionality in src/services/storage/data-export.ts (backup/restore user data)
- [x] T079 [P] Create About/Help page with documentation links in src/components/about/AboutPage.tsx
- [x] T080 Perform accessibility audit (ARIA labels, keyboard navigation, screen reader support)
- [x] T081 Performance optimization: lazy load routes, code splitting for platform adapters
- [x] T082 Add PWA manifest and service worker for offline capability
- [x] T083 Run quickstart.md validation and fix any issues
- [ ] T084 Final testing across all supported browsers (Chrome, Firefox, Safari, Edge)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T008) - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion (T009-T018)
- **Platform Adapters (Phase 7)**: Depends on Foundational phase - can run in parallel with user stories
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Integrates with US1 (dashboard displays credentials)
- **User Story 3 (P3)**: Can start after Foundational - Extends US1 dashboard cards, uses US2 credentials
- **User Story 4 (P4)**: Can start after Foundational - Integrates with US1/US2 data, standalone UI

### Within Each User Story

- Type definitions can be created in parallel (marked [P])
- Service layer before UI components
- UI components can often be created in parallel (different files)
- Integration/wiring happens after individual components exist
- Story complete before moving to next priority

### Parallel Opportunities

**Setup Phase (T001-T008)**:
- T003, T004, T005, T006 can run in parallel

**Foundational Phase (T009-T018)**:
- T011, T012, T015, T016, T017 can run in parallel (after T009, T010)

**User Story 1**:
- T019, T020, T021 can run in parallel
- T023 can run after T022
- T025-T030 can run in parallel
- T031 integrates T025-T030

**User Story 2**:
- T034, T035 can run in parallel
- T038-T041 can run in parallel (after T034-T037)
- T044 integrates T038-T042

**User Story 3**:
- T047, T048 can run in parallel
- T049, T053 can run in parallel

**User Story 4**:
- T055-T059 can run in parallel
- T060 depends on data model

**Platform Adapters (Phase 7)**:
- T065-T068 can all run in parallel (4 different files)

**Polish Phase**:
- Most tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch type definitions together:
T019 [P] [US1] Create PlatformAccount interface in src/models/PlatformAccount.ts
T020 [P] [US1] Create UsageRecord interface in src/models/UsageRecord.ts
T021 [P] [US1] Create CurrentUsageView interface in src/models/CurrentUsageView.ts

# After T022 (platform adapter), launch service:
T023 [P] [US1] Implement usage fetch service in src/services/usage/usage-fetcher.ts

# Launch all UI components together:
T025 [P] [US1] Create Dashboard component shell in src/components/dashboard/Dashboard.tsx
T026 [P] [US1] Create UsageCard component in src/components/dashboard/UsageCard.tsx
T027 [P] [US1] Create RefreshButton component in src/components/common/RefreshButton.tsx
T028 [P] [US1] Create StatusBadge component in src/components/common/StatusBadge.tsx
T029 [P] [US1] Create LoadingSpinner component in src/components/common/LoadingSpinner.tsx
T030 [P] [US1] Create ErrorMessage component in src/components/common/ErrorMessage.tsx

# Finally integrate:
T031 [US1] Implement Dashboard page in src/components/dashboard/DashboardPage.tsx
```

---

## Parallel Example: Platform Adapters (Phase 7)

```bash
# All 4 platform adapters can be developed simultaneously:

T065 [P] Implement Ark platform adapter in src/services/platform/ark.ts
T066 [P] Implement Zai platform adapter in src/services/platform/zai.ts
T067 [P] Implement MiniMax platform adapter in src/services/platform/minimax.ts
T068 [P] Implement Claude platform adapter in src/services/platform/claude.ts

# Then create registry:
T069 Create platform registry in src/services/platform/registry.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T018) - CRITICAL
3. Complete Phase 3: User Story 1 (T019-T033) - use mock adapter
4. **STOP and VALIDATE**: Add mock credential, open dashboard, verify usage displays
5. Deploy/demo MVP

### Incremental Delivery

1. **MVP**: Setup + Foundational + US1 → Basic dashboard with mock data
2. **v0.2**: Add US2 → Real credentials, real data flow
3. **v0.3**: Add US3 → Threshold alerts and warnings
4. **v0.4**: Add US4 → Historical trends and analytics
5. **v1.0**: Platform adapters + Polish → Production-ready

### Parallel Team Strategy

With multiple developers after Foundational phase:

- **Developer A**: User Story 1 dashboard components
- **Developer B**: User Story 2 credential management
- **Developer C**: Platform adapters (all 4 in parallel)
- **Developer D**: User Stories 3-4 (after 1-2 stabilize)

---

## Summary

| Phase | Task Count | Description |
|-------|------------|-------------|
| Phase 1: Setup | 8 tasks | Project initialization, dependencies, configuration |
| Phase 2: Foundational | 10 tasks | Types, storage, encryption, base interfaces, utilities |
| Phase 3: US1 - Dashboard | 15 tasks | Display current usage across all platforms |
| Phase 4: US2 - Credentials | 13 tasks | Manage API credentials for platforms |
| Phase 5: US3 - Alerts | 8 tasks | Threshold-based visual warnings |
| Phase 6: US4 - Trends | 10 tasks | Historical usage charts and filtering |
| Phase 7: Platform Adapters | 6 tasks | Real API integrations for 4 platforms |
| Phase 8: Polish | 14 tasks | Documentation, optimization, PWA, accessibility |
| **Total** | **84 tasks** | Full feature implementation |

**MVP Scope (Phases 1-3)**: 33 tasks - Core dashboard functionality

**Parallel Opportunities**: 37 tasks marked [P] can run in parallel within their phases

---

## Notes

- [P] tasks = different files, no dependencies within the phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Platform adapters (Phase 7) can be developed with mock implementations initially
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Mock Claude adapter in T022 enables US1 development before real API integration
