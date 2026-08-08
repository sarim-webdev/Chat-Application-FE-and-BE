import { AuthProvider } from "./context/AuthContext";
import CallProvider from "./context/CallContext";
import { ChatProvider } from "./context/ChatContext";
import { GroupProvider } from "./context/GroupContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <GroupProvider>
          <CallProvider>
            <AppRoutes />
          </CallProvider>
        </GroupProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;