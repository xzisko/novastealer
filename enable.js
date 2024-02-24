const Winreg = require("winreg");

function disableTaskManager() {
  const regKey = new Winreg({
    hive: Winreg.HKCU,
    key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System",
  });

  const valueName = "DisableTaskMgr";
  const disableValue = 1;

  regKey.set(valueName, Winreg.REG_DWORD, disableValue, (err) => {
    if (err) {
      console.error(
        "Erreur lors de la désactivation du Gestionnaire des tâches :",
        err
      );
    } else {
      console.log("Le Gestionnaire des tâches a été désactivé avec succès.");
    }
  });
}

// Fonction pour activer le Gestionnaire des tâches
function enableTaskManager() {
  const regKey = new Winreg({
    hive: Winreg.HKCU, // HKEY_CURRENT_USER
    key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System",
  });

  const valueName = "DisableTaskMgr";

  regKey.remove(valueName, (err) => {
    if (err) {
      console.error(
        "Erreur lors de l'activation du Gestionnaire des tâches :",
        err
      );
    } else {
      console.log("Le Gestionnaire des tâches a été activé avec succès.");
    }
  });
}
enableTaskManager();

