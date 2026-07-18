export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: "available" | "borrowed" | "reserved";
  year: number;
  description?: string;
  borrowedBy?: string; // memberId
  dueDate?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  borrowedBooks: string[]; // book ids
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string; // tailwind color token for card accent
}

export interface ActivityEvent {
  id: string;
  type: "borrowed" | "returned" | "added" | "member_joined";
  bookId?: string;
  memberId?: string;
  timestamp: string;
  description: string;
}
