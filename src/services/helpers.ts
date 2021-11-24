import { Article } from '../constants/data'
import { AlternativeWordType, DocumentType } from '../constants/endpoints'
import { COLORS } from '../constants/theme/colors'

export const stringifyDocument = ({ article, word }: DocumentType | AlternativeWordType): string =>
  `${article.value} ${word}`

export const getArticleColor = (article: Article): string => {
  switch (article.id) {
    case 1:
      return COLORS.lunesArtikelDer

    case 2:
      return COLORS.lunesArtikelDas

    case 3:
      return COLORS.lunesArtikelDie

    case 4:
      return COLORS.lunesArtikelDiePlural

    default:
      return COLORS.lunesArtikelDer
  }
}

export const moveToEnd = <T>(array: T[], index: number): T[] => {
  const currDocument = array[index]
  const newDocuments = array.filter(d => d !== currDocument)
  newDocuments.push(currDocument)
  return newDocuments
}

// fix ios issue for Django, that requires trailing slash in request url https://github.com/square/retrofit/issues/1037
export const addTrailingSlashToUrl = (url: string): string => {
  return url.endsWith('/') ? url : `${url}/`
}
