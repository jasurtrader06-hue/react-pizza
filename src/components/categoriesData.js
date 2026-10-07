// "Все" tab shows every category (category = null means "no filter")
export const categories = [
  { id: null, name: 'Все' },
  { id: 0, name: 'Мясные' },
  { id: 4, name: 'Вегетарианская' },
  { id: 1, name: 'Гриль' },
  { id: 2, name: 'Острые' },
  { id: 3, name: 'Закрытые' },
  { id: 5, name: 'Сырные' },
];

export const sortOptions = [
  { id: 'rating', name: 'популярности', order: 'desc' },
  { id: 'price', name: 'по цене', order: 'asc' },
  { id: 'title', name: 'по алфавиту', order: 'asc' },
];

export const typeLabels = { 0: 'тонкое', 1: 'традиционное' };
