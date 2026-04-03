export type SavingsCategory =
  | "Travel"
  | "Car"
  | "Phone"
  | "House"
  | "Education"
  | "Gift"
  | "Health"
  | "Other";

export type SavingsGoal = {
  id: string;
  title: string;
  category: SavingsCategory;
  color: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
};
