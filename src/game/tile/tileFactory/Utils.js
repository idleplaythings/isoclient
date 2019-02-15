export const getRandom = type =>
  Math.floor(Math.random() * type.amount) + type.start;
