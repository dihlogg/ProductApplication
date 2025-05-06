import { config } from "@/config/config";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const API_BASE_URL = config.API_URL;

const connectChatSignalR = async (
  userId: string | null | undefined,
  onMessageReceived: (messageText: string, sender: string) => Promise<void>
) => {
  if (!userId) {
    console.error("UserId is required to connect to SignalR");
    return;
  }

  const connection = new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/chatHub?userId=${userId}`)
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("Connected to Chat SignalR");

    // Tham gia nhóm chat dựa trên userId
    await connection.invoke("JoinChatGroup", userId);
    console.log(`Joined chat group: ${userId}`);

    // Lắng nghe sự kiện ReceiveMessage từ server
    connection.on("ReceiveMessage", async (messageText: string, sender: string) => {
      console.log(`Message received: ${messageText}, Sender: ${sender}`);
      await onMessageReceived(messageText, sender);
    });

    return connection;
  } catch (err) {
    console.error("Error connecting to Chat SignalR:", err);
  }
};

export default connectChatSignalR;