import { Article } from '../constants/data'
import { COLORS } from '../constants/theme/colors'

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
