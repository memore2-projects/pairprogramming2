const setDateState = (target, dateState) => {
  if (target.closest('.arrow.left')) {
    dateState.date = new Date(dateState.date.getFullYear(), dateState.date.getMonth() - 1, dateState.date.getDate());
  }
  if (target.closest('.arrow.right')) {
    dateState.date = new Date(dateState.date.getFullYear(), dateState.date.getMonth() + 1, dateState.date.getDate());
  }
};

export default setDateState;
