/* src/components/NetworkCheck.jsx */
import { useEffect, useMemo, useState } from "react";
import { IonToast } from "@ionic/react";
import {
  alertCircleOutline,
  cellularOutline,
  cloudOfflineOutline,
  linkOutline,
  wifiOutline,
} from "ionicons/icons";
import { Network } from "@capacitor/network";

const NetworkCheck = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [connectionType, setConnectionType] = useState("unknown");

  const toastIcon = useMemo(() => {
    if (!isConnected) return cloudOfflineOutline;
    if (connectionType === "wifi") return wifiOutline;
    if (connectionType === "cellular") return cellularOutline;
    if (connectionType === "ethernet") return linkOutline;
    return alertCircleOutline;
  }, [connectionType, isConnected]);

  const toastMessage = useMemo(() => {
    if (!isConnected) return "Connexion perdue. Mode hors ligne active.";
    if (connectionType === "wifi") return "Connexion Wi-Fi retablie.";
    if (connectionType === "cellular") return "Connexion mobile retablie.";
    if (connectionType === "ethernet") return "Connexion ethernet retablie.";
    return "Connexion retablie !";
  }, [connectionType, isConnected]);

  useEffect(() => {
    let isMounted = true;

    const getCurrentStatus = async () => {
      try {
        const status = await Network.getStatus();
        if (isMounted) {
          setIsConnected(status.connected);
          setConnectionType(status.connectionType || "unknown");
        }
      } catch (error) {
        // If the plugin is not available (e.g. web without plugin), stay silent.
        if (isMounted) {
          setIsConnected(true);
        }
      }
    };

    getCurrentStatus();

    const networkListener = Network.addListener("networkStatusChange", (status) => {
      setIsConnected(status.connected);
      setConnectionType(status.connectionType || "unknown");
      setShowToast(true);
    });

    return () => {
      isMounted = false;
      networkListener.remove();
    };
  }, []);

  return (
    <IonToast
      isOpen={showToast}
      onDidDismiss={() => setShowToast(false)}
      message={toastMessage}
      icon={toastIcon}
      duration={3000}
      color={isConnected ? "success" : "danger"}
      position="bottom"
      buttons={[
        {
          text: "Fermer",
          role: "cancel",
        },
      ]}
    />
  );
};

export default NetworkCheck;
