import { Discipline } from '../constants/endpoints'

export const mockDisciplines = (needsTrainingSetEndpoint = false): Discipline[] => [
  {
    id: 1,
    title: 'First Discipline',
    description: 'Description1',
    icon: 'none',
    numberOfChildren: 1,
    isLeaf: false,
    parentTitle: null,
    needsTrainingSetEndpoint,
    leafDisciplines: [10, 11],
  },
  {
    id: 2,
    title: 'Second Discipline',
    description: 'Description1',
    icon: 'none',
    numberOfChildren: 1,
    isLeaf: false,
    parentTitle: null,
    needsTrainingSetEndpoint,
    leafDisciplines: [12, 13],
  },
]
