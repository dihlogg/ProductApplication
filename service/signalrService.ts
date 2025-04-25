import { HubConnectionBuilder } from "@microsoft/signalr";

const API_URL = "http://192.168.1.27:5117";

const connectSignalR = async (
  userId: string | null | undefined,
  getCartData: () => Promise<void>
) => {
  const connection = new HubConnectionBuilder()
    .withUrl(`${API_URL}/cartHub?userId=${userId}`)
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
