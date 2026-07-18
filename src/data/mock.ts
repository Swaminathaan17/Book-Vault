import { Book, Member, Category, ActivityEvent } from '../types';

export const mockCategories: Category[] = [
  { id: 'c1', name: 'Fiction', description: 'Literary works of imagination', color: 'bg-blue-500' },
  { id: 'c2', name: 'Science', description: 'Natural and physical sciences', color: 'bg-green-500' },
  { id: 'c3', name: 'History', description: 'Study of past events', color: 'bg-amber-500' },
  { id: 'c4', name: 'Technology', description: 'Computing and engineering', color: 'bg-indigo-500' },
  { id: 'c5', name: 'Philosophy', description: 'Fundamental nature of knowledge', color: 'bg-purple-500' },
  { id: 'c6', name: 'Biography', description: 'Accounts of people\'s lives', color: 'bg-rose-500' },
];

export const mockMembers: Member[] = [
  { id: 'm1', name: 'Alice Chen', email: 'alice.chen@example.com', phone: '555-0101', joinDate: '2023-01-15', borrowedBooks: ['b2'] },
  { id: 'm2', name: 'Marcus Johnson', email: 'mjohnson@example.com', phone: '555-0102', joinDate: '2023-03-22', borrowedBooks: [] },
  { id: 'm3', name: 'Elena Rodriguez', email: 'erodriguez@example.com', phone: '555-0103', joinDate: '2023-06-10', borrowedBooks: ['b5', 'b8'] },
  { id: 'm4', name: 'David Smith', email: 'dsmith@example.com', phone: '555-0104', joinDate: '2023-08-05', borrowedBooks: [] },
  { id: 'm5', name: 'Sarah Williams', email: 'swilliams@example.com', phone: '555-0105', joinDate: '2023-09-12', borrowedBooks: ['b11'] },
  { id: 'm6', name: 'James Wilson', email: 'jwilson@example.com', phone: '555-0106', joinDate: '2023-11-01', borrowedBooks: [] },
  { id: 'm7', name: 'Wei Zhang', email: 'wzhang@example.com', phone: '555-0107', joinDate: '2024-01-20', borrowedBooks: ['b3'] },
  { id: 'm8', name: 'Olivia Taylor', email: 'otaylor@example.com', phone: '555-0108', joinDate: '2024-02-15', borrowedBooks: [] },
];

export const mockBooks: Book[] = [
  { id: 'b1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', category: 'Fiction', status: 'available', year: 1925, description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.' },
  { id: 'b2', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', category: 'Science', status: 'borrowed', year: 1988, borrowedBy: 'm1', dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], description: 'A landmark volume in science writing by one of the great minds of our time.' },
  { id: 'b3', title: 'The Guns of August', author: 'Barbara W. Tuchman', isbn: '978-0345476098', category: 'History', status: 'borrowed', year: 1962, borrowedBy: 'm7', dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], description: 'A history of the events leading up to and including the first month of World War I.' },
  { id: 'b4', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Technology', status: 'available', year: 2008, description: 'A Handbook of Agile Software Craftsmanship.' },
  { id: 'b5', title: 'Design Patterns', author: 'Erich Gamma et al.', isbn: '978-0201633610', category: 'Technology', status: 'borrowed', year: 1994, borrowedBy: 'm3', dueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], description: 'Elements of Reusable Object-Oriented Software.' },
  { id: 'b6', title: 'Meditations', author: 'Marcus Aurelius', isbn: '978-0812968255', category: 'Philosophy', status: 'available', year: 180, description: 'A series of personal writings by Marcus Aurelius, Roman Emperor.' },
  { id: 'b7', title: 'Steve Jobs', author: 'Walter Isaacson', isbn: '978-1451648539', category: 'Biography', status: 'reserved', year: 2011, description: 'The exclusive biography of Steve Jobs.' },
  { id: 'b8', title: 'Dune', author: 'Frank Herbert', isbn: '978-0441172719', category: 'Fiction', status: 'borrowed', year: 1965, borrowedBy: 'm3', dueDate: '2024-05-22', description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.' },
  { id: 'b9', title: 'Cosmos', author: 'Carl Sagan', isbn: '978-0345331359', category: 'Science', status: 'available', year: 1980, description: 'The story of fifteen billion years of cosmic evolution transforming matter and life into consciousness.' },
  { id: 'b10', title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0062316097', category: 'History', status: 'available', year: 2011, description: 'A Brief History of Humankind.' },
  { id: 'b11', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0135957059', category: 'Technology', status: 'borrowed', year: 1999, borrowedBy: 'm5', dueDate: '2024-05-18', description: 'From Journeyman to Master.' },
  { id: 'b12', title: 'Beyond Good and Evil', author: 'Friedrich Nietzsche', isbn: '978-0140449235', category: 'Philosophy', status: 'available', year: 1886, description: 'Prelude to a Philosophy of the Future.' },
];

export const mockActivities: ActivityEvent[] = [
  { id: 'a1', type: 'borrowed', bookId: 'b2', memberId: 'm1', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), description: 'Alice Chen borrowed A Brief History of Time' },
  { id: 'a2', type: 'returned', bookId: 'b4', memberId: 'm2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), description: 'Marcus Johnson returned Clean Code' },
  { id: 'a3', type: 'added', bookId: 'b12', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), description: 'New book added: Beyond Good and Evil' },
  { id: 'a4', type: 'borrowed', bookId: 'b5', memberId: 'm3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), description: 'Elena Rodriguez borrowed Design Patterns' },
  { id: 'a5', type: 'borrowed', bookId: 'b8', memberId: 'm3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), description: 'Elena Rodriguez borrowed Dune' },
  { id: 'a6', type: 'member_joined', memberId: 'm8', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), description: 'Olivia Taylor joined the library' },
  { id: 'a7', type: 'borrowed', bookId: 'b3', memberId: 'm7', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), description: 'Wei Zhang borrowed The Guns of August' },
  { id: 'a8', type: 'borrowed', bookId: 'b11', memberId: 'm5', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), description: 'Sarah Williams borrowed The Pragmatic Programmer' },
];