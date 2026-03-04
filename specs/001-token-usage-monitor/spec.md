# Feature Specification: Multi-Platform AI Token Usage Monitor

**Feature Branch**: `001-token-usage-monitor`
**Created**: 2026-03-03
**Status**: Draft
**Input**: User description: "实现一个网页，能支持监控我的ark、zai、minimax，claude账号的token限额使用情况"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Current Token Usage Across All Platforms (Priority: P1)

As a user with accounts on multiple AI platforms, I want to see a unified view of my token usage across all my accounts so that I can quickly understand my overall consumption status without checking each platform individually.

**Why this priority**: This is the core value proposition - without visibility across all platforms in one place, users must manually check each platform, defeating the purpose of the monitoring tool.

**Independent Test**: Can be fully tested by adding API credentials for one or more platforms and verifying that token usage data is displayed correctly on the dashboard. Delivers immediate value by consolidating scattered information into a single view.

**Acceptance Scenarios**:

1. **Given** I have added API credentials for at least one platform, **When** I open the dashboard, **Then** I see a summary showing current token usage and remaining quota for each configured platform
2. **Given** I have API credentials stored, **When** the dashboard loads, **Then** token usage data is displayed within 5 seconds
3. **Given** a platform's API returns usage data, **When** displaying the data, **Then** I see both used tokens and total quota with percentage remaining

---

### User Story 2 - Add and Manage Platform API Credentials (Priority: P2)

As a user, I want to securely add and manage API credentials for each AI platform so that the monitoring system can fetch my token usage data.

**Why this priority**: Without credential management, there's no data to monitor. This enables the core functionality but depends on Story 1 for the actual display.

**Independent Test**: Can be fully tested by adding, editing, and removing credentials for various platforms. Delivers value by establishing the data source for monitoring.

**Acceptance Scenarios**:

1. **Given** I am on the settings page, **When** I add valid API credentials for a supported platform, **Then** the credentials are stored and can be used to fetch usage data
2. **Given** I have existing credentials, **When** I update them, **Then** subsequent data fetches use the new credentials
3. **Given** I have added invalid credentials, **When** the system attempts to fetch data, **Then** I see an error message indicating which platform has invalid credentials
4. **Given** I no longer want to monitor a platform, **When** I remove its credentials, **Then** the platform is removed from the dashboard

---

### User Story 3 - Receive Usage Threshold Alerts (Priority: P3)

As a user, I want to be notified when my token usage approaches or exceeds defined thresholds so that I can take action (purchase more tokens, reduce usage, or switch platforms) before running out.

**Why this priority**: Alerts add proactive value but the core monitoring function (viewing usage) works without them. This is an enhancement that improves user experience.

**Independent Test**: Can be fully tested by setting threshold values and triggering alert conditions. Delivers value by preventing unexpected service interruptions.

**Acceptance Scenarios**:

1. **Given** I have set an alert threshold at 80% usage for a platform, **When** my usage exceeds 80%, **Then** I see a visual warning indicator on the dashboard
2. **Given** I have configured multiple thresholds (e.g., warning at 70%, critical at 90%), **When** usage crosses each threshold, **Then** the appropriate warning level is displayed
3. **Given** I have set thresholds, **When** I edit or remove them, **Then** the alert behavior changes accordingly

---

### User Story 4 - View Historical Usage Trends (Priority: P4)

As a user, I want to see historical token usage trends over time so that I can understand my consumption patterns and plan my API usage more effectively.

**Why this priority**: Historical analysis provides insights for planning but is not essential for day-to-day monitoring. The core functionality works without this feature.

**Independent Test**: Can be fully tested by recording usage data over time and viewing the trends display. Delivers value by enabling informed decision-making about API usage.

**Acceptance Scenarios**:

1. **Given** usage data has been collected for at least 7 days, **When** I view the trends section, **Then** I see a visual representation of usage changes over time
2. **Given** I have multiple platforms configured, **When** viewing trends, **Then** I can compare usage patterns between platforms
3. **Given** I select a custom date range, **When** viewing trends, **Then** the display updates to show only data from that period

---

### Edge Cases

- What happens when a platform's API is temporarily unavailable or rate-limited?
  - System should display the last known data with a timestamp indicator and a "data stale" warning
