import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import * as tripService from "../services/tripServices";

type DialogType = "deleteTrip" | "deleteLog" | null;

type DialogOptions = {
  title: string;
  content: string[];
  actions: { label: string; onClick: () => void }[];
};

interface DialogContextType {
  openDialog: (type: DialogType, params: { id: number }) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType>({
  openDialog: () => {},
  closeDialog: () => {},
});
export const useDialog = () => useContext(DialogContext);
export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [itemId, setItemId] = useState<number | null>(null);

  const openDialog = (type: DialogType, params: { id: number }) => {
    setDialogType(type);
    setDialogOpen(true);
    setItemId(params.id);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
  };

  const renderDialogContent = () => {
    switch (dialogType) {
      case "deleteLog":
        return {
          title: "Delete Trip Confirmation",
          content: [
            "Are you sure you want to delete this Log sheet?",
            "Related trip will also be deleted",
            "This action cannot be undone⚠️",
          ],
          actions: [
            { label: "No", onClick: closeDialog },
            { label: "Yes, Delete", onClick: () => console.log("deelll") },
          ],
        };

      case "deleteTrip":
        return {
          title: "Delete Log Sheet Confirmation",
          content: [
            "Are you sure you want to delete this Trips?",
            "Related Log sheet will also be deleted",
            "This action cannot be undone⚠️",
          ],
          actions: [
            { label: "No", onClick: closeDialog },
            { label: "Yes, Delete", onClick: () => console.log("deelll") },
          ],
        };
      default:
        return null;
    }
  };

  const dialogOptions: DialogOptions | null = renderDialogContent();

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {dialogOptions && (
        <DeleteDialog
        target={dialogType}
          itemId={itemId}
          dialogOptions={dialogOptions}
          dialogOpen={dialogOpen}
          closeDialog={closeDialog}
        />
      )}
    </DialogContext.Provider>
  );
};

interface DeleteDialogProps {
  dialogOptions: DialogOptions;
  dialogOpen: boolean;
  closeDialog: () => void;
  itemId: number | null;
  target: DialogType;
}

const DeleteDialog = ({
  dialogOptions,
  dialogOpen,
  closeDialog,
  itemId,
  target
}: DeleteDialogProps) => {

  const deleteAction = async () => { 
    try {
        if(target === "deleteTrip"){
            const response = await tripService.deleteTrip(itemId as number);
            closeDialog();
        }
     
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      fullWidth={true}
      maxWidth={"sm"}
      onClose={closeDialog}
    >
      <DialogTitle>{dialogOptions.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogOptions.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {dialogOptions.actions.map((action, index) => (
          <Button key={index} onClick={()=>deleteAction()} color="primary">
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};
