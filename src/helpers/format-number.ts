const formatNumber = (num: number) => {
  return num.toLocaleString().replace(/,/g, ' ')
}

export default formatNumber