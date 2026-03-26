import { useCallback, useEffect, useRef, useState } from "react";
import { App } from "@capacitor/app";
import { LocalNotifications } from "@capacitor/local-notifications";

const VERSION_URL = "/version.json";

const parseRemoteInfo = (data) => {
  if (!data || typeof data !== "object") return {};
  return {
    version: typeof data.version === "string" ? data.version : null,
    downloadUrl: typeof data.url === "string" ? data.url : null,
    notes: typeof data.notes === "string" ? data.notes : null,
  };
};

const useVersionCheck = () => {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [remoteInfo, setRemoteInfo] = useState(null);
  const [localVersion, setLocalVersion] = useState(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const didNotifyRef = useRef(false);

  const requestNotificationPermission = async () => {
    try {
      await LocalNotifications.requestPermissions();
    } catch (err) {
      // Permission failures should not block the update flow.
      console.warn("LocalNotifications permission error:", err);
    }
  };

  const notifyUpdate = async (version) => {
    if (didNotifyRef.current) return;
    didNotifyRef.current = true;
    await requestNotificationPermission();
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1001,
            title: "Mise à jour disponible",
            body: version
              ? `Nouvelle version ${version} disponible.`
              : "Une nouvelle version est disponible.",
            schedule: { at: new Date(Date.now() + 1500) },
          },
        ],
      });
    } catch (err) {
      console.warn("LocalNotifications schedule error:", err);
    }
  };

  const checkVersion = useCallback(async () => {
    setChecking(true);
    setError(null);
    try {
      const [info, response] = await Promise.all([
        App.getInfo(),
        fetch(VERSION_URL, { cache: "no-store" }),
      ]);

      if (!response.ok) {
        throw new Error(`version.json HTTP ${response.status}`);
      }
      const remoteData = await response.json();
      const parsed = parseRemoteInfo(remoteData);
      setRemoteInfo(parsed);
      setLocalVersion(info?.version || null);

      if (parsed?.version && info?.version && parsed.version !== info.version) {
        setIsUpdateOpen(true);
        await notifyUpdate(parsed.version);
      }
    } catch (err) {
      setError(err);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkVersion();
  }, [checkVersion]);

  const closeUpdate = useCallback(() => {
    setIsUpdateOpen(false);
  }, []);

  return {
    checking,
    error,
    localVersion,
    remoteInfo,
    isUpdateOpen,
    closeUpdate,
    checkVersion,
  };
};

export default useVersionCheck;
