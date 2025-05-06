import { config } from "@/config/config";
import { HubConnectionBuilder } from "@microsoft/signalr";

const API_BASE_URL = config.API_URL;

const connectSignalR = async (
  userId: string | null | undefined,
  getCartData: () => Promise<void>
) => {
  const connection = new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/cartHub?userId=${userId}`)
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("Connected to SignalR");

    // join hubs group based userId
    await connection.invoke("JoinCartGroup", userId);
    console.log(`Joined group based: ${userId}`);

    connection.on("ReceiveCartUpdate", async (action, cartItem) => {
      console.log(`Cart update received: ${action}`, cartItem);
      await getCartData();
    });

    return connection;
  } catch (err) {
    console.error("Error connecting to SignalR:", err);
  }
};

export default connectSignalR;
