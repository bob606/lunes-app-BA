import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'

export interface ServerResponse {
  id: number
  title: string
  description: string
  icon: string
  total_training_sets: number
  total_discipline_children: number
  total_documents: number
}

const getEndpoint = (parent: Discipline | null): string => {
  if (parent?.needsTrainingSetEndpoint) {
    return ENDPOINTS.trainingSet
  } else if (parent?.apiKey) {
    return ENDPOINTS.disciplinesByGroup
  } else {
    return ENDPOINTS.disciplines
  }
}

const formatServerResponse = (serverResponse: ServerResponse[], parent: Discipline | null): Discipline[] =>
  serverResponse.map(item => ({
    ...item,
    numberOfChildren: item.total_discipline_children || item.total_training_sets || item.total_documents,
    isLeaf: item.total_documents !== undefined,
    isRoot: parent === null,
    apiKey: parent?.apiKey,
    needsTrainingSetEndpoint: !!item.total_training_sets && item.total_training_sets > 0
  })) ?? []

export const loadDisciplines = async (parent: Discipline | null): Promise<Discipline[]> => {
  const url = `${getEndpoint(parent)}/${parent?.id ?? ''}`
  const response = await getFromEndpoint<ServerResponse[]>(url, parent?.apiKey)
  return formatServerResponse(response, parent)
}

export const useLoadDisciplines = (parent: Discipline | null): Return<Discipline[]> =>
  useLoadAsync(loadDisciplines, parent)
