export type Stem = {
  _id: string,
  type: 'stem',
  ref: string,
  scenario: string,
  name: string,
  description: string,
  stemRef: string,
  slideRef: string,
  isRoot: boolean,
  sortOrder: number,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string,
  isDeleted: boolean,
  deletedAt: Date,
  deletedBy: string
}