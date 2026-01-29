interface Collaborator {
  user: string | { _id: string };
  role: 'OWNER' | 'AUTHOR';
}

export interface Cohort {
  _id: string,
  name: string,
  invites: Invite[],
  collaborators?: Collaborator[];
}

export interface Invite {
  token: string,
  isActive: boolean,
  expiresAt: Date,
  createdAt: Date
  createdBy: string
}