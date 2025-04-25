interface Product {
  price: string;
  description: string;
  link: { url: string; label: string };
}
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  link?: { url: string; label: string };
  products?: Product[];
  imageUrl?: string;
}
