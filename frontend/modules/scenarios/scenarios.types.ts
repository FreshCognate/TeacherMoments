interface Collaborator {
  user: string;
  role: 'OWNER' | 'AUTHOR';
}

export type Scenario = {
  _id: string,
  name: string,
  collaborators?: Collaborator[];
}