import React, { createContext, useContext, useState, ReactNode } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

type DialogType = "deleteTrip" | "deleteLog" |  null;

interface DialogContextType {
  openDialog: (type: DialogType) => void;
  closeDialog: () => void;
}
export const useDialog = () => useContext(DialogContext);
 
const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);

  const openDialog = (type: DialogType) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
  };

  const renderDialogContent = () => {
    switch (dialogType) {
     
      case "deleteTrip":
        return {
          title: "Delete Confirmation",
          content: "Are you sure you want to delete this Trips?",
          actions: [
            { label: "No", onClick: closeDialog },
            { label: "Yes, Delete", onClick: () => console.log("deelll") },
          ],
        };
      default:
        return null;
    }
  };

  const dialogOptions = renderDialogContent();

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {dialogOptions && (
        <Dialog open={dialogOpen} onClose={closeDialog} >
          <DialogTitle  >{dialogOptions.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogOptions.content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            {dialogOptions.actions.map((action, index) => (
              <Button key={index} onClick={action.onClick}>
                {action.label}
              </Button>
            ))}
          </DialogActions>
        </Dialog>
      )}
    </DialogContext.Provider>
  );
};
