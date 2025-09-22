export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'failed' | 'executed';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  endDate: Date;
  executionDate?: Date;
}

export interface Vote {
  proposalId: string;
  voter: string;
  vote: 'for' | 'against';
  votingPower: number;
  timestamp: Date;
}

export interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  totalVotes: number;
  userVotingPower: number;
}

export interface VotingPower {
  total: number;
  breakdown: {
    tokenHolding: number;
    stakingBonus: number;
    delegated: number;
  };
}

export interface ProposalFilter {
  status?: 'active' | 'passed' | 'failed' | 'executed';
  sortBy: 'date' | 'votes' | 'quorum';
  sortOrder: 'asc' | 'desc';
}

export type VoteChoice = 'for' | 'against';

export interface GovernanceAction {
  type: 'vote' | 'delegate' | 'undelegate';
  proposalId?: string;
  vote?: VoteChoice;
  delegatee?: string;
}