export const renderMilestoneIndex = (item) => {
  const idx = item.milestones.findIndex((x) => x.id === item.milestone_id);
  return idx + 1;
};
