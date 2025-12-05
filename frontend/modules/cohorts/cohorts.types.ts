export interface Cohort {
  _id: string,
  name: string,
  invites: Invite[]
}

export interface Invite {
  token: string,
  isActive: boolean,
  expiresAt: Date,
  createdAt: Date
  createdBy: string
}