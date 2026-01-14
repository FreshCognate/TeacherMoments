import { Cohort } from "../cohorts/cohorts.types"

export interface User {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  role: 'SUPER_ADMIN' | 'ADMIN' | 'FACILITATOR' | 'RESEARCHER' | 'PARTICIPANT',
  isAgent: boolean,
  cohorts: Cohort[]
}