- How does the system handle expired or revoked API credentials?
  - System should display an error message indicating which platform needs attention
- What happens when token usage data returned by an API is incomplete or malformed?
  - System should display partial data where available and indicate which data points could not be retrieved
- How does the system handle platforms with different token limit types (daily, monthly, cumulative)?
  - System should display the limit type clearly and calculate remaining tokens based on the appropriate reset period
- What happens when a user has multiple accounts on the same platform?
  - System should support adding multiple credential sets for the same platform, each tracked independently
- What happens when token usage exceeds 100% (overage)?
  - System should display usage accurately even when over quota, with clear indication of overage amount

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display token usage information for each configured platform including: used tokens, total quota, remaining tokens, and percentage used
- **FR-002**: System MUST support adding, editing, and removing API credentials for the following platforms: Ark, Zai, MiniMax, and Claude
- **FR-003**: System MUST store API credentials securely using browser's secure storage mechanism
- **FR-004**: System MUST fetch current token usage data from each platform's API on demand
- **FR-005**: System MUST support manual refresh of token usage data for all platforms or individual platforms
- **FR-006**: System MUST display visual indicators (colors, icons) when usage exceeds configurable warning thresholds
- **FR-007**: System MUST allow users to configure custom usage thresholds (e.g., warning at 70%, critical at 90%)
- **FR-008**: System MUST show the last update timestamp for each platform's usage data
- **FR-009**: System MUST display appropriate error messages when API credentials are invalid or API requests fail
- **FR-010**: System MUST support tracking multiple accounts for the same platform independently
- **FR-011**: System MUST handle different token limit types (daily, monthly, cumulative) and display them clearly
- **FR-012**: System MUST support only platforms that provide programmatic API access for token usage data (no manual entry support)
- **FR-013**: System MUST display usage trends over time with at least 7 days of historical data
- **FR-014**: System MUST persist historical usage data locally between sessions
- **FR-015**: System MUST support filtering trends by platform, date range, or account

### Key Entities

- **Platform Account**: Represents a single API account on a specific AI platform (Ark, Zai, MiniMax, or Claude). Key attributes include: platform name, account identifier/label, API credentials, current usage, total quota, limit type (daily/monthly/cumulative), last update timestamp.

- **Usage Record**: Represents a snapshot of token usage at a specific point in time. Key attributes include: timestamp, platform account reference, tokens used, tokens remaining, quota total.

- **Threshold Configuration**: Represents user-defined alert thresholds for a specific platform account. Key attributes include: platform account reference, warning percentage (e.g., 70%), critical percentage (e.g., 90%), whether notifications are enabled.

- **Credential Data**: Represents the authentication information required to access a platform's API. Stored securely with attributes: platform type, account identifier, encrypted credential value, validity status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view token usage across all configured platforms on a single dashboard page that loads within 3 seconds
- **SC-002**: Users can add or modify API credentials for any supported platform in under 60 seconds
- **SC-003**: Token usage data reflects the most recent API call with clear indication of data freshness (timestamp displayed for each platform)
- **SC-004**: 95% of users successfully configure their first platform account without requiring external documentation or support
- **SC-005**: Users can identify which platforms are approaching or exceeding quota within 5 seconds of opening the dashboard (through visual indicators)
- **SC-006**: The system supports tracking at least 10 platform accounts simultaneously without performance degradation
- **SC-007**: Manual refresh of usage data for all platforms completes within 10 seconds under normal network conditions
- **SC-008**: Historical trends display data for at least the past 30 days without requiring additional configuration
- **SC-009**: Error messages clearly indicate the problem and recommended action for 90% of common failure scenarios (invalid credentials, API unavailable, rate limiting)

## Assumptions

- Users have valid API credentials for each platform they wish to monitor
- Each platform (Ark, Zai, MiniMax, Claude) provides an API endpoint for querying token usage
- Users are comfortable storing API credentials in their browser's local storage for this personal monitoring tool
- Token limits are measured in standard token units (tokens) across all platforms
- Network connectivity is available when fetching usage data (cached data is shown when offline)
- Users are monitoring their own personal or organization accounts, not third-party accounts
- The platform APIs have rate limits that should be respected when fetching usage data
