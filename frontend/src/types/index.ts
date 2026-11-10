export interface SchoolClass {
  id: string;
  name: string;
  totalSeats: number;
  heldSeats: number;
  confirmedSeats: number;
  availableSeats: number;
}

export interface StudentHold {
  id: string;
  classId: string;
  studentId: string;
  createdAt: string;
  expiresAt: string;
  status: "HELD" | "CONFIRMED" | "EXPIRED" | "CANCELLED";
  confirmedAt: string | null;
}