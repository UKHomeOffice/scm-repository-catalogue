interface BranchProtectionScore {}

interface VerifiedCommitsScore {}

interface CodeReviewScore {}

interface CodeManagementMaturityScore {
  score: number;

  branchProtection: BranchProtectionScore;

  verifiedCommits: VerifiedCommitsScore;

  codeReview: CodeReviewScore;
}

interface CommunityProfileScore {}

interface CommunityStandardsMaturityScore {
  score: number;

  communityProfile: CommunityProfileScore;
}

interface VisibilityScore {}

interface DiscoverableScore {}

interface UsageScore {}

interface RetentionScore {}

interface MaintainedScore {}

interface CollaborationScore {}

interface ReuseMaturityScore {
  score: number;

  visibility: VisibilityScore;

  discoverable: DiscoverableScore;

  usaage: UsageScore;

  retention: RetentionScore;

  maintained: MaintainedScore;

  collaboration: CollaborationScore;
}


interface DependenciesScore {}

interface SecurityIssuesScore {}

interface AccessManagementScore {}

interface SecurityMaturityScore {
  score: number;

  dependencies: DependenciesScore;

  securityIssues: SecurityIssuesScore;

  accessManagement: AccessManagementScore;
}

export interface MaturityPayload {
  [key: string]: {
    [key: string]: RepositoryMaturity
  }
}

export interface RepositoryMaturity {

  score: number;
  codeManagement?: CodeManagementMaturityScore;

  communityStandards?: CommunityStandardsMaturityScore;

  reuse?: ReuseMaturityScore;

  security?: SecurityMaturityScore;
}