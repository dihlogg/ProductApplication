import { Product } from "@/types/conversation";

export const parseBotMessage = (text: string): { products: Product[] } => {
    // console.log("Parsing input:", text);
    const products: Product[] = [];
  
    const productSections = text.split("\n\n").filter((section) => section.trim());
    const sectionsToProcess = productSections.length > 0 ? productSections : [text];
  
    for (const section of sectionsToProcess) {
      const lines = section.split("\n").filter((line) => line.trim());
  
      let price = "";
      let description = "";
      let link = { url: "", label: "" };
  
      for (const line of lines) {
        if (line.includes("có giá")) {
          const priceMatch = line.match(/có giá ([\d.]+)/);
          if (priceMatch) {
            const rawPrice = priceMatch[1].replace(/\./g, "");
            const formattedPrice = Number(rawPrice).toLocaleString("vi-VN");
            price = `${formattedPrice} VNĐ`;
            link.label = line.split(" có giá")[0].trim();
          }
        } else if (line.includes("Giá của")) {
          const priceMatch = line.match(/Giá của (.*?) là ([\d.]+)/);
          if (priceMatch) {
            const rawPrice = priceMatch[2].replace(/\./g, "");
            const formattedPrice = Number(rawPrice).toLocaleString("vi-VN");
            price = `${formattedPrice} VNĐ`;
            if (!link.label) {
              link.label = priceMatch[1].trim();
            }
          }
        } else if (line.includes("Giá") && line.includes("là")) {
          const priceMatch = line.match(/là ([\d.]+)/);
          if (priceMatch) {
            const rawPrice = priceMatch[1].replace(/\./g, "");
            const formattedPrice = Number(rawPrice).toLocaleString("vi-VN");
            price = `${formattedPrice} VNĐ`;
          }
        }
  
        if (line.includes("Bạn có thể xem sản phẩm")) {
          const idMatch = line.match(/([a-f0-9-]{36})/);
          link.url = idMatch ? idMatch[1] : "";
        }
  
        if (line.includes(" - ")) {
          description = line.trim();
          if (!link.label) {
            const labelMatch = line.match(/^([^-]+) -/);
            if (labelMatch) {
              link.label = labelMatch[1].trim();
            }
          }
        }
      }
  
      if (link.url) {
        products.push({
          price: price || "Không có thông tin giá",
          description,
          link: {
            url: link.url,
            label: link.label || "Sản phẩm",
          },
        });
      }
    }
  
    console.log("Parsed products:", products);
    return { products };
  };